// Configuration
const API_URL = 'https://mc-voice-relay.nemu1.workers.dev'
const WS_URL = 'wss://mc-voice-relay.nemu1.workers.dev/ws'

// State
let currentUser = null
let authToken = null
let ws = null
let pingInterval = null
let myPosition = { x: 0, y: 0, z: 0 }
let players = new Map() // xid -> player data
let radioChannel = null
let micEnabled = false
let audioContext = null
let gainNodes = new Map() // xid -> { gainNode, pannerNode }

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
  const xid = document.getElementById('registerXid').value.trim()
  const username = document.getElementById('registerUsername').value.trim()
  const password = document.getElementById('registerPassword').value

  if (!xid || !username || !password) {
    showError('すべての項目を入力してください')
    return
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xid, username, password })
    })

    const data = await response.json()

    if (data.success) {
      showSuccess('アカウントが作成されました！ログインしてください')
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
      
      // Switch to main app
      document.getElementById('authScreen').style.display = 'none'
      document.getElementById('mainApp').style.display = 'block'
      document.getElementById('currentUsername').textContent = data.username
      
      // Connect WebSocket
      connectWebSocket()
      
      // Check current radio channel
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

let lastPingTime = 0

function connectWebSocket() {
  const url = `${WS_URL}?xid=${encodeURIComponent(currentUser.xid)}`
  ws = new WebSocket(url)
  
  ws.onopen = () => {
    updateWSStatus('connected')
    startPing()
  }
  
  ws.onclose = () => {
    updateWSStatus('closed')
    stopPing()
  }
  
  ws.onerror = () => {
    updateWSStatus('error')
  }
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      handleMessage(data)
    } catch (e) {
      console.error('Parse error:', e)
    }
  }
}

function handleMessage(data) {
  // Pong
  if (data.type === 'pong') {
    const latency = Date.now() - lastPingTime
    document.getElementById('pingDisplay').textContent = latency
    return
  }

  // Position update
  if (data.type === 'pos') {
    players.set(data.xid, data)
    
    // Update my position
    if (data.xid === currentUser.xid) {
      myPosition = { x: data.x, y: data.y, z: data.z }
      document.getElementById('coordX').textContent = data.x.toFixed(2)
      document.getElementById('coordY').textContent = data.y.toFixed(2)
      document.getElementById('coordZ').textContent = data.z.toFixed(2)
    }
    
    updateSpatialAudio()
    renderPlayers()
  }

  // Join
  if (data.type === 'join') {
    console.log('Player joined:', data.name)
  }

  // Quit
  if (data.type === 'quit') {
    players.delete(data.xid)
    renderPlayers()
  }

  // Radio update
  if (data.type === 'radio_update') {
    updateRadioChannels()
  }
}

function updateWSStatus(status) {
  const el = document.getElementById('wsStatus')
  if (status === 'connected') {
    el.textContent = 'WebSocket: 🟢 connected'
    el.className = 'status-badge status-online'
  } else {
    el.textContent = `WebSocket: 🔴 ${status}`
    el.className = 'status-badge status-offline'
  }
}

function startPing() {
  stopPing()
  pingInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      lastPingTime = Date.now()
      ws.send(JSON.stringify({ type: 'ping' }))
    }
  }, 2000)
}

function stopPing() {
  if (pingInterval) {
    clearInterval(pingInterval)
    pingInterval = null
  }
}

document.getElementById('reconnectBtn').addEventListener('click', () => {
  if (ws) ws.close()
  connectWebSocket()
})

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
      
      // Notify other clients
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
    
    // Notify other clients
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

async function updateRadioChannels() {
  // In a real implementation, fetch all active channels
  // For now, this is a placeholder
}

// ============ SPATIAL AUDIO ============

function renderPlayers() {
  const tbody = document.getElementById('spatialPlayers')
  tbody.innerHTML = ''

  for (const [xid, player] of players) {
    if (xid === currentUser.xid) continue

    const distance = calculateDistance(myPosition, player)
    const volume = calculateVolume(xid, distance, player)
    
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${player.name || xid}</td>
      <td class="player-distance">${distance.toFixed(1)}m</td>
      <td class="volume-indicator">${getVolumeIcon(volume)}</td>
    `
    tbody.appendChild(tr)
  }
}

function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  const dz = pos1.z - pos2.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function calculateVolume(xid, distance, player) {
  // Radio takes priority
  if (radioChannel && player.radioChannel === radioChannel) {
    return 1.0
  }

  // Spatial audio
  const maxDistance = 50
  if (distance > maxDistance) return 0
  if (distance < 5) return 1.0
  
  return Math.max(0.01, 1 / (distance / 5))
}

function getVolumeIcon(volume) {
  if (volume === 0) return '🔇'
  if (volume < 0.3) return '🔉'
  if (volume < 0.7) return '🔊'
  return '🔊🔊'
}

function updateSpatialAudio() {
  // This would integrate with Web Audio API
  // For each player, update their gain node based on distance
  for (const [xid, player] of players) {
    if (xid === currentUser.xid) continue
    
    const distance = calculateDistance(myPosition, player)
    const volume = calculateVolume(xid, distance, player)
    
    // Update gain node (placeholder)
    // gainNodes.get(xid)?.gainNode.gain.value = volume
  }
}

// ============ MICROPHONE ============

document.getElementById('micToggle').addEventListener('click', async () => {
  micEnabled = !micEnabled
  const btn = document.getElementById('micToggle')
  
  if (micEnabled) {
    btn.textContent = '🎤 マイク: ON'
    btn.classList.add('btn-active')
    // TODO: Enable microphone and WebRTC
  } else {
    btn.textContent = '🎤 マイク: OFF'
    btn.classList.remove('btn-active')
    // TODO: Disable microphone
  }
})

// ============ INIT ============

console.log('🎙️ Minecraft Voice Chat Client loaded')
console.log('API URL:', API_URL)
