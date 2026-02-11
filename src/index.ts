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
    
    return new Response('Not Found', { status: 404 })
  }
}

const HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <title>🎙️ Voice Chat</title>
  <style>
    :root {
      --bg-primary: #000000;
      --bg-secondary: #1c1c1e;
      --bg-tertiary: #2c2c2e;
      --bg-elevated: #3a3a3c;
      --text-primary: #ffffff;
      --text-secondary: #ebebf5;
      --text-tertiary: #ebebf599;
      --accent: #0a84ff;
      --accent-hover: #409cff;
      --destructive: #ff453a;
      --success: #32d74b;
      --warning: #ffd60a;
      --separator: #38383a;
      --radio-accent: #ff9f0a;
      --spatial-accent: #64d2ff;
    }
    
    .light-mode {
      --bg-primary: #ffffff;
      --bg-secondary: #f2f2f7;
      --bg-tertiary: #ffffff;
      --bg-elevated: #ffffff;
      --text-primary: #000000;
      --text-secondary: #3c3c43;
      --text-tertiary: #3c3c4399;
      --accent: #007aff;
      --accent-hover: #0051d5;
      --destructive: #ff3b30;
      --success: #34c759;
      --warning: #ff9500;
      --separator: #d1d1d6;
      --radio-accent: #ff9500;
      --spatial-accent: #00c7be;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      overflow-x: hidden;
      transition: background-color 0.3s, color 0.3s;
    }
    
    /* Auth Screen */
    #authScreen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    }
    
    .auth-container {
      width: 100%;
      max-width: 400px;
      padding: 0 20px;
    }
    
    .auth-logo {
      text-align: center;
      font-size: 4rem;
      margin-bottom: 20px;
    }
    
    .auth-title {
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .auth-subtitle {
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: 40px;
      font-size: 15px;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .form-input {
      width: 100%;
      padding: 16px;
      background: var(--bg-secondary);
      border: 1px solid var(--separator);
      border-radius: 12px;
      color: var(--text-primary);
      font-size: 17px;
      transition: all 0.2s;
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--accent);
      background: var(--bg-tertiary);
    }
    
    .btn-primary {
      width: 100%;
      padding: 16px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 17px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 24px;
    }
    
    .btn-primary:active {
      transform: scale(0.98);
      opacity: 0.8;
    }
    
    .auth-link {
      text-align: center;
      margin-top: 20px;
      color: var(--accent);
      font-size: 15px;
      cursor: pointer;
    }
    
    .alert {
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 14px;
      display: none;
    }
    
    .alert-error {
      background: var(--destructive);
      color: white;
    }
    
    .alert-success {
      background: var(--success);
      color: white;
    }
    
    .alert-warning {
      background: var(--warning);
      color: var(--text-primary);
    }
    
    /* Main App */
    #mainApp {
      display: none;
      min-height: 100vh;
      padding-bottom: calc(70px + env(safe-area-inset-bottom));
    }
    
    /* Header */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-secondary);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 12px 20px;
      padding-top: calc(12px + env(safe-area-inset-top));
      border-bottom: 0.5px solid var(--separator);
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .header-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .theme-toggle {
      width: 40px;
      height: 40px;
      background: var(--bg-elevated);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .theme-toggle:active {
      transform: scale(0.9);
    }
    
    .status-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .status-pill {
      padding: 6px 12px;
      background: var(--bg-elevated);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
    }
    
    .status-dot.error {
      background: var(--destructive);
    }
    
    /* Content */
    .app-content {
      padding: 20px;
    }
    
    .card {
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;
      border: 0.5px solid var(--separator);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .card-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    
    .card-badge {
      padding: 4px 10px;
      background: var(--accent);
      color: white;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    /* Mic Controls */
    .mic-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .mic-btn {
      padding: 16px;
      background: var(--bg-elevated);
      border: 2px solid transparent;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    .mic-btn .icon {
      font-size: 24px;
    }
    
    .mic-btn:active {
      transform: scale(0.95);
    }
    
    .mic-btn.active {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
    }
    
    .mic-btn.spatial.active {
      border-color: var(--spatial-accent);
      background: var(--spatial-accent);
    }
    
    .mic-btn.radio.active {
      border-color: var(--radio-accent);
      background: var(--radio-accent);
    }
    
    /* PTT Button */
    .ptt-container {
      text-align: center;
      padding: 30px 0;
    }
    
    .ptt-btn {
      width: 140px;
      height: 140px;
      background: linear-gradient(135deg, var(--radio-accent) 0%, #ff6b00 100%);
      border: none;
      border-radius: 50%;
      font-size: 50px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(255, 159, 10, 0.3);
      transition: all 0.2s;
      position: relative;
    }
    
    .ptt-btn:active {
      transform: scale(0.92);
    }
    
    .ptt-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    .ptt-btn.active {
      animation: pttPulse 1.5s infinite;
      background: linear-gradient(135deg, var(--success) 0%, #28a745 100%);
      box-shadow: 0 8px 32px rgba(50, 215, 75, 0.5);
    }
    
    @keyframes pttPulse {
      0%, 100% {
        box-shadow: 0 8px 32px rgba(50, 215, 75, 0.5);
      }
      50% {
        box-shadow: 0 8px 48px rgba(50, 215, 75, 0.8), 0 0 0 20px rgba(50, 215, 75, 0);
      }
    }
    
    .ptt-label {
      margin-top: 12px;
      font-size: 13px;
      color: var(--text-secondary);
    }
    
    /* Radio Input */
    .radio-input-group {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    
    .radio-input {
      flex: 1;
      padding: 12px 16px;
      background: var(--bg-elevated);
      border: 1px solid var(--separator);
      border-radius: 12px;
      color: var(--text-primary);
      font-size: 15px;
    }
    
    .btn-small {
      padding: 12px 20px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }
    
    .btn-small:active {
      opacity: 0.8;
    }
    
    .current-channel {
      margin-top: 12px;
      padding: 12px;
      background: var(--bg-elevated);
      border-radius: 12px;
      border-left: 4px solid var(--radio-accent);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .channel-info {
      font-size: 14px;
      font-weight: 600;
    }
    
    .btn-text {
      color: var(--destructive);
      background: none;
      border: none;
      padding: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    
    /* Settings */
    .setting-item {
      margin-bottom: 20px;
    }
    
    .setting-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .setting-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .setting-value {
      font-size: 15px;
      font-weight: 700;
      color: var(--accent);
    }
    
    .slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: var(--separator);
      outline: none;
      -webkit-appearance: none;
      appearance: none;
    }
    
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    /* Toggle Switch */
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }
    
    .toggle-switch {
      position: relative;
      width: 51px;
      height: 31px;
    }
    
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: var(--separator);
      transition: 0.3s;
      border-radius: 31px;
    }
    
    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 27px;
      width: 27px;
      left: 2px;
      bottom: 2px;
      background: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    input:checked + .toggle-slider {
      background: var(--success);
    }
    
    input:checked + .toggle-slider:before {
      transform: translateX(20px);
    }
    
    /* Players List */
    .player-item {
      padding: 12px;
      background: var(--bg-elevated);
      border-radius: 12px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .player-info {
      flex: 1;
    }
    
    .player-name {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .player-distance {
      font-size: 13px;
      color: var(--text-secondary);
    }
    
    .volume-indicator {
      width: 60px;
      height: 4px;
      background: var(--separator);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }
    
    .volume-bar {
      height: 100%;
      background: var(--success);
      transition: width 0.1s;
      border-radius: 2px;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-tertiary);
      font-size: 14px;
    }
    
    .hidden {
      display: none !important;
    }
    
    /* Bottom Tab Bar */
    .tab-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 0.5px solid var(--separator);
      padding-bottom: env(safe-area-inset-bottom);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      z-index: 100;
    }
    
    .tab-item {
      padding: 10px;
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .tab-item .icon {
      font-size: 24px;
    }
    
    .tab-item.active {
      color: var(--accent);
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    @media (min-width: 768px) {
      .app-content {
        max-width: 800px;
        margin: 0 auto;
      }
    }
  </style>
</head>
<body>
  <!-- Auth Screen -->
  <div id="authScreen">
    <div class="auth-container">
      <div class="auth-logo">🎙️</div>
      <h1 class="auth-title">Voice Chat</h1>
      <p class="auth-subtitle">Minecraft ボイスチャット</p>
      
      <div id="authError" class="alert alert-error"></div>
      <div id="authSuccess" class="alert alert-success"></div>
      
      <div id="loginForm">
        <div class="form-group">
          <label class="form-label">ユーザー名</label>
          <input type="text" class="form-input" id="loginUsername" autocomplete="username" placeholder="Minecraftと同じ名前" />
        </div>
        <div class="form-group">
          <label class="form-label">パスワード</label>
          <input type="password" class="form-input" id="loginPassword" autocomplete="current-password" placeholder="パスワード" />
        </div>
        <button class="btn-primary" id="loginBtn">ログイン</button>
        <div class="auth-link" id="showRegister">アカウントを作成</div>
      </div>
      
      <div id="registerForm" class="hidden">
        <div class="alert alert-warning" style="display:block">
          ⚠️ 先にMinecraftサーバーに参加してください
        </div>
        <div class="form-group">
          <label class="form-label">ユーザー名</label>
          <input type="text" class="form-input" id="registerUsername" autocomplete="username" placeholder="Minecraft内と同じ" />
        </div>
        <div class="form-group">
          <label class="form-label">パスワード</label>
          <input type="password" class="form-input" id="registerPassword" autocomplete="new-password" placeholder="パスワード" />
        </div>
        <button class="btn-primary" id="registerBtn">アカウント作成</button>
        <div class="auth-link" id="showLogin">ログインに戻る</div>
      </div>
    </div>
  </div>
  
  <!-- Main App -->
  <div id="mainApp">
    <div class="app-header">
      <div class="header-top">
        <h1 class="header-title">Voice Chat</h1>
        <button class="theme-toggle" id="themeToggle">🌙</button>
      </div>
      <div class="status-pills">
        <div class="status-pill">
          <span class="status-dot" id="wsStatusDot"></span>
          <span id="wsStatusText">接続中</span>
        </div>
        <div class="status-pill">
          <span>⚡</span>
          <span id="pingDisplay">-</span>
        </div>
        <div class="status-pill">
          <span>👤</span>
          <span id="currentUsername"></span>
        </div>
      </div>
    </div>
    
    <div class="app-content">
      <!-- Radio Tab -->
      <div id="radioTab" class="tab-content active">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">📻 ラジオ</h2>
          </div>
          
          <div class="mic-grid">
            <button class="mic-btn spatial" id="spatialMicBtn">
              <span class="icon">🌍</span>
              <span>空間音声</span>
            </button>
            <button class="mic-btn radio" id="radioMicBtn">
              <span class="icon">📻</span>
              <span>ラジオ</span>
            </button>
          </div>
          
          <div class="ptt-container">
            <button class="ptt-btn" id="pttBtn" disabled>
              <span>📻</span>
            </button>
            <div class="ptt-label" id="pttLabel">ラジオマイクをON</div>
          </div>
          
          <div id="channelJoin">
            <div class="radio-input-group">
              <input type="text" class="radio-input" id="radioChannelInput" placeholder="チャンネル名を入力" />
              <button class="btn-small" id="joinRadioBtn">参加</button>
            </div>
          </div>
          
          <div id="currentChannel" class="hidden">
            <div class="current-channel">
              <div class="channel-info">
                <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px">接続中</div>
                <div id="currentChannelName"></div>
              </div>
              <button class="btn-text" id="leaveRadioBtn">退出</button>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">マイク連動</h2>
            <div class="toggle-row" style="margin:0">
              <label class="toggle-switch">
                <input type="checkbox" id="micLinkToggle">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <p style="font-size:13px;color:var(--text-secondary)">
            ラジオマイクON時に空間音声を自動でOFF
          </p>
        </div>
      </div>
      
      <!-- Players Tab -->
      <div id="playersTab" class="tab-content">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">範囲内のプレイヤー</h2>
            <span class="card-badge" id="playerCount">0</span>
          </div>
          <div id="playersList"></div>
        </div>
      </div>
      
      <!-- Settings Tab -->
      <div id="settingsTab" class="tab-content">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">音声設定</h2>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">🔊 全体音量</span>
              <span class="setting-value"><span id="masterVolumeValue">100</span>%</span>
            </div>
            <input type="range" class="slider" id="masterVolumeSlider" min="0" max="100" value="100" step="5" />
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">📢 最大聴取距離</span>
              <span class="setting-value"><span id="maxDistanceValue">50</span>m</span>
            </div>
            <input type="range" class="slider" id="maxDistanceSlider" min="10" max="200" value="50" step="10" />
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">🎯 最小距離</span>
              <span class="setting-value"><span id="minDistanceValue">5</span>m</span>
            </div>
            <input type="range" class="slider" id="minDistanceSlider" min="1" max="20" value="5" step="1" />
          </div>
        </div>
        
        <div class="card">
          <button class="btn-primary" id="logoutBtn" style="background:var(--destructive);margin:0">
            ログアウト
          </button>
        </div>
      </div>
    </div>
    
    <!-- Bottom Tab Bar -->
    <div class="tab-bar">
      <button class="tab-item active" data-tab="radioTab">
        <span class="icon">📻</span>
        <span>ラジオ</span>
      </button>
      <button class="tab-item" data-tab="playersTab">
        <span class="icon">👥</span>
        <span>プレイヤー</span>
      </button>
      <button class="tab-item" data-tab="settingsTab">
        <span class="icon">⚙️</span>
        <span>設定</span>
      </button>
    </div>
  </div>
  
  <script src="/app.js"></script>
</body>
</html>`

const VOICE_JS = `
console.log('🎙️ Voice Chat System - Final Production Version');
const API_URL='https://mc-voice-relay.nemu1.workers.dev';
const WS_URL='wss://mc-voice-relay.nemu1.workers.dev/ws';

let currentUser=null,authToken=null,ws=null,radioChannel=null;
let spatialMicEnabled=false,radioMicEnabled=false,pttActive=false;
let audioContext=null,localStream=null;
let playerPositions=new Map(),myPosition={x:0,y:0,z:0};
let gainNodes=new Map(),analyserNodes=new Map();
let spatialGainNodes=new Map(),radioGainNodes=new Map(),radioEffectNodes=new Map();
let compressorNode=null,analyserNode=null,noiseBuffer=null;
let pingInterval=null,lastPingTime=0;
let maxDistance=50,minDistance=5,masterVolume=1.0;
let micStatusMap=new Map(),radioMicStatusMap=new Map();
let micLinkEnabled=false;
let isDarkMode=true;

// Theme Toggle
function toggleTheme(){
  isDarkMode=!isDarkMode;
  document.body.classList.toggle('light-mode',!isDarkMode);
  document.getElementById('themeToggle').textContent=isDarkMode?'🌙':'☀️';
  localStorage.setItem('theme',isDarkMode?'dark':'light');
}

// Load saved theme
const savedTheme=localStorage.getItem('theme');
if(savedTheme==='light'){
  isDarkMode=false;
  document.body.classList.add('light-mode');
  document.getElementById('themeToggle').textContent='☀️';
}

document.getElementById('themeToggle').addEventListener('click',toggleTheme);

// Tab Navigation
document.querySelectorAll('.tab-item').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const tabId=btn.dataset.tab;
    document.querySelectorAll('.tab-item').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

// Audio Init
function initAudio(){
  try{
    audioContext=new(window.AudioContext||window.webkitAudioContext)();
    compressorNode=audioContext.createDynamicsCompressor();
    compressorNode.threshold.value=-50;
    compressorNode.knee.value=40;
    compressorNode.ratio.value=12;
    analyserNode=audioContext.createAnalyser();
    analyserNode.fftSize=256;
    createNoiseBuffer();
    console.log('✅ Audio initialized');
  }catch(err){
    console.error('❌ Audio init:',err);
  }
}

function createNoiseBuffer(){
  const bufferSize=audioContext.sampleRate*2;
  noiseBuffer=audioContext.createBuffer(1,bufferSize,audioContext.sampleRate);
  const output=noiseBuffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++)output[i]=Math.random()*2-1;
}

function playBeep(freq=800,dur=100){
  if(!audioContext)return;
  try{
    const osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type='sine';osc.frequency.value=freq;
    gain.gain.setValueAtTime(0.3,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+dur/1000);
    osc.connect(gain);gain.connect(audioContext.destination);
    osc.start(audioContext.currentTime);osc.stop(audioContext.currentTime+dur/1000);
  }catch(err){}
}

function playPTTBeep(on){
  if(on){playBeep(1000,50);setTimeout(()=>playBeep(1200,50),60)}
  else{playBeep(1200,50);setTimeout(()=>playBeep(1000,50),60)}
}

function setupPlayerAudio(xid,stream){
  if(!audioContext)return;
  try{
    const source=audioContext.createMediaStreamSource(stream);
    const spatialGain=audioContext.createGain();
    const spatialPanner=audioContext.createPanner();
    spatialPanner.panningModel='HRTF';
    spatialPanner.distanceModel='inverse';
    spatialPanner.refDistance=minDistance;
    spatialPanner.maxDistance=maxDistance;
    spatialPanner.rolloffFactor=1;
    
    const radioGain=audioContext.createGain();
    const radioHighpass=audioContext.createBiquadFilter();
    radioHighpass.type='highpass';radioHighpass.frequency.value=400;
    const radioLowpass=audioContext.createBiquadFilter();
    radioLowpass.type='lowpass';radioLowpass.frequency.value=2500;
    
    const noiseSource=audioContext.createBufferSource();
    noiseSource.buffer=noiseBuffer;noiseSource.loop=true;
    const noiseGain=audioContext.createGain();
    noiseGain.gain.value=0.02;
    
    const analyser=audioContext.createAnalyser();
    analyser.fftSize=256;
    const masterGain=audioContext.createGain();
    masterGain.gain.value=masterVolume;
    
    source.connect(spatialGain);
    spatialGain.connect(spatialPanner);
    spatialPanner.connect(masterGain);
    
    source.connect(radioHighpass);
    radioHighpass.connect(radioLowpass);
    radioLowpass.connect(radioGain);
    radioGain.connect(masterGain);
    
    noiseSource.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
    
    masterGain.connect(analyser);
    analyser.connect(audioContext.destination);
    
    spatialGainNodes.set(xid,{gain:spatialGain,panner:spatialPanner});
    radioGainNodes.set(xid,radioGain);
    gainNodes.set(xid,masterGain);
    analyserNodes.set(xid,analyser);
    radioEffectNodes.set(xid,{radioHighpass,radioLowpass,noiseGain,noiseSource});
    
    console.log(\`🔊 Audio: \${xid}\`);
  }catch(err){console.error('Audio setup:',err)}
}

function updateSpatialAudio(){
  for(const[xid,pos]of playerPositions){
    if(xid===currentUser.xid)continue;
    const spatialNodes=spatialGainNodes.get(xid);
    const radioGain=radioGainNodes.get(xid);
    if(!spatialNodes||!radioGain)continue;
    
    const{gain:spatialGain,panner}=spatialNodes;
    panner.positionX.value=pos.x;
    panner.positionY.value=pos.y;
    panner.positionZ.value=pos.z;
    
    const dist=Math.sqrt((myPosition.x-pos.x)**2+(myPosition.y-pos.y)**2+(myPosition.z-pos.z)**2);
    const isRadioActive=radioChannel&&pos.radioChannel===radioChannel&&radioMicStatusMap.get(xid);
    
    if(isRadioActive){
      spatialGain.gain.setValueAtTime(0,audioContext.currentTime);
      radioGain.gain.setValueAtTime(1.0,audioContext.currentTime);
    }else{
      const spatialVol=calculateSpatialVolume(dist);
      spatialGain.gain.setValueAtTime(spatialVol,audioContext.currentTime);
      radioGain.gain.setValueAtTime(0,audioContext.currentTime);
    }
  }
  updatePlayersList();
}

function calculateSpatialVolume(dist){
  if(dist>maxDistance)return 0;
  if(dist<minDistance)return 1.0;
  return Math.max(0.01,1/(dist/minDistance));
}

function updatePlayersList(){
  const container=document.getElementById('playersList');
  const countEl=document.getElementById('playerCount');
  if(!container)return;
  
  const nearby=[];
  for(const[xid,pos]of playerPositions){
    if(xid===currentUser.xid)continue;
    const dist=Math.sqrt((myPosition.x-pos.x)**2+(myPosition.y-pos.y)**2+(myPosition.z-pos.z)**2);
    const spatialMicOn=micStatusMap.get(xid)||false;
    const radioMicOn=radioMicStatusMap.get(xid)||false;
    const isRadioActive=radioChannel&&pos.radioChannel===radioChannel&&radioMicOn;
    
    if(dist<=maxDistance&&(spatialMicOn||radioMicOn)){
      nearby.push({xid,name:pos.name||xid,dist:Math.round(dist),isRadio:isRadioActive,spatialMicOn,radioMicOn});
    }
  }
  
  nearby.sort((a,b)=>a.dist-b.dist);
  if(countEl)countEl.textContent=nearby.length;
  
  if(!nearby.length){
    container.innerHTML='<div class="empty-state">範囲内にプレイヤーはいません</div>';
    return;
  }
  
  container.innerHTML=nearby.map(p=>{
    const analyser=analyserNodes.get(p.xid);
    let realVol=0;
    if(analyser){
      try{
        const dataArray=new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const avg=dataArray.reduce((a,b)=>a+b)/dataArray.length;
        realVol=Math.min(1,avg/255);
      }catch(err){}
    }
    const icon=p.isRadio?'📻':'🌍';
    return \`
      <div class="player-item">
        <div class="player-info">
          <div class="player-name">
            <span>\${icon}</span>
            <span>\${p.name}</span>
          </div>
          <div class="player-distance">\${p.dist}m</div>
        </div>
        <div class="volume-indicator">
          <div class="volume-bar" style="width:\${realVol*100}%"></div>
        </div>
      </div>
    \`
  }).join('');
}

async function getMicrophone(){
  console.log('🎤 Requesting microphone...');
  try{
    localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,sampleRate:48000}});
    console.log('✅ Mic granted');
    return true;
  }catch(err){
    console.error('❌ Mic:',err.name,err.message);
    alert('マイクアクセスエラー: '+err.message);
    return false;
  }
}

async function toggleSpatialMic(){
  spatialMicEnabled=!spatialMicEnabled;
  const btn=document.getElementById('spatialMicBtn');
  if(spatialMicEnabled){
    if(!localStream&&!await getMicrophone()){spatialMicEnabled=false;return}
    btn.classList.add('active');
    micStatusMap.set(currentUser.xid,true);
    broadcastMicStatus('spatial',true);
  }else{
    btn.classList.remove('active');
    micStatusMap.set(currentUser.xid,false);
    broadcastMicStatus('spatial',false);
  }
}

async function toggleRadioMic(){
  radioMicEnabled=!radioMicEnabled;
  const btn=document.getElementById('radioMicBtn');
  const pttBtn=document.getElementById('pttBtn');
  const pttLabel=document.getElementById('pttLabel');
  
  if(radioMicEnabled){
    if(!localStream&&!await getMicrophone()){radioMicEnabled=false;return}
    btn.classList.add('active');
    if(pttBtn)pttBtn.disabled=false;
    if(pttLabel)pttLabel.textContent='長押しで送信';
    radioMicStatusMap.set(currentUser.xid,true);
    broadcastMicStatus('radio',true);
    if(micLinkEnabled&&spatialMicEnabled)toggleSpatialMic();
  }else{
    btn.classList.remove('active');
    if(pttBtn)pttBtn.disabled=true;
    if(pttLabel)pttLabel.textContent='ラジオマイクをON';
    if(pttActive)stopPTT();
    radioMicStatusMap.set(currentUser.xid,false);
    broadcastMicStatus('radio',false);
    if(micLinkEnabled&&!spatialMicEnabled)toggleSpatialMic();
  }
}

function broadcastMicStatus(type,status){
  if(ws&&ws.readyState===WebSocket.OPEN){
    ws.send(JSON.stringify({type:'mic_status',micType:type,xid:currentUser.xid,micOn:status}));
  }
}

async function startPTT(){
  if(!radioMicEnabled){alert('ラジオマイクをONにしてください');return}
  if(!radioChannel){alert('チャンネルに参加してください');return}
  if(pttActive)return;
  pttActive=true;
  document.getElementById('pttBtn').classList.add('active');
  document.getElementById('pttLabel').textContent='送信中...';
  playPTTBeep(true);
  broadcastPTTStatus(true);
  console.log('🎙️ PTT: ON');
}

function stopPTT(){
  if(!pttActive)return;
  pttActive=false;
  document.getElementById('pttBtn').classList.remove('active');
  document.getElementById('pttLabel').textContent='長押しで送信';
  playPTTBeep(false);
  broadcastPTTStatus(false);
  console.log('🎙️ PTT: OFF');
}

function broadcastPTTStatus(status){
  if(ws&&ws.readyState===WebSocket.OPEN){
    ws.send(JSON.stringify({type:'ptt_status',xid:currentUser.xid,pttOn:status,radioChannel:radioChannel}));
  }
}

function connectWebSocket(){
  console.log('🌐 Connecting WebSocket...');
  ws=new WebSocket(WS_URL+'?xid='+encodeURIComponent(currentUser.xid));
  ws.onopen=()=>{console.log('✅ WS connected');updateWSStatus(true);startPing()};
  ws.onclose=()=>{console.log('🔴 WS closed');updateWSStatus(false);stopPing();setTimeout(connectWebSocket,5000)};
  ws.onerror=err=>console.error('❌ WS:',err);
  ws.onmessage=e=>{
    try{
      const data=JSON.parse(e.data);
      if(data.type==='pong'){
        document.getElementById('pingDisplay').textContent=(Date.now()-lastPingTime)+'ms';
      }else if(data.type==='pos'){
        playerPositions.set(data.xid,{x:data.x,y:data.y,z:data.z,radioChannel:data.radioChannel,name:data.name});
        if(data.xid===currentUser.xid){
          myPosition={x:data.x,y:data.y,z:data.z};
          if(audioContext){
            audioContext.listener.positionX.value=data.x;
            audioContext.listener.positionY.value=data.y;
            audioContext.listener.positionZ.value=data.z;
          }
        }
        updateSpatialAudio();
      }else if(data.type==='radio_update'){
        checkRadioChannel();
      }else if(data.type==='mic_status'){
        if(data.micType==='spatial')micStatusMap.set(data.xid,data.micOn);
        else if(data.micType==='radio')radioMicStatusMap.set(data.xid,data.micOn);
        updateSpatialAudio();
      }else if(data.type==='ptt_status'){
        if(data.xid!==currentUser.xid&&data.radioChannel===radioChannel)playPTTBeep(data.pttOn);
      }
    }catch(err){console.error('WS message:',err)}
  };
}

function startPing(){
  stopPing();
  pingInterval=setInterval(()=>{
    if(ws&&ws.readyState===WebSocket.OPEN){
      lastPingTime=Date.now();
      ws.send(JSON.stringify({type:'ping'}));
    }
  },2000);
}

function stopPing(){
  if(pingInterval){clearInterval(pingInterval);pingInterval=null}
  document.getElementById('pingDisplay').textContent='-';
}

function updateWSStatus(connected){
  const dot=document.getElementById('wsStatusDot');
  const text=document.getElementById('wsStatusText');
  if(connected){
    dot.classList.remove('error');
    text.textContent='接続中';
  }else{
    dot.classList.add('error');
    text.textContent='切断';
  }
}

// Auth
document.getElementById('showRegister').addEventListener('click',()=>{
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click',()=>{
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
});

document.getElementById('registerBtn').addEventListener('click',async()=>{
  const username=document.getElementById('registerUsername').value.trim();
  const password=document.getElementById('registerPassword').value;
  if(!username||!password){alert('全て入力してください');return}
  try{
    const res=await fetch(API_URL+'/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
    const data=await res.json();
    if(data.success){
      document.getElementById('authSuccess').textContent='アカウント作成成功';
      document.getElementById('authSuccess').style.display='block';
      setTimeout(()=>document.getElementById('showLogin').click(),1500);
      document.getElementById('loginUsername').value=username;
    }else{
      document.getElementById('authError').textContent=data.error;
      document.getElementById('authError').style.display='block';
    }
  }catch(err){alert('サーバー接続エラー')}
});

document.getElementById('loginBtn').addEventListener('click',async()=>{
  const username=document.getElementById('loginUsername').value.trim();
  const password=document.getElementById('loginPassword').value;
  if(!username||!password){alert('全て入力してください');return}
  try{
    const res=await fetch(API_URL+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
    const data=await res.json();
    if(data.success){
      currentUser={username:data.username,xid:data.xid};
      authToken=data.token;
      document.getElementById('authScreen').style.display='none';
      document.getElementById('mainApp').style.display='block';
      document.getElementById('currentUsername').textContent=data.username;
      initAudio();
      connectWebSocket();
      checkRadioChannel();
      setInterval(updatePlayersList,100);
      console.log('✅ Login');
    }else{
      document.getElementById('authError').textContent=data.error;
      document.getElementById('authError').style.display='block';
    }
  }catch(err){alert('サーバー接続エラー')}
});

document.getElementById('spatialMicBtn').addEventListener('click',toggleSpatialMic);
document.getElementById('radioMicBtn').addEventListener('click',toggleRadioMic);

// PTT
const pttBtn=document.getElementById('pttBtn');
let pttTouchId=null;

pttBtn.addEventListener('mousedown',e=>{e.preventDefault();startPTT()});
pttBtn.addEventListener('mouseup',e=>{e.preventDefault();stopPTT()});
pttBtn.addEventListener('mouseleave',stopPTT);

pttBtn.addEventListener('touchstart',e=>{
  e.preventDefault();
  if(e.touches.length>0){pttTouchId=e.touches[0].identifier;startPTT()}
},{passive:false});

pttBtn.addEventListener('touchend',e=>{
  e.preventDefault();
  for(let i=0;i<e.changedTouches.length;i++){
    if(e.changedTouches[i].identifier===pttTouchId){stopPTT();pttTouchId=null;break}
  }
},{passive:false});

pttBtn.addEventListener('touchcancel',e=>{e.preventDefault();stopPTT();pttTouchId=null},{passive:false});

document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&!pttActive&&radioChannel&&radioMicEnabled&&document.getElementById('mainApp').style.display!=='none'){
    e.preventDefault();startPTT();
  }
});

document.addEventListener('keyup',e=>{
  if(e.code==='Space'&&pttActive){e.preventDefault();stopPTT()}
});

// Radio
document.getElementById('joinRadioBtn').addEventListener('click',async()=>{
  const channel=document.getElementById('radioChannelInput').value.trim();
  if(!channel)return;
  try{
    const res=await fetch(API_URL+'/radio/join',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},body:JSON.stringify({channel})});
    const data=await res.json();
    if(data.success){
      radioChannel=channel;
      document.getElementById('channelJoin').classList.add('hidden');
      document.getElementById('currentChannel').classList.remove('hidden');
      document.getElementById('currentChannelName').textContent=channel;
      const pttLabel=document.getElementById('pttLabel');
      if(pttLabel&&radioMicEnabled)pttLabel.textContent='長押しで送信';
      if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type:'radio_update'}));
      console.log('✅ Joined:',channel);
    }
  }catch(err){console.error('Radio join:',err)}
});

document.getElementById('leaveRadioBtn').addEventListener('click',async()=>{
  try{
    await fetch(API_URL+'/radio/leave',{method:'POST',headers:{'Authorization':'Bearer '+authToken}});
    radioChannel=null;
    document.getElementById('channelJoin').classList.remove('hidden');
    document.getElementById('currentChannel').classList.add('hidden');
    const pttLabel=document.getElementById('pttLabel');
    if(pttLabel&&radioMicEnabled)pttLabel.textContent='チャンネルに参加';
    if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type:'radio_update'}));
  }catch(err){console.error('Radio leave:',err)}
});

async function checkRadioChannel(){
  try{
    const res=await fetch(API_URL+'/radio/current',{headers:{'Authorization':'Bearer '+authToken}});
    const data=await res.json();
    if(data.radioChannel){
      radioChannel=data.radioChannel.name;
      document.getElementById('channelJoin').classList.add('hidden');
      document.getElementById('currentChannel').classList.remove('hidden');
      document.getElementById('currentChannelName').textContent=data.radioChannel.name;
    }
  }catch(err){}
}

// Settings
document.getElementById('masterVolumeSlider').addEventListener('input',e=>{
  masterVolume=parseInt(e.target.value)/100;
  document.getElementById('masterVolumeValue').textContent=e.target.value;
  for(const[xid,gainNode]of gainNodes)gainNode.gain.value=masterVolume;
});

document.getElementById('maxDistanceSlider').addEventListener('input',e=>{
  maxDistance=parseInt(e.target.value);
  document.getElementById('maxDistanceValue').textContent=maxDistance;
  updateSpatialAudio();
});

document.getElementById('minDistanceSlider').addEventListener('input',e=>{
  minDistance=parseInt(e.target.value);
  document.getElementById('minDistanceValue').textContent=minDistance;
  updateSpatialAudio();
});

document.getElementById('micLinkToggle').addEventListener('change',e=>{
  micLinkEnabled=e.target.checked;
  console.log('マイク連動:',micLinkEnabled?'ON':'OFF');
});

document.getElementById('logoutBtn').addEventListener('click',()=>{
  if(confirm('ログアウトしますか？')){
    location.reload();
  }
});

console.log('✅ Voice Chat System Ready');
`
