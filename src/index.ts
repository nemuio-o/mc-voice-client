export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      })
    }
    
    if (url.pathname === '/app.js') {
      return new Response(VOICE_JS, {
        headers: { 'Content-Type': 'application/javascript; charset=UTF-8' }
      })
    }
    
    if (url.pathname === '/live') {
      return new Response(LIVE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      })
    }
    
    return new Response('Not Found', { status: 404 })
  }
}

const HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎙️ Minecraft Voice Chat</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #eee;
      font-family: 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    #authScreen {
      max-width: 400px;
      margin: 100px auto;
      background: #0f3460;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    #authScreen h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #e94560;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #ddd;
      font-size: 14px;
    }
    
    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #16213e;
      border-radius: 8px;
      background: #1a1a2e;
      color: #eee;
      font-size: 16px;
    }
    
    input:focus {
      outline: none;
      border-color: #e94560;
    }
    
    button {
      width: 100%;
      padding: 14px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    button:hover {
      background: #c13650;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
    }
    
    button:disabled {
      background: #555;
      cursor: not-allowed;
      transform: none;
    }
    
    .toggle-auth {
      text-align: center;
      margin-top: 20px;
      color: #aaa;
      font-size: 14px;
    }
    
    .toggle-auth a {
      color: #e94560;
      text-decoration: none;
      cursor: pointer;
    }
    
    .error, .success {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: none;
    }
    
    .error {
      background: #c13650;
      color: white;
    }
    
    .success {
      background: #48bb78;
      color: white;
    }
    
    #mainApp {
      display: none;
    }
    
    .header {
      background: #0f3460;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .header h1 {
      color: #e94560;
      font-size: 24px;
    }
    
    .controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 8px 16px;
      background: #16213e;
      border: 2px solid #e94560;
      color: #eee;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .btn:hover {
      background: #e94560;
      color: white;
    }
    
    .btn-active {
      background: #e94560;
      color: white;
    }
    
    .ptt-btn {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e94560 0%, #c13650 100%);
      border: 4px solid #0f3460;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2em;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(233, 69, 96, 0.4);
      user-select: none;
    }
    
    .ptt-btn:hover {
      transform: scale(1.05);
    }
    
    .ptt-btn:active {
      transform: scale(0.95);
      box-shadow: 0 2px 8px rgba(233, 69, 96, 0.6);
    }
    
    .ptt-active {
      animation: pttPulse 1s infinite;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      border-color: #48bb78;
    }
    
    @keyframes pttPulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
      }
      50% {
        box-shadow: 0 0 0 20px rgba(72, 187, 120, 0);
      }
    }
    
    .panel {
      background: #0f3460;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      margin-bottom: 20px;
    }
    
    .panel h3 {
      color: #e94560;
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .radio-channel {
      background: #16213e;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 10px;
      border-left: 4px solid #e94560;
    }
    
    .radio-channel h4 {
      color: #e94560;
      margin-bottom: 8px;
    }
    
    .radio-member {
      padding: 6px 12px;
      background: #1a1a2e;
      border-radius: 6px;
      display: inline-block;
      margin: 4px;
      font-size: 13px;
    }
    
    .radio-input-group {
      display: flex;
      gap: 8px;
      margin-top: 15px;
    }
    
    .radio-input-group input {
      flex: 1;
    }
    
    .radio-input-group button {
      width: auto;
      padding: 12px 20px;
    }
    
    .volume-meter-container {
      width: 100%;
      height: 20px;
      background: #16213e;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 10px;
    }
    
    .volume-meter {
      height: 100%;
      background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
      transition: width 0.1s;
      width: 0%;
    }
    
    .status-item {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      margin: 4px;
      font-size: 13px;
    }
    
    .status-online {
      color: #48bb78;
    }
    
    .status-offline {
      color: #ff7c7c;
    }
    
    .hidden {
      display: none !important;
    }
    
    .info-box {
      background: #16213e;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #4299e1;
      margin: 15px 0;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      #mainApp > div[style*="grid"] {
        grid-template-columns: 1fr !important;
      }
    }
  </style>
</head>
<body>
  <div id="authScreen">
    <h1>🎙️ Minecraft Voice Chat</h1>
    <div id="authError" class="error"></div>
    <div id="authSuccess" class="success"></div>
    
    <div id="loginForm">
      <div class="form-group">
        <label>ユーザー名</label>
        <input type="text" id="loginUsername" placeholder="username" />
      </div>
      <div class="form-group">
        <label>パスワード</label>
        <input type="password" id="loginPassword" placeholder="••••••••" />
      </div>
      <button id="loginBtn">ログイン</button>
      <div class="toggle-auth">
        アカウントをお持ちでない方は <a id="showRegister">新規登録</a>
      </div>
    </div>
    
    <div id="registerForm" class="hidden">
      <div class="info-box">
        ⚠️ 先にMinecraftサーバーに参加して、ゲーム内のユーザー名と同じ名前で登録してください
      </div>
      <div class="form-group">
        <label>ユーザー名（Minecraft内と同じ）</label>
        <input type="text" id="registerUsername" placeholder="username" />
      </div>
      <div class="form-group">
        <label>パスワード</label>
        <input type="password" id="registerPassword" placeholder="••••••••" />
      </div>
      <button id="registerBtn">アカウント作成</button>
      <div class="toggle-auth">
        すでにアカウントをお持ちの方は <a id="showLogin">ログイン</a>
      </div>
    </div>
  </div>
  
  <div id="mainApp" class="container">
    <div class="header">
      <div>
        <h1>🎙️ Minecraft Voice Chat</h1>
        <span>ユーザー: <strong id="currentUsername"></strong></span>
      </div>
      <div class="controls">
        <button class="btn" id="micToggle">🎤 マイク: OFF</button>
        <button class="btn" id="logoutBtn">ログアウト</button>
      </div>
    </div>
    
    <div class="panel">
      <h3>📊 接続状態</h3>
      <div>
        <span class="status-item">WebSocket: <span id="wsStatus" class="status-offline">-</span></span>
        <span class="status-item">Ping: <span id="pingDisplay">-</span></span>
        <span class="status-item">WebRTC: <span id="rtcStatus" class="status-offline">-</span></span>
      </div>
      <div class="volume-meter-container">
        <div id="volumeMeter" class="volume-meter"></div>
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:20px">
      <div class="panel" style="text-align:center">
        <h3>📻 ラジオPTT</h3>
        <div style="margin:20px 0">
          <button class="ptt-btn" id="pttBtn">
            <span id="pttIcon">📻</span>
          </button>
        </div>
        <p style="color:#aaa;font-size:14px">押している間だけ送信</p>
        <p style="color:#aaa;font-size:12px;margin-top:8px">キーボード: スペースキー</p>
      </div>
      
      <div class="panel">
        <h3>📻 ラジオチャンネル</h3>
        <div id="currentRadio" class="hidden">
          <div class="radio-channel">
            <h4>📻 <span id="currentRadioName"></span></h4>
            <div id="currentRadioMembers"></div>
            <button class="btn" id="leaveRadioBtn" style="width:100%;margin-top:10px">退出</button>
          </div>
        </div>
        <div id="noRadio">
          <p style="color:#aaa">ラジオに参加していません</p>
        </div>
        <div class="radio-input-group">
          <input type="text" id="radioChannelInput" placeholder="チャンネル名を入力" />
          <button id="joinRadioBtn">参加</button>
        </div>
      </div>
    </div>
  </div>
  
  <script src="/app.js"></script>
</body>
</html>`

const VOICE_JS = `// ============ CONFIGURATION ============
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
let remoteStreams = new Map();
let gainNodes = new Map();
let playerPositions = new Map();
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
  
  radioEffectNode = analyserNode;

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
      document.getElementById('volumeMeter').style.width = '0%';
      requestAnimationFrame(updateMeter);
      return;
    }
    
    analyserNode.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalized = average / 255;
    
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
    const response = await fetch(API_URL + '/voice/token', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to get voice token');
    }

    peerConnection = new RTCPeerConnection({
      iceServers: data.iceServers
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 ICE candidate:', event.candidate);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('📡 Connection state:', peerConnection.connectionState);
      updateConnectionStatus(peerConnection.connectionState);
    };

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
  const match = track.id.match(/-(\d+)$/);
  return match ? match[1] : null;
}

// ============ SPATIAL AUDIO ============

function setupSpatialAudio(xid, stream) {
  const source = audioContext.createMediaStreamSource(stream);
  const gainNode = audioContext.createGain();
  const pannerNode = audioContext.createPanner();

  pannerNode.panningModel = 'HRTF';
  pannerNode.distanceModel = 'inverse';
  pannerNode.refDistance = 5;
  pannerNode.maxDistance = 50;
  pannerNode.rolloffFactor = 1;

  source.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(audioContext.destination);

  gainNodes.set(xid, { gainNode, pannerNode });
  
  console.log('📊 Spatial audio setup for ' + xid);
}

function updateSpatialAudio() {
  for (const [xid, position] of playerPositions) {
    if (xid === currentUser.xid) continue;
    
    const nodes = gainNodes.get(xid);
    if (!nodes) continue;

    const { gainNode, pannerNode } = nodes;

    pannerNode.positionX.value = position.x;
    pannerNode.positionY.value = position.y;
    pannerNode.positionZ.value = position.z;

    const distance = calculateDistance(myPosition, position);
    let volume = calculateVolume(xid, distance);

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
  const playerInfo = playerPositions.get(xid);
  if (radioChannel && playerInfo && playerInfo.radioChannel === radioChannel) {
    return 1.0;
  }

  const maxDistance = 50;
  if (distance > maxDistance) return 0;
  if (distance < 5) return 1.0;
  
  return Math.max(0.01, 1 / (distance / 5));
}

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
    
    if (error.name === 'NotAllowedError') {
      alert('マイクの使用が拒否されました。ブラウザの設定でマイクへのアクセスを許可してください。');
    } else if (error.name === 'NotFoundError') {
      alert('マイクが見つかりません。マイクが接続されているか確認してください。');
    } else {
      alert('マイクエラー: ' + error.message);
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
  
  const pttBtn = document.getElementById('pttBtn');
  const pttIcon = document.getElementById('pttIcon');
  pttBtn.classList.add('ptt-active');
  pttIcon.textContent = '📡';
  
  playPTTBeep(true);
  
  if (!localStream) {
    const success = await getMicrophone();
    if (!success) {
      stopPTT();
      return;
    }
  }
  
  const source = audioContext.createMediaStreamSource(localStream);
  source.connect(compressorNode);
  radioEffectNode.connect(analyserNode);
  
  if (peerConnection) {
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
    
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      const response = await fetch(API_URL + '/voice/sdp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
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
  
  startVolumeMeter();
  
  console.log('🎙️ PTT: Transmitting...');
}

function stopPTT() {
  if (!pttActive) return;
  pttActive = false;
  
  const pttBtn = document.getElementById('pttBtn');
  const pttIcon = document.getElementById('pttIcon');
  pttBtn.classList.remove('ptt-active');
  pttIcon.textContent = '📻';
  
  playPTTBeep(false);
  
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
  ws = new WebSocket(WS_URL + '?xid=' + encodeURIComponent(currentUser.xid));
  
  ws.onopen = () => {
    console.log('🌐 WebSocket connected');
    updateWSStatus('connected');
    startPing();
  };
  
  ws.onclose = () => {
    console.log('🌐 WebSocket closed');
    updateWSStatus('closed');
    stopPing();
    setTimeout(connectWebSocket, 5000);
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
  if (data.type === 'pong') {
    const latency = Date.now() - lastPingTime;
    document.getElementById('pingDisplay').textContent = latency + 'ms';
    return;
  }

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

// ============ AUTH & UI ============

document.getElementById('showRegister').addEventListener('click', () => {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', () => {
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
});

document.getElementById('registerBtn').addEventListener('click', async () => {
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value;
  
  if (!username || !password) {
    alert('すべて入力してください');
    return;
  }
  
  try {
    const response = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('authSuccess').textContent = data.message || 'アカウント作成成功';
      document.getElementById('authSuccess').style.display = 'block';
      document.getElementById('showLogin').click();
      document.getElementById('loginUsername').value = username;
    } else {
      document.getElementById('authError').textContent = data.error;
      document.getElementById('authError').style.display = 'block';
    }
  } catch (error) {
    alert('サーバーに接続できません');
  }
});

document.getElementById('loginBtn').addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    alert('すべて入力してください');
    return;
  }
  
  try {
    const response = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = { username: data.username, xid: data.xid };
      authToken = data.token;
      
      document.getElementById('authScreen').style.display = 'none';
      document.getElementById('mainApp').style.display = 'block';
      document.getElementById('currentUsername').textContent = data.username;
      
      initAudio();
      await setupWebRTC();
      connectWebSocket();
      checkRadioChannel();
    } else {
      document.getElementById('authError').textContent = data.error;
      document.getElementById('authError').style.display = 'block';
    }
  } catch (error) {
    alert('サーバーに接続できません');
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  if (ws) ws.close();
  if (localStream) localStream.getTracks().forEach(track => track.stop());
  
  try {
    await fetch(API_URL + '/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
  } catch (e) {}
  
  currentUser = null;
  authToken = null;
  
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('authScreen').style.display = 'block';
});

// PTT Controls
const pttBtn = document.getElementById('pttBtn');
const pttIcon = document.getElementById('pttIcon');

pttBtn.addEventListener('mousedown', startPTT);
pttBtn.addEventListener('mouseup', stopPTT);
pttBtn.addEventListener('mouseleave', stopPTT);
pttBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startPTT(); });
pttBtn.addEventListener('touchend', (e) => { e.preventDefault(); stopPTT(); });

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !pttActive && radioChannel && document.getElementById('mainApp').style.display !== 'none') {
    e.preventDefault();
    startPTT();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && pttActive) {
    e.preventDefault();
    stopPTT();
  }
});

// Radio Controls
document.getElementById('joinRadioBtn').addEventListener('click', async () => {
  const channel = document.getElementById('radioChannelInput').value.trim();
  if (!channel) return;
  
  try {
    const response = await fetch(API_URL + '/radio/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({ channel })
    });
    
    const data = await response.json();
    
    if (data.success) {
      radioChannel = channel;
      updateRadioUI(channel, data.members);
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'radio_update' }));
      }
    }
  } catch (error) {
    console.error('Radio join error:', error);
  }
});

document.getElementById('leaveRadioBtn').addEventListener('click', async () => {
  try {
    await fetch(API_URL + '/radio/leave', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    radioChannel = null;
    updateRadioUI(null, []);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'radio_update' }));
    }
  } catch (error) {
    console.error('Radio leave error:', error);
  }
});

async function checkRadioChannel() {
  try {
    const response = await fetch(API_URL + '/radio/current', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    const data = await response.json();
    
    if (data.radioChannel) {
      radioChannel = data.radioChannel.name;
      updateRadioUI(data.radioChannel.name, data.radioChannel.members);
    }
  } catch (error) {
    console.error('Check radio error:', error);
  }
}

function updateRadioUI(channel, members) {
  if (channel) {
    document.getElementById('currentRadio').classList.remove('hidden');
    document.getElementById('noRadio').classList.add('hidden');
    document.getElementById('currentRadioName').textContent = channel;
    
    const membersHtml = members.map(m => 
      '<span class="radio-member">' + m + (m === currentUser.username ? ' (You)' : '') + '</span>'
    ).join('');
    
    document.getElementById('currentRadioMembers').innerHTML = membersHtml;
  } else {
    document.getElementById('currentRadio').classList.add('hidden');
    document.getElementById('noRadio').classList.remove('hidden');
  }
}

console.log('🎙️ Complete Voice Chat System loaded');`

const LIVE_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📻 Live Radio Channels</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      color: #eee;
      font-family: 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding: 40px 20px;
      background: rgba(15, 12, 41, 0.6);
      border-radius: 16px;
    }
    
    .header h1 {
      font-size: 3em;
      background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .status-bar {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .status-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 12px 24px;
      border-radius: 20px;
    }
    
    .channels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    
    .channel-card {
      background: rgba(240, 147, 251, 0.1);
      border: 2px solid rgba(240, 147, 251, 0.3);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
    }
    
    .channel-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(240, 147, 251, 0.3);
    }
    
    .channel-name {
      font-size: 1.8em;
      font-weight: 700;
      color: #f093fb;
      margin-bottom: 12px;
    }
    
    .member-count {
      color: #aaa;
      margin-bottom: 16px;
    }
    
    .member-badge {
      background: rgba(255, 255, 255, 0.15);
      padding: 6px 12px;
      border-radius: 12px;
      margin: 4px;
      display: inline-block;
    }
    
    .empty-state {
      text-align: center;
      color: #aaa;
      padding: 60px 20px;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📻 Live Radio Channels</h1>
    </div>
    
    <div class="status-bar">
      <div class="status-item">WebSocket: <span id="wsStatus">🟢</span></div>
      <div class="status-item">チャンネル: <span id="channelCount">0</span></div>
      <div class="status-item">最終更新: <span id="lastUpdate">-</span></div>
    </div>
    
    <div id="channelsContainer" class="channels-grid"></div>
  </div>
  
  <script>
    const API_URL = 'https://mc-voice-relay.nemu1.workers.dev';
    const WS_URL = 'wss://mc-voice-relay.nemu1.workers.dev/ws';
    let ws = null;
    
    function connect() {
      ws = new WebSocket(WS_URL + '?live=true');
      
      ws.onopen = () => {
        document.getElementById('wsStatus').textContent = '🟢';
        fetchChannels();
      };
      
      ws.onclose = () => {
        document.getElementById('wsStatus').textContent = '🔴';
        setTimeout(connect, 5000);
      };
      
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'radio_update') {
            fetchChannels();
          }
        } catch (err) {}
      };
    }
    
    async function fetchChannels() {
      try {
        const response = await fetch(API_URL + '/radio/channels/public');
        const data = await response.json();
        
        if (data.channels) {
          renderChannels(data.channels);
          updateLastUpdate();
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    
    function renderChannels(channels) {
      const container = document.getElementById('channelsContainer');
      
      if (!channels.length) {
        container.innerHTML = '<div class="empty-state">アクティブなチャンネルがありません</div>';
        document.getElementById('channelCount').textContent = '0';
        return;
      }
      
      const html = channels.map(ch => \`
        <div class="channel-card">
          <div class="channel-name">\${ch.name}</div>
          <div class="member-count">👥 \${ch.members.length}人</div>
          <div>
            \${ch.members.map(m => '<span class="member-badge">' + m + '</span>').join('')}
          </div>
        </div>
      \`).join('');
      
      container.innerHTML = html;
      document.getElementById('channelCount').textContent = channels.length;
    }
    
    function updateLastUpdate() {
      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0') + ':' + 
                      now.getSeconds().toString().padStart(2, '0');
      document.getElementById('lastUpdate').textContent = timeStr;
    }
    
    // Initialize
    connect();
    setInterval(fetchChannels, 30000);
  </script>
</body>
</html>`
