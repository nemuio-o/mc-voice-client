// Configuration
const API_URL = 'https://mc-voice-relay.nemu1.workers.dev'
const WS_URL = 'wss://mc-voice-relay.nemu1.workers.dev/ws'

// State
let currentUser = null
let authToken = null
let ws = null
let radioChannel = null
let micEnabled = false
let pttActive = false
let audioContext = null
let localStream = null

// Audio effects for radio
let radioEffectNode = null
let compressorNode = null

// ============ AUDIO SETUP ============

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  // Create radio effect chain
  compressorNode = audioContext.createDynamicsCompressor()
  compressorNode.threshold.value = -50
  compressorNode.knee.value = 40
  compressorNode.ratio.value = 12
  compressorNode.attack.value = 0
  compressorNode.release.value = 0.25

  // Bandpass filter for radio effect
  const lowpass = audioContext.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 3000 // Cut high frequencies

  const highpass = audioContext.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 300 // Cut low frequencies

  // Connect: compressor -> highpass -> lowpass
  compressorNode.connect(highpass)
  highpass.connect(lowpass)
  
  radioEffectNode = lowpass
}

// Radio beep sound (PTT on/off)
function playBeep(frequency = 800, duration = 100) {
  if (!audioContext) return
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration / 1000)
}

// Double beep for PTT
function playPTTBeep(on = true) {
  if (on) {
    playBeep(1000, 50)
    setTimeout(() => playBeep(1200, 50), 60)
  } else {
    playBeep(1200, 50)
    setTimeout(() => playBeep(1000, 50), 60)
  }
}

// ============ AUTH ============

document.getElementById('showRegister').addEventListener('click', () => {
  document.getElementById('loginForm').classList.add('hidden')
  document.getElementById('registerForm').classList.remove('hidden')
  clearMessages()
})

document.getElementById('showLogin').addEventListener('click', () => {
  document.getElementById('registerForm').classList.add('hidden')
  document.getElementById('loginForm').classList.remove('hidden')
  clearMessages()
})

document.getElementById('registerBtn').addEventListener('click', async () => {
  const username = document.getElementById('registerUsername').value.trim()
  const password = document.getElementById('registerPassword').value

  if (!username || !password) {
    showError('すべての項目を入力してください')
    return
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (data.success) {
      showSuccess(data.message || 'アカウントが作成されました！ログインしてください')
      document.getElementById('showLogin').click()
      document.getElementById('loginUsername').value = username
    } else {
      showError(data.error || '登録に失敗しました')
    }
  } catch (error) {
    showError('サーバーに接続できません')
  }
})

document.getElementById('loginBtn').addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value.trim()
  const password = document.getElementById('loginPassword').value

  if (!username || !password) {
    showError('ユーザー名とパスワードを入力してください')
    return
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (data.success) {
      currentUser = { username: data.username, xid: data.xid }
      authToken = data.token
      
      document.getElementById('authScreen').style.display = 'none'
      document.getElementById('mainApp').style.display = 'block'
      document.getElementById('currentUsername').textContent = data.username
      
      initAudio()
      connectWebSocket()
      checkRadioChannel()
    } else {
      showError(data.error || 'ログインに失敗しました')
    }
  } catch (error) {
    showError('サーバーに接続できません')
  }
})

document.getElementById('logoutBtn').addEventListener('click', async () => {
  if (ws) ws.close()
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop())
  }
  
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
  } catch (e) {}

  currentUser = null
  authToken = null
  
  document.getElementById('mainApp').style.display = 'none'
  document.getElementById('authScreen').style.display = 'block'
})

function showError(message) {
  const el = document.getElementById('authError')
  el.textContent = message
  el.style.display = 'block'
  setTimeout(() => el.style.display = 'none', 5000)
}

function showSuccess(message) {
  const el = document.getElementById('authSuccess')
  el.textContent = message
  el.style.display = 'block'
  setTimeout(() => el.style.display = 'none', 5000)
}

function clearMessages() {
  document.getElementById('authError').style.display = 'none'
  document.getElementById('authSuccess').style.display = 'none'
}

// ============ WEBSOCKET ============

function connectWebSocket() {
  const url = `${WS_URL}?xid=${encodeURIComponent(currentUser.xid)}`
  ws = new WebSocket(url)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
  }
  
  ws.onclose = () => {
    console.log('WebSocket closed')
  }
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      handleMessage(data)
    } catch (e) {}
  }
}

function handleMessage(data) {
  if (data.type === 'radio_update') {
    checkRadioChannel()
  }
}

// ============ PTT RADIO ============

const pttBtn = document.getElementById('pttBtn')
const pttIcon = document.getElementById('pttIcon')

// Mouse events
pttBtn.addEventListener('mousedown', startPTT)
pttBtn.addEventListener('mouseup', stopPTT)
pttBtn.addEventListener('mouseleave', stopPTT)

// Touch events for mobile
pttBtn.addEventListener('touchstart', (e) => {
  e.preventDefault()
  startPTT()
})
pttBtn.addEventListener('touchend', (e) => {
  e.preventDefault()
  stopPTT()
})

// Keyboard support (Space key)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !pttActive && radioChannel) {
    e.preventDefault()
    startPTT()
  }
})

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && pttActive) {
    e.preventDefault()
    stopPTT()
  }
})

async function startPTT() {
  if (!radioChannel) {
    alert('先にラジオチャンネルに参加してください')
    return
  }
  
  if (pttActive) return
  pttActive = true
  
  // Visual feedback
  pttBtn.classList.add('ptt-active')
  pttIcon.textContent = '📡'
  
  // Play beep
  playPTTBeep(true)
  
  // Start microphone
  if (!localStream) {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      // Apply radio effect
      const source = audioContext.createMediaStreamSource(localStream)
      source.connect(compressorNode)
      radioEffectNode.connect(audioContext.destination)
      
      console.log('PTT: Microphone started with radio effect')
    } catch (error) {
      console.error('Microphone error:', error)
      alert('マイクにアクセスできません')
      stopPTT()
      return
    }
  }
  
  // TODO: Start WebRTC transmission
  console.log('PTT: Transmitting...')
}

function stopPTT() {
  if (!pttActive) return
  pttActive = false
  
  // Visual feedback
  pttBtn.classList.remove('ptt-active')
  pttIcon.textContent = '📻'
  
  // Play beep
  playPTTBeep(false)
  
  // TODO: Stop WebRTC transmission (keep stream alive for next PTT)
  console.log('PTT: Stopped')
}

// ============ RADIO ============

document.getElementById('joinRadioBtn').addEventListener('click', async () => {
  const channel = document.getElementById('radioChannelInput').value.trim()
  if (!channel) return

  try {
    const response = await fetch(`${API_URL}/radio/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ channel })
    })

    const data = await response.json()
    if (data.success) {
      radioChannel = channel
      updateRadioUI(channel, data.members)
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'radio_update' }))
      }
    }
  } catch (error) {
    console.error('Radio join error:', error)
  }
})

document.getElementById('leaveRadioBtn').addEventListener('click', async () => {
  try {
    await fetch(`${API_URL}/radio/leave`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })

    radioChannel = null
    updateRadioUI(null, [])
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'radio_update' }))
    }
  } catch (error) {
    console.error('Radio leave error:', error)
  }
})

async function checkRadioChannel() {
  try {
    const response = await fetch(`${API_URL}/radio/current`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })

    const data = await response.json()
    if (data.radioChannel) {
      radioChannel = data.radioChannel.name
      updateRadioUI(data.radioChannel.name, data.radioChannel.members)
    }
  } catch (error) {
    console.error('Check radio error:', error)
  }
}

function updateRadioUI(channel, members) {
  if (channel) {
    document.getElementById('currentRadio').classList.remove('hidden')
    document.getElementById('noRadio').classList.add('hidden')
    document.getElementById('currentRadioName').textContent = channel
    
    const membersDiv = document.getElementById('currentRadioMembers')
    membersDiv.innerHTML = members.map(m => 
      `<span class="radio-member">${m}${m === currentUser.username ? ' (You)' : ''}</span>`
    ).join('')
  } else {
    document.getElementById('currentRadio').classList.add('hidden')
    document.getElementById('noRadio').classList.remove('hidden')
  }
}

// ============ MICROPHONE ============

document.getElementById('micToggle').addEventListener('click', async () => {
  micEnabled = !micEnabled
  const btn = document.getElementById('micToggle')
  
  if (micEnabled) {
    btn.textContent = '🎤 マイク: ON'
    btn.classList.add('btn-active')
  } else {
    btn.textContent = '🎤 マイク: OFF'
    btn.classList.remove('btn-active')
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      localStream = null
    }
  }
})

console.log('🎙️ Minecraft Voice Chat Client loaded (PTT + Radio Effects)')
