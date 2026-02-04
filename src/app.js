// ============ CONFIGURATION ============
const API_URL = 'https://mc-voice-relay.nemu1.workers.dev';
const WS_URL = 'wss://mc-voice-relay.nemu1.workers.dev/ws';

// ============ STATE ============
let currentUser = null;
let authToken = null;
let ws = null;
let radioChannel = null;
let pttActive = false;
let audioContext = null;
let localStream = null;
let peerConnection = null;
let remoteStreams = new Map(); // xid -> MediaStream
let gainNodes = new Map(); // xid -> { gainNode, pannerNode }
let playerPositions = new Map(); // xid -> { x, y, z }
let myPosition = { x: 0, y: 0, z: 0 };

// Audio effect nodes
let radioEffectNode = null;
let compressorNode = null;
let analyserNode = null;

// Ping
let pingInterval = null;
let lastPingTime = 0;

// ============ AUDIO SETUP ============

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Compressor for radio effect
  compressorNode = audioContext.createDynamicsCompressor();
  compressorNode.threshold.value = -50;
  compressorNode.knee.value = 40;
  compressorNode.ratio.value = 12;
  compressorNode.attack.value = 0;
  compressorNode.release.value = 0.25;

  // Bandpass filter for radio effect
  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 3000;

  const highpass = audioContext.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 300;

  // Analyser for volume meter
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 256;

  // Connect: compressor -> highpass -> lowpass -> analyser
  compressorNode.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(analyserNode);
  
  radioEffectNode = analyser;

  console.log('🎵 Audio system initialized');
}

function playBeep(frequency = 800, duration = 100) {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playPTTBeep(on = true) {
  if (on) {
    playBeep(1000, 50);
    setTimeout(() => playBeep(1200, 50), 60);
  } else {
    playBeep(1200, 50);
    setTimeout(() => playBeep(1000, 50), 60);
  }
}

// ============ VOLUME METER ============

function startVolumeMeter() {
  if (!analyserNode) return;
  
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
  
  function updateMeter() {
    if (!pttActive) {
      requestAnimationFrame(updateMeter);
      return;
    }
    
    analyserNode.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalized = average / 255;
    
    // Update UI meter (implement in HTML)
    const meter = document.getElementById('volumeMeter');
    if (meter) {
      meter.style.width = (normalized * 100) + '%';
    }
    
    requestAnimationFrame(updateMeter);
  }
  
  updateMeter();
}

// ============ WEBRTC SETUP ============

async function setupWebRTC() {
  try {
    // Get token from server
    const response = await fetch(`${API_URL}/voice/token`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to get voice token');
    }

    // Create peer connection
    peerConnection = new RTCPeerConnection({
      iceServers: data.iceServers
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 ICE candidate:', event.candidate);
      }
    };

    // Handle connection state
    peerConnection.onconnectionstatechange = () => {
      console.log('📡 Connection state:', peerConnection.connectionState);
      updateConnectionStatus(peerConnection.connectionState);
    };

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      console.log('🎵 Received track from:', event.track.id);
      const [stream] = event.streams;
      const xid = extractXIDFromTrack(event.track);
      
      if (xid) {
        remoteStreams.set(xid, stream);
        setupSpatialAudio(xid, stream);
      }
    };

    console.log('✅ WebRTC initialized');
    return true;
  } catch (error) {
    console.error('❌ WebRTC setup failed:', error);
    return false;
  }
}

function extractXIDFromTrack(track) {
  // Extract XID from track ID or label
  const match = track.id.match(/-(\d+)$/);
  return match ? match[1] : null;
}

// ============ SPATIAL AUDIO ============

function setupSpatialAudio(xid, stream) {
  const source = audioContext.createMediaStreamSource(stream);
  const gainNode = audioContext.createGain();
  const pannerNode = audioContext.createPanner();

  // Configure panner for 3D audio
  pannerNode.panningModel = 'HRTF';
  pannerNode.distanceModel = 'inverse';
  pannerNode.refDistance = 5;
  pannerNode.maxDistance = 50;
  pannerNode.rolloffFactor = 1;

  // Connect nodes
  source.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(audioContext.destination);

  gainNodes.set(xid, { gainNode, pannerNode });
  
  console.log(`🔊 Spatial audio setup for ${xid}`);
}

function updateSpatialAudio() {
  for (const [xid, position] of playerPositions) {
    if (xid === currentUser.xid) continue;
    
    const nodes = gainNodes.get(xid);
    if (!nodes) continue;

    const { gainNode, pannerNode } = nodes;

    // Update position
    pannerNode.positionX.value = position.x;
    pannerNode.positionY.value = position.y;
    pannerNode.positionZ.value = position.z;

    // Calculate distance
    const distance = calculateDistance(myPosition, position);

    // Calculate volume
    let volume = calculateVolume(xid, distance);

    // Apply volume
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  }
}

function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateVolume(xid, distance) {
  // Radio channel takes priority
  const playerInfo = playerPositions.get(xid);
  if (radioChannel && playerInfo && playerInfo.radioChannel === radioChannel) {
    return 1.0; // Full volume for radio
  }

  // Spatial audio volume based on distance
  const maxDistance = 50;
  if (distance > maxDistance) return 0;
  if (distance < 5) return 1.0;
  
  return Math.max(0.01, 1 / (distance / 5));
}

// Update listener position
function updateListenerPosition(x, y, z) {
  if (!audioContext) return;
  
  myPosition = { x, y, z };
  
  audioContext.listener.positionX.value = x;
  audioContext.listener.positionY.value = y;
  audioContext.listener.positionZ.value = z;
  
  updateSpatialAudio();
}

// ============ MICROPHONE ============

async function getMicrophone() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000
      }
    });
    
    console.log('🎤 Microphone access granted');
    return true;
  } catch (error) {
    console.error('❌ Microphone error:', error);
    
    // Detailed error message
    if (error.name === 'NotAllowedError') {
      alert('マイクの使用が拒否されました。ブラウザの設定でマイクへのアクセスを許可してください。');
    } else if (error.name === 'NotFoundError') {
      alert('マイクが見つかりません。マイクが接続されているか確認してください。');
    } else {
      alert(`マイクエラー: ${error.message}`);
    }
    
    return false;
  }
}

// ============ PTT LOGIC ============

async function startPTT() {
  if (!radioChannel) {
    alert('先にラジオチャンネルに参加してください');
    return;
  }
  
  if (pttActive) return;
  pttActive = true;
  
  // Visual feedback
  const pttBtn = document.getElementById('pttBtn');
  const pttIcon = document.getElementById('pttIcon');
  pttBtn.classList.add('ptt-active');
  pttIcon.textContent = '📡';
  
  // Play beep
  playPTTBeep(true);
  
  // Get microphone if not already
  if (!localStream) {
    const success = await getMicrophone();
    if (!success) {
      stopPTT();
      return;
    }
  }
  
  // Apply radio effect
  const source = audioContext.createMediaStreamSource(localStream);
  source.connect(compressorNode);
  radioEffectNode.connect(analyserNode);
  
  // Add tracks to peer connection
  if (peerConnection) {
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    // Create and send offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      const response = await fetch(`${API_URL}/voice/sdp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ offer })
      });
      
      const data = await response.json();
      if (data.success) {
        await peerConnection.setRemoteDescription(data.answer);
        console.log('✅ PTT: Connected');
      }
    } catch (error) {
      console.error('❌ PTT: Connection failed:', error);
    }
  }
  
  // Start volume meter
  startVolumeMeter();
  
  console.log('🎙️ PTT: Transmitting...');
}

function stopPTT() {
  if (!pttActive) return;
  pttActive = false;
  
  // Visual feedback
  const pttBtn = document.getElementById('pttBtn');
  const pttIcon = document.getElementById('pttIcon');
  pttBtn.classList.remove('ptt-active');
  pttIcon.textContent = '📻';
  
  // Play beep
  playPTTBeep(false);
  
  // Remove tracks from peer connection
  if (peerConnection && localStream) {
    const senders = peerConnection.getSenders();
    senders.forEach(sender => {
      if (sender.track) {
        peerConnection.removeTrack(sender);
      }
    });
  }
  
  console.log('🎙️ PTT: Stopped');
}

// ============ WEBSOCKET ============

function connectWebSocket() {
  ws = new WebSocket(`${WS_URL}?xid=${encodeURIComponent(currentUser.xid)}`);
  
  ws.onopen = () => {
    console.log('🌐 WebSocket connected');
    updateWSStatus('connected');
    startPing();
  };
  
  ws.onclose = () => {
    console.log('🌐 WebSocket closed');
    updateWSStatus('closed');
    stopPing();
    setTimeout(connectWebSocket, 5000); // Auto-reconnect
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handleMessage(data);
    } catch (e) {
      console.error('Parse error:', e);
    }
  };
}

function handleMessage(data) {
  // Pong
  if (data.type === 'pong') {
    const latency = Date.now() - lastPingTime;
    document.getElementById('pingDisplay').textContent = latency + 'ms';
    return;
  }

  // Position update
  if (data.type === 'pos') {
    playerPositions.set(data.xid, {
      x: data.x,
      y: data.y,
      z: data.z,
      radioChannel: data.radioChannel
    });
    
    if (data.xid === currentUser.xid) {
      updateListenerPosition(data.x, data.y, data.z);
    } else {
      updateSpatialAudio();
    }
  }

  // Radio update
  if (data.type === 'radio_update') {
    checkRadioChannel();
  }
}

function startPing() {
  stopPing();
  pingInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      lastPingTime = Date.now();
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 2000);
}

function stopPing() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  document.getElementById('pingDisplay').textContent = '-';
}

function updateWSStatus(status) {
  const el = document.getElementById('wsStatus');
  if (status === 'connected') {
    el.textContent = '🟢 接続中';
    el.className = 'status-online';
  } else {
    el.textContent = '🔴 ' + status;
    el.className = 'status-offline';
  }
}

function updateConnectionStatus(status) {
  const el = document.getElementById('rtcStatus');
  if (!el) return;
  
  const statusMap = {
    'connected': '🟢 接続',
    'connecting': '🟡 接続中',
    'disconnected': '🔴 切断',
    'failed': '❌ 失敗'
  };
  
  el.textContent = statusMap[status] || status;
}

// ============ AUTH ============
// (既存のauth.jsのコードをここに統合)

console.log('🎙️ Complete Voice Chat System loaded');
