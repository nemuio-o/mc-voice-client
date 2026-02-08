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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>EAT鯖 ボイスチャット</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
    html,body{height:100%;overflow-x:hidden}
    body{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#eee;font-family:'Segoe UI',system-ui,sans-serif}
    
    #authScreen{
      width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;
    }
    #authScreen .auth-container{
      width:100%;max-width:400px;background:#0f3460;padding:30px;border-radius:16px;
      box-shadow:0 8px 32px rgba(0,0,0,0.3);
    }
    #authScreen h1{text-align:center;margin-bottom:30px;color:#e94560;font-size:clamp(1.5rem,5vw,2rem)}
    
    .form-group{margin-bottom:20px}
    label{display:block;margin-bottom:8px;color:#ddd;font-size:14px;font-weight:500}
    input[type="text"],input[type="password"]{
      width:100%;padding:14px;border:2px solid #16213e;border-radius:8px;
      background:#1a1a2e;color:#eee;font-size:16px;transition:border-color 0.3s;
    }
    input:focus{outline:none;border-color:#e94560}
    
    button{
      width:100%;padding:16px;background:#e94560;color:white;border:none;border-radius:8px;
      font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s;touch-action:manipulation;
    }
    button:active{transform:scale(0.98)}
    button:hover{background:#c13650}
    
    .error,.success{padding:12px;border-radius:8px;margin-bottom:20px;display:none;font-size:14px}
    .error{background:#c13650;color:white}
    .success{background:#48bb78;color:white}
    
    #mainApp{display:none;min-height:100vh;padding:15px}
    .container{max-width:1400px;margin:0 auto}
    
    .header{background:#0f3460;padding:15px;border-radius:12px;margin-bottom:15px}
    .header h1{color:#e94560;font-size:clamp(1.2rem,4vw,1.5rem);margin-bottom:8px}
    .status-bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
    .status-item{padding:6px 10px;background:rgba(255,255,255,0.1);border-radius:8px;font-size:12px;white-space:nowrap}
    .status-online{color:#48bb78}
    .status-error{color:#ff7c7c}
    
    .controls{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
    .btn{
      padding:12px 16px;background:#16213e;border:2px solid #e94560;color:#eee;border-radius:8px;
      cursor:pointer;font-size:14px;transition:all 0.3s;white-space:nowrap;touch-action:manipulation;
      flex:1;min-width:120px;
    }
    .btn:active{transform:scale(0.95)}
    .btn:hover{background:#e94560;color:white}
    .btn-active{background:#e94560;color:white}
    .btn:disabled{opacity:0.5;cursor:not-allowed}
    
    .mic-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
    
    .ptt-container{text-align:center;margin:20px 0}
    .ptt-btn{
      width:min(140px,35vw);height:min(140px,35vw);border-radius:50%;
      background:linear-gradient(135deg,#e94560 0%,#c13650 100%);
      border:4px solid #0f3460;cursor:pointer;display:inline-flex;align-items:center;
      justify-content:center;font-size:2.5em;transition:all 0.2s;
      box-shadow:0 4px 16px rgba(233,69,96,0.4);user-select:none;touch-action:manipulation;
    }
    .ptt-btn:active{transform:scale(0.9)}
    .ptt-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
    .ptt-active{
      animation:pttPulse 1s infinite;
      background:linear-gradient(135deg,#48bb78 0%,#38a169 100%);
      border-color:#48bb78;
    }
    @keyframes pttPulse{
      0%,100%{box-shadow:0 0 0 0 rgba(72,187,120,0.7)}
      50%{box-shadow:0 0 0 20px rgba(72,187,120,0)}
    }
    .ptt-toggle{border-color:#4299e1}
    
    .panel{background:#0f3460;padding:15px;border-radius:12px;margin-bottom:15px}
    .panel h3{color:#e94560;margin-bottom:12px;font-size:1.1rem}
    
    .grid-2{display:grid;grid-template-columns:1fr;gap:15px}
    @media(min-width:768px){
      .grid-2{grid-template-columns:1fr 1fr}
      #mainApp{padding:20px}
      .header,.panel{padding:20px}
    }
    
    .player-item{
      background:#16213e;padding:10px;border-radius:8px;margin-bottom:8px;border-left:4px solid #48bb78;
    }
    .player-name{
      font-weight:600;margin-bottom:4px;display:flex;justify-content:space-between;
      align-items:center;font-size:14px;
    }
    .player-distance{font-size:11px;color:#aaa}
    .volume-bar-container{
      width:100%;height:8px;background:#1a1a2e;border-radius:4px;overflow:hidden;margin-top:6px;
    }
    .volume-bar{
      height:100%;background:linear-gradient(90deg,#48bb78 0%,#38a169 100%);
      transition:width 0.1s;border-radius:4px;
    }
    
    .radio-input-group{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    .radio-input-group input{flex:1;min-width:150px}
    .radio-input-group button{width:auto;padding:12px 20px;flex-shrink:0}
    
    .settings-group{margin-top:12px;padding:12px;background:#16213e;border-radius:8px}
    .settings-group label{display:block;margin-bottom:6px;color:#ddd;font-size:13px}
    .range-container{display:flex;align-items:center;gap:10px}
    .range-container input[type="range"]{flex:1;min-width:100px}
    .range-value{min-width:70px;text-align:right;color:#48bb78;font-weight:600;font-size:13px}
    
    .toggle-container{
      display:flex;align-items:center;justify-content:space-between;
      background:#16213e;padding:12px;border-radius:8px;margin-top:12px;
    }
    .toggle-container label{margin:0;font-size:13px}
    .toggle-switch{
      position:relative;display:inline-block;width:48px;height:24px;
    }
    .toggle-switch input{opacity:0;width:0;height:0}
    .toggle-slider{
      position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;
      background:#555;transition:0.3s;border-radius:24px;
    }
    .toggle-slider:before{
      position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;
      background:white;transition:0.3s;border-radius:50%;
    }
    input:checked+.toggle-slider{background:#e94560}
    input:checked+.toggle-slider:before{transform:translateX(24px)}
    
    .hidden{display:none!important}
    .warning-box{
      background:#ff9800;color:#000;padding:12px;border-radius:8px;
      margin-bottom:15px;font-size:13px;line-height:1.4;
    }
    .link{color:#e94560;cursor:pointer;text-decoration:none;display:inline-block;margin-top:15px;font-size:14px}
    
    @media (hover: none) {
      button:hover{background:#e94560}
      .btn:hover{background:#16213e}
      .btn-active:hover{background:#e94560}
    }
  </style>
</head>
<body>
  <div id="authScreen">
    <div class="auth-container">
      <h1>Minecraft Voice</h1>
      <div id="authError" class="error"></div>
      <div id="authSuccess" class="success"></div>
      
      <div id="loginForm">
        <div class="form-group">
          <label>ユーザー名(ゲーマータグ)</label>
          <input type="text" id="loginUsername" autocomplete="username" />
        </div>
        <div class="form-group">
          <label>パスワード</label>
          <input type="password" id="loginPassword" autocomplete="current-password" />
        </div>
        <button id="loginBtn">ログイン</button>
        <div style="text-align:center">
          <a class="link" id="showRegister">新規登録</a>
        </div>
      </div>
      
      <div id="registerForm" class="hidden">
        <div style="background:#16213e;padding:12px;border-radius:8px;border-left:4px solid #4299e1;margin-bottom:15px;font-size:13px">
          ⚠️ 先にMinecraftサーバーに参加してください
        </div>
        <div class="form-group">
          <label>ゲーマータグ</label>
          <input type="text" id="registerUsername" autocomplete="username" />
        </div>
        <div class="form-group">
          <label>パスワード</label>
          <input type="password" id="registerPassword" autocomplete="new-password" />
        </div>
        <button id="registerBtn">アカウント作成</button>
        <div style="text-align:center">
          <a class="link" id="showLogin">ログイン</a>
        </div>
      </div>
    </div>
  </div>
  
  <div id="mainApp" class="container">
    <div class="header">
      <h1>🎙️ Minecraft Voice Chat</h1>
      <div style="font-size:14px;margin-bottom:8px">👤 <strong id="currentUsername"></strong></div>
      <div class="status-bar">
        <span class="status-item">WS: <span id="wsStatus">-</span></span>
        <span class="status-item">Ping: <span id="pingDisplay">-</span></span>
      </div>
      <div class="mic-controls">
        <button class="btn" id="spatialMicToggle">空間: OFF</button>
        <button class="btn" id="radioMicToggle">ラジオ: OFF</button>
      </div>
      <div class="controls">
        <button class="btn" id="logoutBtn">ログアウト</button>
      </div>
    </div>
    
    <div id="micWarning" class="warning-box hidden">
      ⚠️ マイクアクセス拒否<br>
      ブラウザ設定でマイクを許可してください
    </div>
    
    <div class="grid-2">
      <div>
        <div class="panel">
          <h3>ラジオPTT</h3>
          <div class="ptt-container">
            <button class="ptt-btn" id="pttBtn" disabled>
              <span id="pttIcon">📻</span>
            </button>
          </div>
          <p style="text-align:center;color:#aaa;margin-top:8px;font-size:12px">
            短押し: トグル / 長押し: PTT
          </p>
          <p id="pttInfo" style="text-align:center;color:#ff7c7c;margin-top:5px;font-size:12px">
            ラジオマイクをON
          </p>
          <div class="radio-input-group">
            <input type="text" id="radioChannelInput" placeholder="チャンネル名" />
            <button id="joinRadioBtn">参加</button>
          </div>
          <div id="currentRadio" class="hidden" style="margin-top:12px;padding:12px;background:#16213e;border-radius:8px;border-left:4px solid #e94560">
            <div style="margin-bottom:8px;font-size:14px">📻 <strong id="currentRadioName"></strong></div>
            <button class="btn" id="leaveRadioBtn" style="width:100%">退出</button>
          </div>
          
          <div class="toggle-container">
            <label>マイク連動（ラジオ優先）</label>
            <label class="toggle-switch">
              <input type="checkbox" id="micLinkToggle">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="panel">
          <h3>⚙️ 音声設定</h3>
          <div class="settings-group">
            <label>🔊 全体音量</label>
            <div class="range-container">
              <input type="range" id="masterVolumeSlider" min="0" max="100" value="100" step="5" />
              <span class="range-value"><span id="masterVolumeValue">100</span>%</span>
            </div>
          </div>
          <div class="settings-group">
            <label>📢 最大聴取距離</label>
            <div class="range-container">
              <input type="range" id="maxDistanceSlider" min="10" max="200" value="50" step="10" />
              <span class="range-value"><span id="maxDistanceValue">50</span>m</span>
            </div>
          </div>
          <div class="settings-group">
            <label>🎯 最小距離（フル音量範囲）</label>
            <div class="range-container">
              <input type="range" id="minDistanceSlider" min="1" max="20" value="5" step="1" />
              <span class="range-value"><span id="minDistanceValue">5</span>m</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="panel">
        <h3>🎤 範囲内のプレイヤー</h3>
        <div id="nearbyPlayers"></div>
      </div>
    </div>
  </div>
  
  <script src="/app.js"></script>
</body>
</html>`

const VOICE_JS = `
console.log('🎙️ Loading Advanced Voice Chat System...');
const API_URL='https://mc-voice-relay.nemu1.workers.dev';
const WS_URL='wss://mc-voice-relay.nemu1.workers.dev/ws';

let currentUser=null,authToken=null,ws=null,radioChannel=null;
let spatialMicEnabled=false,radioMicEnabled=false;
let pttActive=false,pttToggleMode=false;
let audioContext=null,localStream=null;
let playerPositions=new Map(),myPosition={x:0,y:0,z:0};
let gainNodes=new Map(),analyserNodes=new Map();
let spatialGainNodes=new Map(),radioGainNodes=new Map();
let radioEffectNodes=new Map();
let compressorNode=null,analyserNode=null,noiseBuffer=null;
let pingInterval=null,lastPingTime=0;
let maxDistance=50,minDistance=5,masterVolume=1.0;
let micStatusMap=new Map();
let radioMicStatusMap=new Map();
let micLinkEnabled=false;
let pttPressTime=0;

// 音声初期化
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
    console.error('❌ Audio init error:',err);
  }
}

// ホワイトノイズバッファー生成
function createNoiseBuffer(){
  const bufferSize=audioContext.sampleRate*2;
  noiseBuffer=audioContext.createBuffer(1,bufferSize,audioContext.sampleRate);
  const output=noiseBuffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){
    output[i]=Math.random()*2-1;
  }
}

// ビープ音
function playBeep(freq=800,dur=100){
  if(!audioContext)return;
  try{
    const osc=audioContext.createOscillator();
    const gain=audioContext.createGain();
    osc.type='sine';
    osc.frequency.value=freq;
    gain.gain.setValueAtTime(0.3,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+dur/1000);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime+dur/1000);
  }catch(err){}
}

function playPTTBeep(on){
  if(on){
    playBeep(1000,50);
    setTimeout(()=>playBeep(1200,50),60);
  }else{
    playBeep(1200,50);
    setTimeout(()=>playBeep(1000,50),60);
  }
}

// プレイヤーごとの音声セットアップ
function setupPlayerAudio(xid,stream){
  if(!audioContext)return;
  try{
    const source=audioContext.createMediaStreamSource(stream);
    
    // 空間音声チェーン
    const spatialGain=audioContext.createGain();
    const spatialPanner=audioContext.createPanner();
    spatialPanner.panningModel='HRTF';
    spatialPanner.distanceModel='inverse';
    spatialPanner.refDistance=minDistance;
    spatialPanner.maxDistance=maxDistance;
    spatialPanner.rolloffFactor=1;
    
    // ラジオエフェクトチェーン
    const radioGain=audioContext.createGain();
    const radioHighpass=audioContext.createBiquadFilter();
    radioHighpass.type='highpass';
    radioHighpass.frequency.value=400;
    const radioLowpass=audioContext.createBiquadFilter();
    radioLowpass.type='lowpass';
    radioLowpass.frequency.value=2500;
    
    // ノイズ
    const noiseSource=audioContext.createBufferSource();
    noiseSource.buffer=noiseBuffer;
    noiseSource.loop=true;
    const noiseGain=audioContext.createGain();
    noiseGain.gain.value=0.02;
    
    // アナライザー
    const analyser=audioContext.createAnalyser();
    analyser.fftSize=256;
    
    // マスターゲイン
    const masterGain=audioContext.createGain();
    masterGain.gain.value=masterVolume;
    
    // 接続: source -> 空間音声パス
    source.connect(spatialGain);
    spatialGain.connect(spatialPanner);
    spatialPanner.connect(masterGain);
    
    // 接続: source -> ラジオパス
    source.connect(radioHighpass);
    radioHighpass.connect(radioLowpass);
    radioLowpass.connect(radioGain);
    radioGain.connect(masterGain);
    
    // ノイズ -> ラジオ
    noiseSource.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
    
    // 最終出力
    masterGain.connect(analyser);
    analyser.connect(audioContext.destination);
    
    spatialGainNodes.set(xid,{gain:spatialGain,panner:spatialPanner});
    radioGainNodes.set(xid,radioGain);
    gainNodes.set(xid,masterGain);
    analyserNodes.set(xid,analyser);
    radioEffectNodes.set(xid,{radioHighpass,radioLowpass,noiseGain,noiseSource});
    
    console.log(\`🔊 Audio setup: \${xid}\`);
  }catch(err){
    console.error('Audio setup error:',err);
  }
}

// 空間音声更新（ラジオ優先ロジック）
function updateSpatialAudio(){
  for(const[xid,pos]of playerPositions){
    if(xid===currentUser.xid)continue;
    
    const spatialNodes=spatialGainNodes.get(xid);
    const radioGain=radioGainNodes.get(xid);
    if(!spatialNodes||!radioGain)continue;
    
    const{gain:spatialGain,panner}=spatialNodes;
    
    // 位置更新
    panner.positionX.value=pos.x;
    panner.positionY.value=pos.y;
    panner.positionZ.value=pos.z;
    
    // 距離計算
    const dist=Math.sqrt(
      (myPosition.x-pos.x)**2+
      (myPosition.y-pos.y)**2+
      (myPosition.z-pos.z)**2
    );
    
    // ラジオマイクON & 同じチャンネルかチェック
    const isRadioActive=radioChannel&&pos.radioChannel===radioChannel&&radioMicStatusMap.get(xid);
    
    if(isRadioActive){
      // ラジオ優先: 空間音声0%, ラジオ100%
      spatialGain.gain.setValueAtTime(0,audioContext.currentTime);
      radioGain.gain.setValueAtTime(1.0,audioContext.currentTime);
    }else{
      // 空間音声のみ: 距離減衰
      const spatialVol=calculateSpatialVolume(dist);
      spatialGain.gain.setValueAtTime(spatialVol,audioContext.currentTime);
      radioGain.gain.setValueAtTime(0,audioContext.currentTime);
    }
  }
  updateNearbyPlayers();
}

// 空間音声の音量計算
function calculateSpatialVolume(dist){
  if(dist>maxDistance)return 0;
  if(dist<minDistance)return 1.0;
  return Math.max(0.01,1/(dist/minDistance));
}

// 近くのプレイヤー表示更新
function updateNearbyPlayers(){
  const container=document.getElementById('nearbyPlayers');
  if(!container)return;
  
  const nearby=[];
  for(const[xid,pos]of playerPositions){
    if(xid===currentUser.xid)continue;
    const dist=Math.sqrt(
      (myPosition.x-pos.x)**2+
      (myPosition.y-pos.y)**2+
      (myPosition.z-pos.z)**2
    );
    
    const spatialMicOn=micStatusMap.get(xid)||false;
    const radioMicOn=radioMicStatusMap.get(xid)||false;
    const isRadioActive=radioChannel&&pos.radioChannel===radioChannel&&radioMicOn;
    
    if(dist<=maxDistance&&(spatialMicOn||radioMicOn)){
      nearby.push({
        xid,
        name:pos.name||xid,
        dist:Math.round(dist),
        isRadio:isRadioActive,
        spatialMicOn,
        radioMicOn
      });
    }
  }
  
  nearby.sort((a,b)=>a.dist-b.dist);
  
  if(!nearby.length){
    container.innerHTML='<p style="color:#aaa;text-align:center;padding:20px;font-size:13px">範囲内にプレイヤーはいません</p>';
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
    
    let icon='🎤';
    let borderColor='#48bb78';
    if(p.isRadio){
      icon='📻';
      borderColor='#e94560';
    }
    
    return \`
      <div class="player-item" style="border-left-color:\${borderColor}">
        <div class="player-name">
          <span>\${icon} \${p.name}</span>
          <span class="player-distance">\${p.dist}m</span>
        </div>
        <div class="volume-bar-container">
          <div class="volume-bar" style="width:\${realVol*100}%"></div>
        </div>
      </div>
    \`
  }).join('');
}

// マイク取得
async function getMicrophone(){
  console.log('🎤 Requesting microphone...');
  try{
    localStream=await navigator.mediaDevices.getUserMedia({
      audio:{
        echoCancellation:true,
        noiseSuppression:true,
        autoGainControl:true,
        sampleRate:48000
      }
    });
    console.log('✅ Mic granted');
    document.getElementById('micWarning').classList.add('hidden');
    return true;
  }catch(err){
    console.error('❌ Mic error:',err.name,err.message);
    document.getElementById('micWarning').classList.remove('hidden');
    
    let msg='マイクにアクセスできません\\n\\n';
    if(err.name==='NotAllowedError'){
      msg+='ブラウザ設定で許可してください';
    }else if(err.name==='NotFoundError'){
      msg+='マイクが見つかりません';
    }else if(err.name==='NotReadableError'){
      msg+='マイクが他のアプリで使用中です';
    }else{
      msg+='エラー: '+err.message;
    }
    alert(msg);
    return false;
  }
}

// 空間マイクトグル
async function toggleSpatialMic(){
  spatialMicEnabled=!spatialMicEnabled;
  const btn=document.getElementById('spatialMicToggle');
  
  if(spatialMicEnabled){
    if(!localStream){
      const success=await getMicrophone();
      if(!success){
        spatialMicEnabled=false;
        return;
      }
    }
    btn.textContent='🌍 空間: ON';
    btn.classList.add('btn-active');
    micStatusMap.set(currentUser.xid,true);
    broadcastMicStatus('spatial',true);
  }else{
    btn.textContent='🌍 空間: OFF';
    btn.classList.remove('btn-active');
    micStatusMap.set(currentUser.xid,false);
    broadcastMicStatus('spatial',false);
  }
}

// ラジオマイクトグル
async function toggleRadioMic(){
  radioMicEnabled=!radioMicEnabled;
  const btn=document.getElementById('radioMicToggle');
  const pttBtn=document.getElementById('pttBtn');
  const pttInfo=document.getElementById('pttInfo');
  
  if(radioMicEnabled){
    if(!localStream){
      const success=await getMicrophone();
      if(!success){
        radioMicEnabled=false;
        return;
      }
    }
    btn.textContent='📻 ラジオ: ON';
    btn.classList.add('btn-active');
    if(pttBtn)pttBtn.disabled=false;
    if(pttInfo)pttInfo.style.display='none';
    radioMicStatusMap.set(currentUser.xid,true);
    broadcastMicStatus('radio',true);
    
    // マイク連動: ラジオON → 空間OFF
    if(micLinkEnabled&&spatialMicEnabled){
      toggleSpatialMic();
    }
  }else{
    btn.textContent='📻 ラジオ: OFF';
    btn.classList.remove('btn-active');
    if(pttBtn)pttBtn.disabled=true;
    if(pttInfo){
      pttInfo.style.display='block';
      pttInfo.textContent='ラジオマイクをON';
    }
    if(pttActive||pttToggleMode)stopPTT();
    radioMicStatusMap.set(currentUser.xid,false);
    broadcastMicStatus('radio',false);
    
    // マイク連動: ラジオOFF → 空間ON
    if(micLinkEnabled&&!spatialMicEnabled){
      toggleSpatialMic();
    }
  }
}

function broadcastMicStatus(type,status){
  if(ws&&ws.readyState===WebSocket.OPEN){
    ws.send(JSON.stringify({
      type:'mic_status',
      micType:type,
      xid:currentUser.xid,
      micOn:status
    }));
  }
}

// PTT開始
async function startPTT(){
  if(!radioMicEnabled){
    alert('先にラジオマイクをONにしてください');
    return;
  }
  if(!radioChannel){
    alert('先にラジオチャンネルに参加してください');
    return;
  }
  if(pttActive)return;
  
  pttActive=true;
  document.getElementById('pttBtn').classList.add('ptt-active');
  document.getElementById('pttIcon').textContent='📡';
  const pttInfo=document.getElementById('pttInfo');
  if(pttInfo){
    pttInfo.style.display='block';
    pttInfo.textContent='送信中...';
    pttInfo.style.color='#48bb78';
  }
  
  playPTTBeep(true);
  broadcastPTTStatus(true);
  
  console.log('🎙️ PTT: ON');
}

// PTT停止
function stopPTT(){
  if(!pttActive&&!pttToggleMode)return;
  
  pttActive=false;
  pttToggleMode=false;
  document.getElementById('pttBtn').classList.remove('ptt-active');
  document.getElementById('pttBtn').classList.remove('ptt-toggle');
  document.getElementById('pttIcon').textContent='📻';
  const pttInfo=document.getElementById('pttInfo');
  if(pttInfo)pttInfo.style.display='none';
  
  playPTTBeep(false);
  broadcastPTTStatus(false);
  
  console.log('🎙️ PTT: OFF');
}

function broadcastPTTStatus(status){
  if(ws&&ws.readyState===WebSocket.OPEN){
    ws.send(JSON.stringify({
      type:'ptt_status',
      xid:currentUser.xid,
      pttOn:status,
      radioChannel:radioChannel
    }));
  }
}

// WebSocket
function connectWebSocket(){
  console.log('🌐 Connecting WebSocket...');
  ws=new WebSocket(WS_URL+'?xid='+encodeURIComponent(currentUser.xid));
  
  ws.onopen=()=>{
    console.log('✅ WS connected');
    updateWSStatus('connected');
    startPing();
  };
  
  ws.onclose=()=>{
    console.log('🔴 WS closed');
    updateWSStatus('closed');
    stopPing();
    setTimeout(connectWebSocket,5000);
  };
  
  ws.onerror=err=>console.error('❌ WS error:',err);
  
  ws.onmessage=e=>{
    try{
      const data=JSON.parse(e.data);
      
      if(data.type==='pong'){
        const lat=Date.now()-lastPingTime;
        document.getElementById('pingDisplay').textContent=lat+'ms';
      }
      else if(data.type==='pos'){
        playerPositions.set(data.xid,{
          x:data.x,
          y:data.y,
          z:data.z,
          radioChannel:data.radioChannel,
          name:data.name
        });
        if(data.xid===currentUser.xid){
          myPosition={x:data.x,y:data.y,z:data.z};
          if(audioContext){
            audioContext.listener.positionX.value=data.x;
            audioContext.listener.positionY.value=data.y;
            audioContext.listener.positionZ.value=data.z;
          }
        }
        updateSpatialAudio();
      }
      else if(data.type==='radio_update'){
        checkRadioChannel();
      }
      else if(data.type==='mic_status'){
        if(data.micType==='spatial'){
          micStatusMap.set(data.xid,data.micOn);
        }else if(data.micType==='radio'){
          radioMicStatusMap.set(data.xid,data.micOn);
        }
        updateSpatialAudio();
      }
      else if(data.type==='ptt_status'){
        if(data.xid!==currentUser.xid&&data.radioChannel===radioChannel){
          playPTTBeep(data.pttOn);
        }
      }
    }catch(err){
      console.error('WS message error:',err);
    }
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
  if(pingInterval){
    clearInterval(pingInterval);
    pingInterval=null;
  }
  document.getElementById('pingDisplay').textContent='-';
}

function updateWSStatus(s){
  const el=document.getElementById('wsStatus');
  if(s==='connected'){
    el.textContent='🟢';
    el.parentElement.className='status-item status-online';
  }else{
    el.textContent='🔴';
    el.parentElement.className='status-item status-error';
  }
}

// Auth UI
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
    const res=await fetch(API_URL+'/auth/register',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username,password})
    });
    const data=await res.json();
    if(data.success){
      document.getElementById('authSuccess').textContent=data.message||'アカウント作成成功';
      document.getElementById('authSuccess').style.display='block';
      setTimeout(()=>document.getElementById('showLogin').click(),1500);
      document.getElementById('loginUsername').value=username;
    }else{
      document.getElementById('authError').textContent=data.error;
      document.getElementById('authError').style.display='block';
    }
  }catch(err){
    console.error('Register error:',err);
    alert('サーバー接続エラー');
  }
});

document.getElementById('loginBtn').addEventListener('click',async()=>{
  const username=document.getElementById('loginUsername').value.trim();
  const password=document.getElementById('loginPassword').value;
  if(!username||!password){alert('全て入力してください');return}
  
  try{
    const res=await fetch(API_URL+'/auth/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username,password})
    });
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
      setInterval(updateNearbyPlayers,100);
      console.log('✅ Login successful');
    }else{
      document.getElementById('authError').textContent=data.error;
      document.getElementById('authError').style.display='block';
    }
  }catch(err){
    console.error('Login error:',err);
    alert('サーバー接続エラー');
  }
});

document.getElementById('spatialMicToggle').addEventListener('click',toggleSpatialMic);
document.getElementById('radioMicToggle').addEventListener('click',toggleRadioMic);

// PTTボタン - 短押し/長押し判定
const pttBtn=document.getElementById('pttBtn');
let pttTouchId=null;

function handlePTTPress(){
  pttPressTime=Date.now();
}

function handlePTTRelease(){
  const pressDuration=Date.now()-pttPressTime;
  
  if(pressDuration<200){
    // 短押し: トグル
    if(pttToggleMode){
      stopPTT();
    }else{
      pttToggleMode=true;
      startPTT();
      document.getElementById('pttBtn').classList.add('ptt-toggle');
    }
  }else{
    // 長押し: PTT解除
    if(!pttToggleMode){
      stopPTT();
    }
  }
}

pttBtn.addEventListener('mousedown',e=>{
  e.preventDefault();
  if(!pttToggleMode){
    handlePTTPress();
    startPTT();
  }
});

pttBtn.addEventListener('mouseup',e=>{
  e.preventDefault();
  if(!pttToggleMode){
    handlePTTRelease();
  }else{
    // トグルモード中のクリックで解除
    stopPTT();
  }
});

pttBtn.addEventListener('mouseleave',e=>{
  if(pttActive&&!pttToggleMode){
    handlePTTRelease();
  }
});

pttBtn.addEventListener('touchstart',e=>{
  e.preventDefault();
  if(e.touches.length>0&&!pttToggleMode){
    pttTouchId=e.touches[0].identifier;
    handlePTTPress();
    startPTT();
  }
});

pttBtn.addEventListener('touchend',e=>{
  e.preventDefault();
  for(let i=0;i<e.changedTouches.length;i++){
    if(e.changedTouches[i].identifier===pttTouchId){
      if(!pttToggleMode){
        handlePTTRelease();
      }else{
        stopPTT();
      }
      pttTouchId=null;
      break;
    }
  }
});

pttBtn.addEventListener('touchcancel',e=>{
  e.preventDefault();
  if(!pttToggleMode){
    handlePTTRelease();
  }
  pttTouchId=null;
});

// スペースキーでPTT
document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&!pttActive&&!pttToggleMode&&radioChannel&&radioMicEnabled&&document.getElementById('mainApp').style.display!=='none'){
    e.preventDefault();
    handlePTTPress();
    startPTT();
  }
});

document.addEventListener('keyup',e=>{
  if(e.code==='Space'&&pttActive&&!pttToggleMode){
    e.preventDefault();
    handlePTTRelease();
  }
});

// ラジオ参加
document.getElementById('joinRadioBtn').addEventListener('click',async()=>{
  const channel=document.getElementById('radioChannelInput').value.trim();
  if(!channel)return;
  
  try{
    const res=await fetch(API_URL+'/radio/join',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+authToken
      },
      body:JSON.stringify({channel})
    });
    const data=await res.json();
    if(data.success){
      radioChannel=channel;
      updateRadioUI(channel);
      const pttInfo=document.getElementById('pttInfo');
      if(pttInfo&&radioMicEnabled)pttInfo.style.display='none';
      if(ws&&ws.readyState===WebSocket.OPEN){
        ws.send(JSON.stringify({type:'radio_update'}));
      }
      console.log('✅ Joined radio:',channel);
    }
  }catch(err){
    console.error('Radio join:',err);
  }
});

document.getElementById('leaveRadioBtn').addEventListener('click',async()=>{
  try{
    await fetch(API_URL+'/radio/leave',{
      method:'POST',
      headers:{'Authorization':'Bearer '+authToken}
    });
    radioChannel=null;
    updateRadioUI(null);
    const pttInfo=document.getElementById('pttInfo');
    if(pttInfo&&radioMicEnabled){
      pttInfo.style.display='block';
      pttInfo.textContent='ラジオチャンネルに参加';
      pttInfo.style.color='#ff7c7c';
    }
    if(ws&&ws.readyState===WebSocket.OPEN){
      ws.send(JSON.stringify({type:'radio_update'}));
    }
  }catch(err){
    console.error('Radio leave:',err);
  }
});

async function checkRadioChannel(){
  try{
    const res=await fetch(API_URL+'/radio/current',{
      headers:{'Authorization':'Bearer '+authToken}
    });
    const data=await res.json();
    if(data.radioChannel){
      radioChannel=data.radioChannel.name;
      updateRadioUI(data.radioChannel.name);
    }
  }catch(err){}
}

function updateRadioUI(channel){
  if(channel){
    document.getElementById('currentRadio').classList.remove('hidden');
    document.getElementById('currentRadioName').textContent=channel;
  }else{
    document.getElementById('currentRadio').classList.add('hidden');
  }
}

// 設定
document.getElementById('masterVolumeSlider').addEventListener('input',e=>{
  masterVolume=parseInt(e.target.value)/100;
  document.getElementById('masterVolumeValue').textContent=e.target.value;
  for(const[xid,gainNode]of gainNodes){
    gainNode.gain.value=masterVolume;
  }
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

console.log('✅ Advanced Voice Chat System loaded');
`
