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
  <title>Voice Chat</title>
  <style>
    :root {
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
    
    .dark-mode {
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
    
    .icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
    
    .icon-small {
      width: 20px;
      height: 20px;
    }
    
    .icon-large {
      width: 48px;
      height: 48px;
    }
    
    /* Auth Screen */
    #authScreen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
      position: relative;
    }
    
    .auth-theme-toggle {
      position: absolute;
      top: calc(20px + env(safe-area-inset-top));
      right: 20px;
      width: 40px;
      height: 40px;
      background: var(--bg-elevated);
      border: 1px solid var(--separator);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .auth-theme-toggle:active {
      transform: scale(0.9);
    }
    
    .auth-container {
      width: 100%;
      max-width: 400px;
      padding: 0 20px;
    }
    
    .auth-logo {
      text-align: center;
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
    
    .form-checkbox {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background: var(--bg-secondary);
      border-radius: 12px;
      margin-bottom: 16px;
    }
    
    .form-checkbox input[type="checkbox"] {
      margin-top: 2px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    
    .form-checkbox label {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
      cursor: pointer;
      flex: 1;
    }
    
    .form-checkbox a {
      color: var(--accent);
      text-decoration: none;
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
    
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
      color: white;
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
    
    .header-buttons {
      display: flex;
      gap: 8px;
    }
    
    .icon-btn {
      width: 40px;
      height: 40px;
      background: var(--bg-elevated);
      border: 1px solid var(--separator);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .icon-btn:active {
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
    
    /* Settings Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
      align-items: flex-end;
      justify-content: center;
    }
    
    .modal-overlay.active {
      display: flex;
    }
    
    .modal-content {
      background: var(--bg-primary);
      border-radius: 16px 16px 0 0;
      width: 100%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      padding-bottom: env(safe-area-inset-bottom);
      transform: translateY(100%);
      transition: transform 0.3s;
    }
    
    .modal-overlay.active .modal-content {
      transform: translateY(0);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 0.5px solid var(--separator);
    }
    
    .modal-title {
      font-size: 20px;
      font-weight: 700;
    }
    
    .close-btn {
      width: 32px;
      height: 32px;
      background: var(--bg-secondary);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .terms-content {
      max-height: 400px;
      overflow-y: auto;
      padding: 16px;
      background: var(--bg-secondary);
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .terms-content h3 {
      color: var(--text-primary);
      font-size: 15px;
      margin-top: 16px;
      margin-bottom: 8px;
    }
    
    .terms-content h3:first-child {
      margin-top: 0;
    }
    
    .terms-content p {
      margin-bottom: 12px;
    }
    
    .terms-content ul {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    
    .terms-content li {
      margin-bottom: 6px;
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
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(255, 159, 10, 0.3);
      transition: all 0.2s;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
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
      display: flex;
      align-items: center;
      gap: 8px;
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
      grid-template-columns: repeat(2, 1fr);
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
    <button class="auth-theme-toggle" id="authThemeToggle">
      <svg class="icon-small" viewBox="0 0 24 24" id="authThemeIcon">
        <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
      </svg>
    </button>
    
    <div class="auth-container">
      <div class="auth-logo">
        <svg class="icon-large" viewBox="0 0 24 24" style="width: 80px; height: 80px; fill: var(--accent);">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </div>
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
          先にMinecraftサーバーに参加してください
        </div>
        <div class="form-group">
          <label class="form-label">ユーザー名</label>
          <input type="text" class="form-input" id="registerUsername" autocomplete="username" placeholder="Minecraft内と同じ" />
        </div>
        <div class="form-group">
          <label class="form-label">パスワード</label>
          <input type="password" class="form-input" id="registerPassword" autocomplete="new-password" placeholder="パスワード" />
        </div>
        
        <div class="form-checkbox">
          <input type="checkbox" id="agreeTerms" />
          <label for="agreeTerms">
            <a href="#" id="showTermsLink">利用規約</a>に同意します
          </label>
        </div>
        
        <button class="btn-primary" id="registerBtn" disabled>アカウント作成</button>
        <div class="auth-link" id="showLogin">ログインに戻る</div>
      </div>
    </div>
  </div>
  
  <!-- Main App -->
  <div id="mainApp">
    <div class="app-header">
      <div class="header-top">
        <h1 class="header-title">Voice Chat</h1>
        <div class="header-buttons">
          <button class="icon-btn" id="settingsBtn" title="設定">
            <svg class="icon-small" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="status-pills">
        <div class="status-pill">
          <span class="status-dot" id="wsStatusDot"></span>
          <span id="wsStatusText">接続中</span>
        </div>
        <div class="status-pill">
          <svg class="icon-small" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
          </svg>
          <span id="pingDisplay">-</span>
        </div>
        <div class="status-pill">
          <svg class="icon-small" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span id="currentUsername"></span>
        </div>
      </div>
    </div>
    
    <div class="app-content">
      <!-- Radio Tab -->
      <div id="radioTab" class="tab-content active">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">ラジオ</h2>
          </div>
          
          <div class="mic-grid">
            <button class="mic-btn spatial" id="spatialMicBtn">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>空間音声</span>
            </button>
            <button class="mic-btn radio" id="radioMicBtn">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>
              </svg>
              <span>ラジオ</span>
            </button>
          </div>
          
          <div class="ptt-container">
            <button class="ptt-btn" id="pttBtn" disabled>
              <svg class="icon-large" viewBox="0 0 24 24" style="fill: white;">
                <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>
              </svg>
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
    </div>
    
    <!-- Settings Modal -->
    <div class="modal-overlay" id="settingsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">設定</h2>
          <button class="close-btn" id="closeSettingsBtn">
            <svg class="icon-small" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="setting-item">
            <div class="setting-label">
              <div class="setting-title">
                <svg class="icon-small" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
                <span>テーマ</span>
              </div>
            </div>
            <div class="toggle-row">
              <span>ダークモード</span>
              <label class="toggle-switch">
                <input type="checkbox" id="darkModeToggle">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <div class="setting-title">
                <svg class="icon-small" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <span>全体音量</span>
              </div>
              <span class="setting-value"><span id="masterVolumeValue">100</span>%</span>
            </div>
            <input type="range" class="slider" id="masterVolumeSlider" min="0" max="100" value="100" step="5" />
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <div class="setting-title">
                <svg class="icon-small" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
                <span>伝える最大距離</span>
              </div>
              <span class="setting-value"><span id="maxDistanceValue">50</span>m</span>
            </div>
            <input type="range" class="slider" id="maxDistanceSlider" min="10" max="200" value="50" step="10" />
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <div class="setting-title">
                <svg class="icon-small" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>伝える最小距離</span>
              </div>
              <span class="setting-value"><span id="minDistanceValue">5</span>m</span>
            </div>
            <input type="range" class="slider" id="minDistanceSlider" min="1" max="20" value="5" step="1" />
          </div>
          
          <div class="card" style="margin-top: 20px;">
            <button class="btn-primary" id="logoutBtn" style="background:var(--destructive);margin:0">
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Terms Modal -->
    <div class="modal-overlay" id="termsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">利用規約</h2>
          <button class="close-btn" id="closeTermsBtn">
            <svg class="icon-small" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="terms-content">
            <h3>第1条（適用）</h3>
            <p>本利用規約（以下「本規約」）は、本サービスの提供条件および本サービスの利用に関する当サービス運営者とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当サービス運営者との間の本サービスの利用に関わる一切の関係に適用されます。</p>
            
            <h3>第2条（定義）</h3>
            <p>本規約において使用する用語の定義は、以下のとおりとします。</p>
            <ul>
              <li>「本サービス」とは、Minecraftサーバー用音声チャットサービスを意味します。</li>
              <li>「ユーザー」とは、本サービスを利用する個人を意味します。</li>
              <li>「アカウント」とは、本サービスの利用のために作成されるユーザー固有の識別情報を意味します。</li>
            </ul>
            
            <h3>第3条（利用登録）</h3>
            <p>本サービスの利用を希望する者は、本規約に同意の上、登録を行うものとします。利用登録は、登録申請者がユーザー名とパスワードを入力し、本規約への同意を確認することにより完了します。</p>
            
            <h3>第4条（アカウント管理）</h3>
            <p>ユーザーは、自己の責任において、本サービスのアカウント情報を管理するものとします。ユーザーは、いかなる場合にも、アカウントを第三者に譲渡または貸与することはできません。</p>
            
            <h3>第5条（禁止事項）</h3>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
              <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当サービス運営者が不適切と判断する行為</li>
            </ul>
            
            <h3>第6条（個人情報の取扱い）</h3>
            <p>当サービス運営者は、本サービスの利用によって取得する個人情報については、適切に取り扱うものとします。本サービスでは、以下の情報を取得します。</p>
            <ul>
              <li>ユーザー名</li>
              <li>パスワード（暗号化して保存）</li>
              <li>Minecraft内のプレイヤー位置情報</li>
              <li>音声通話のメタデータ</li>
            </ul>
            
            <h3>第7条（サービスの停止等）</h3>
            <p>当サービス運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
            <ul>
              <li>本サービスにかかるシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>その他、当サービス運営者が本サービスの提供が困難と判断した場合</li>
            </ul>
            
            <h3>第8条（免責事項）</h3>
            <p>当サービス運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</p>
            <p>本サービスは現状有姿で提供されるものであり、当サービス運営者は本サービスについて、特定の目的への適合性、商業的有用性、完全性、継続性等を含め、一切保証いたしません。</p>
            
            <h3>第9条（利用規約の変更）</h3>
            <p>当サービス運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>
            
            <h3>第10条（準拠法・裁判管轄）</h3>
            <p>本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当サービス運営者の所在地を管轄する裁判所を専属的合意管轄とします。</p>
            
            <p style="margin-top: 20px; text-align: right;">制定日: 2025年1月1日</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom Tab Bar -->
    <div class="tab-bar">
      <button class="tab-item active" data-tab="radioTab">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>
        </svg>
        <span>ラジオ</span>
      </button>
      <button class="tab-item" data-tab="playersTab">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <span>プレイヤー</span>
      </button>
    </div>
  </div>
  
  <script src="/app.js"></script>
</body>
</html>`

const VOICE_JS = `
console.log('Voice Chat System - Fixed Audio Version');
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
let isDarkMode=false;
let testAudioElements=new Map(); // For audio playback testing

// Auth Theme Toggle
const savedTheme=localStorage.getItem('theme');
if(savedTheme==='dark'){
  isDarkMode=true;
  document.body.classList.add('dark-mode');
}

function updateAuthThemeIcon(){
  const icon=document.getElementById('authThemeIcon');
  if(isDarkMode){
    icon.innerHTML='<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
  }else{
    icon.innerHTML='<path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>';
  }
}

updateAuthThemeIcon();

document.getElementById('authThemeToggle').addEventListener('click',()=>{
  isDarkMode=!isDarkMode;
  document.body.classList.toggle('dark-mode',isDarkMode);
  localStorage.setItem('theme',isDarkMode?'dark':'light');
  updateAuthThemeIcon();
});

// Terms Modal
document.getElementById('showTermsLink').addEventListener('click',e=>{
  e.preventDefault();
  document.getElementById('termsModal').classList.add('active');
});

document.getElementById('closeTermsBtn').addEventListener('click',()=>{
  document.getElementById('termsModal').classList.remove('active');
});

document.getElementById('termsModal').addEventListener('click',e=>{
  if(e.target.id==='termsModal'){
    document.getElementById('termsModal').classList.remove('active');
  }
});

// Terms Agreement
document.getElementById('agreeTerms').addEventListener('change',e=>{
  document.getElementById('registerBtn').disabled=!e.target.checked;
});

// Settings Modal
document.getElementById('settingsBtn').addEventListener('click',()=>{
  document.getElementById('settingsModal').classList.add('active');
});

document.getElementById('closeSettingsBtn').addEventListener('click',()=>{
  document.getElementById('settingsModal').classList.remove('active');
});

document.getElementById('settingsModal').addEventListener('click',e=>{
  if(e.target.id==='settingsModal'){
    document.getElementById('settingsModal').classList.remove('active');
  }
});

// Dark Mode Toggle (Main App)
if(savedTheme==='dark'){
  document.getElementById('darkModeToggle').checked=true;
}

document.getElementById('darkModeToggle').addEventListener('change',e=>{
  isDarkMode=e.target.checked;
  document.body.classList.toggle('dark-mode',isDarkMode);
  localStorage.setItem('theme',isDarkMode?'dark':'light');
});

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
    console.log('Audio initialized');
    
    // Resume audio context on user interaction
    if(audioContext.state==='suspended'){
      audioContext.resume().then(()=>{
        console.log('Audio context resumed');
      });
    }
  }catch(err){
    console.error('Audio init:',err);
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
    // Resume audio context if suspended
    if(audioContext.state==='suspended'){
      audioContext.resume();
    }
    const osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type='sine';osc.frequency.value=freq;
    gain.gain.setValueAtTime(0.3,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+dur/1000);
    osc.connect(gain);gain.connect(audioContext.destination);
    osc.start(audioContext.currentTime);osc.stop(audioContext.currentTime+dur/1000);
  }catch(err){
    console.error('Beep error:',err);
  }
}

function playPTTBeep(on){
  if(on){playBeep(1000,50);setTimeout(()=>playBeep(1200,50),60)}
  else{playBeep(1200,50);setTimeout(()=>playBeep(1000,50),60)}
}

// FIXED: Setup player audio with proper stream handling
function setupPlayerAudio(xid,stream){
  if(!audioContext)return;
  try{
    console.log('Setting up audio for player:',xid);
    
    // Resume audio context if suspended
    if(audioContext.state==='suspended'){
      audioContext.resume();
    }
    
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
    
    console.log('Audio setup complete for:',xid);
  }catch(err){
    console.error('Audio setup error:',err);
  }
}

// FIXED: Test audio playback
function testAudioPlayback(xid){
  // Create test tone to verify audio is working
  if(!audioContext)return;
  try{
    console.log('Testing audio for:',xid);
    const testOsc=audioContext.createOscillator();
    const testGain=audioContext.createGain();
    testOsc.frequency.value=440;
    testGain.gain.value=0.1;
    testOsc.connect(testGain);
    testGain.connect(audioContext.destination);
    testOsc.start();
    testOsc.stop(audioContext.currentTime+0.5);
    console.log('Test tone played for:',xid);
  }catch(err){
    console.error('Test audio error:',err);
  }
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
    const iconSvg=p.isRadio
      ?'<svg class="icon-small" viewBox="0 0 24 24" style="fill: var(--radio-accent);"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/></svg>'
      :'<svg class="icon-small" viewBox="0 0 24 24" style="fill: var(--spatial-accent);"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
    return \`
      <div class="player-item">
        <div class="player-info">
          <div class="player-name">
            \${iconSvg}
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
  console.log('Requesting microphone...');
  try{
    localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,sampleRate:48000}});
    console.log('Mic granted');
    
    // Test audio context
    if(audioContext){
      console.log('Audio context state:',audioContext.state);
      if(audioContext.state==='suspended'){
        await audioContext.resume();
        console.log('Audio context resumed');
      }
    }
    
    return true;
  }catch(err){
    console.error('Mic:',err.name,err.message);
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
    console.log('Spatial mic ON');
  }else{
    btn.classList.remove('active');
    micStatusMap.set(currentUser.xid,false);
    broadcastMicStatus('spatial',false);
    console.log('Spatial mic OFF');
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
    console.log('Radio mic ON');
  }else{
    btn.classList.remove('active');
    if(pttBtn)pttBtn.disabled=true;
    if(pttLabel)pttLabel.textContent='ラジオマイクをON';
    if(pttActive)stopPTT();
    radioMicStatusMap.set(currentUser.xid,false);
    broadcastMicStatus('radio',false);
    if(micLinkEnabled&&!spatialMicEnabled)toggleSpatialMic();
    console.log('Radio mic OFF');
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
  console.log('PTT: ON');
}

function stopPTT(){
  if(!pttActive)return;
  pttActive=false;
  document.getElementById('pttBtn').classList.remove('active');
  document.getElementById('pttLabel').textContent='長押しで送信';
  playPTTBeep(false);
  broadcastPTTStatus(false);
  console.log('PTT: OFF');
}

function broadcastPTTStatus(status){
  if(ws&&ws.readyState===WebSocket.OPEN){
    ws.send(JSON.stringify({type:'ptt_status',xid:currentUser.xid,pttOn:status,radioChannel:radioChannel}));
  }
}

function connectWebSocket(){
  console.log('Connecting WebSocket...');
  ws=new WebSocket(WS_URL+'?xid='+encodeURIComponent(currentUser.xid));
  ws.onopen=()=>{console.log('WS connected');updateWSStatus(true);startPing()};
  ws.onclose=()=>{console.log('WS closed');updateWSStatus(false);stopPing();setTimeout(connectWebSocket,5000)};
  ws.onerror=err=>console.error('WS:',err);
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
  const agreed=document.getElementById('agreeTerms').checked;
  
  if(!username||!password){alert('全て入力してください');return}
  if(!agreed){alert('利用規約に同意してください');return}
  
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
      console.log('Login successful');
      
      // Play test beep to verify audio
      setTimeout(()=>{
        playBeep(440,200);
        console.log('Audio test beep played');
      },500);
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
      console.log('Joined:',channel);
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

console.log('Voice Chat System Ready');
`
