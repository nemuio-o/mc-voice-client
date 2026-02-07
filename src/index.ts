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
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
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
  <title>🎙️ Minecraft Voice Chat</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#eee;font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh;padding:20px}
    .container{max-width:1400px;margin:0 auto}
    #authScreen{max-width:400px;margin:100px auto;background:#0f3460;padding:40px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.3)}
    #authScreen h1{text-align:center;margin-bottom:30px;color:#e94560}
    .form-group{margin-bottom:20px}
    label{display:block;margin-bottom:8px;color:#ddd;font-size:14px}
    input[type="text"],input[type="password"],input[type="number"]{width:100%;padding:12px;border:2px solid #16213e;border-radius:8px;background:#1a1a2e;color:#eee;font-size:16px}
    input:focus{outline:none;border-color:#e94560}
    button{padding:14px;background:#e94560;color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s}
    button:hover{background:#c13650}
    .error,.success{padding:12px;border-radius:8px;margin-bottom:20px;display:none}
    .error{background:#c13650;color:white}
    .success{background:#48bb78;color:white}
    #mainApp{display:none}
    .header{background:#0f3460;padding:20px;border-radius:12px;margin-bottom:20px}
    .header h1{color:#e94560;font-size:24px;margin-bottom:10px}
    .status-bar{display:flex;gap:15px;flex-wrap:wrap;margin-top:10px}
    .status-item{padding:6px 12px;background:rgba(255,255,255,0.1);border-radius:12px;font-size:13px}
    .status-online{color:#48bb78}
    .controls{display:flex;gap:12px;margin-top:15px;align-items:center}
    .btn{padding:10px 20px;background:#16213e;border:2px solid #e94560;color:#eee;border-radius:8px;cursor:pointer;font-size:14px;transition:all 0.3s;white-space:nowrap}
    .btn:hover{background:#e94560;color:white}
    .btn-active{background:#e94560;color:white}
    .ptt-btn{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#e94560 0%,#c13650 100%);border:4px solid #0f3460;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:2em;transition:all 0.2s;box-shadow:0 4px 16px rgba(233,69,96,0.4);user-select:none;margin:20px auto}
    .ptt-btn:hover{transform:scale(1.05)}
    .ptt-btn:active{transform:scale(0.95)}
    .ptt-active{animation:pttPulse 1s infinite;background:linear-gradient(135deg,#48bb78 0%,#38a169 100%);border-color:#48bb78}
    @keyframes pttPulse{0%,100%{box-shadow:0 0 0 0 rgba(72,187,120,0.7)}50%{box-shadow:0 0 0 20px rgba(72,187,120,0)}}
    .panel{background:#0f3460;padding:20px;border-radius:12px;margin-bottom:20px}
    .panel h3{color:#e94560;margin-bottom:15px}
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .player-item{background:#16213e;padding:12px;border-radius:8px;margin-bottom:8px;border-left:4px solid #48bb78}
    .player-name{font-weight:600;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center}
    .player-distance{font-size:12px;color:#aaa}
    .volume-bar-container{width:100%;height:8px;background:#1a1a2e;border-radius:4px;overflow:hidden;margin-top:6px}
    .volume-bar{height:100%;background:linear-gradient(90deg,#48bb78 0%,#38a169 100%);transition:width 0.1s;border-radius:4px}
    .radio-input-group{display:flex;gap:8px;margin-top:15px}
    .radio-input-group input{flex:1}
    .radio-input-group button{width:auto;padding:12px 20px}
    .hidden{display:none!important}
    .settings-group{margin-top:15px;padding:15px;background:#16213e;border-radius:8px}
    .settings-group label{display:block;margin-bottom:8px;color:#ddd}
    .range-container{display:flex;align-items:center;gap:12px}
    .range-container input[type="range"]{flex:1}
    .range-value{min-width:60px;text-align:right;color:#48bb78;font-weight:600}
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
        <input type="text" id="loginUsername" />
      </div>
      <div class="form-group">
        <label>パスワード</label>
        <input type="password" id="loginPassword" />
      </div>
      <button id="loginBtn">ログイン</button>
      <div style="text-align:center;margin-top:20px;color:#aaa">
        <a id="showRegister" style="color:#e94560;cursor:pointer">新規登録</a>
      </div>
    </div>
    <div id="registerForm" class="hidden">
      <div style="background:#16213e;padding:15px;border-radius:8px;border-left:4px solid #4299e1;margin-bottom:20px">
        ⚠️ 先にMinecraftサーバーに参加してください
      </div>
      <div class="form-group">
        <label>ユーザー名（Minecraft内と同じ）</label>
        <input type="text" id="registerUsername" />
      </div>
      <div class="form-group">
        <label>パスワード</label>
        <input type="password" id="registerPassword" />
      </div>
      <button id="registerBtn">アカウント作成</button>
      <div style="text-align:center;margin-top:20px;color:#aaa">
        <a id="showLogin" style="color:#e94560;cursor:pointer">ログイン</a>
      </div>
    </div>
  </div>
  
  <div id="mainApp" class="container">
    <div class="header">
      <h1>🎙️ Minecraft Voice Chat</h1>
      <div>ユーザー: <strong id="currentUsername"></strong></div>
      <div class="status-bar">
        <span class="status-item">WebSocket: <span id="wsStatus">-</span></span>
        <span class="status-item">Ping: <span id="pingDisplay">-</span></span>
        <span class="status-item">WebRTC: <span id="rtcStatus">-</span></span>
      </div>
      <div class="controls">
        <button class="btn" id="micToggle">🎤 マイク: OFF</button>
        <button class="btn" id="logoutBtn">ログアウト</button>
      </div>
    </div>
    
    <div class="grid-2">
      <div>
        <div class="panel">
          <h3>📻 ラジオPTT</h3>
          <button class="ptt-btn" id="pttBtn">
            <span id="pttIcon">📻</span>
          </button>
          <p style="text-align:center;color:#aaa;margin-top:10px">押している間だけ送信</p>
          <div class="radio-input-group">
            <input type="text" id="radioChannelInput" placeholder="チャンネル名" />
            <button id="joinRadioBtn">参加</button>
          </div>
          <div id="currentRadio" class="hidden" style="margin-top:15px;padding:15px;background:#16213e;border-radius:8px;border-left:4px solid #e94560">
            <div style="margin-bottom:10px">チャンネル: <strong id="currentRadioName"></strong></div>
            <button class="btn" id="leaveRadioBtn">退出</button>
          </div>
        </div>
        
        <div class="panel">
          <h3>⚙️ 音声設定</h3>
          <div class="settings-group">
            <label>🔊 最大聴取距離（ブロック）</label>
            <div class="range-container">
              <input type="range" id="maxDistanceSlider" min="10" max="200" value="50" step="10" />
              <span class="range-value"><span id="maxDistanceValue">50</span> ブロック</span>
            </div>
          </div>
          <div class="settings-group">
            <label>📢 最小距離（フル音量の範囲）</label>
            <div class="range-container">
              <input type="range" id="minDistanceSlider" min="1" max="20" value="5" step="1" />
              <span class="range-value"><span id="minDistanceValue">5</span> ブロック</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="panel">
        <h3>🎤 範囲内のプレイヤー（マイクON）</h3>
        <div id="nearbyPlayers"></div>
      </div>
    </div>
  </div>
  
  <script src="/app.js"></script>
</body>
</html>`

const VOICE_JS = `
const API_URL='https://mc-voice-relay.nemu1.workers.dev';
const WS_URL='wss://mc-voice-relay.nemu1.workers.dev/ws';
let currentUser=null,authToken=null,ws=null,radioChannel=null,micEnabled=false,pttActive=false,audioContext=null,localStream=null,peerConnection=null;
let playerPositions=new Map(),myPosition={x:0,y:0,z:0},gainNodes=new Map(),analyserNodes=new Map();
let compressorNode=null,radioEffectNode=null,analyserNode=null;
let pingInterval=null,lastPingTime=0;
let maxDistance=50,minDistance=5;
let micStatusMap=new Map(); // xid -> micOn

function initAudio(){
  audioContext=new(window.AudioContext||window.webkitAudioContext)();
  compressorNode=audioContext.createDynamicsCompressor();
  compressorNode.threshold.value=-50;compressorNode.knee.value=40;compressorNode.ratio.value=12;
  const lowpass=audioContext.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=3000;
  const highpass=audioContext.createBiquadFilter();highpass.type='highpass';highpass.frequency.value=300;
  analyserNode=audioContext.createAnalyser();analyserNode.fftSize=256;
  compressorNode.connect(highpass);highpass.connect(lowpass);lowpass.connect(analyserNode);
  radioEffectNode=analyserNode;
  console.log('🎵 Audio initialized');
}

function playBeep(freq=800,dur=100){
  if(!audioContext)return;
  const osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.type='sine';osc.frequency.value=freq;
  gain.gain.setValueAtTime(0.3,audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+dur/1000);
  osc.connect(gain);gain.connect(audioContext.destination);
  osc.start(audioContext.currentTime);osc.stop(audioContext.currentTime+dur/1000);
}

function playPTTBeep(on){
  if(on){playBeep(1000,50);setTimeout(()=>playBeep(1200,50),60)}
  else{playBeep(1200,50);setTimeout(()=>playBeep(1000,50),60)}
}

async function setupWebRTC(){
  try{
    const res=await fetch(API_URL+'/voice/token',{headers:{'Authorization':'Bearer '+authToken}});
    const data=await res.json();
    if(!data.success)throw new Error('Token failed');
    peerConnection=new RTCPeerConnection({iceServers:data.iceServers});
    peerConnection.onicecandidate=e=>{if(e.candidate)console.log('🧊 ICE:',e.candidate)};
    peerConnection.onconnectionstatechange=()=>{
      console.log('📡 State:',peerConnection.connectionState);
      updateRTCStatus(peerConnection.connectionState);
    };
    peerConnection.ontrack=e=>{
      console.log('🎵 Track:',e.track.id);
      const[stream]=e.streams;
      setupSpatialAudio(e.track.id,stream);
    };
    console.log('✅ WebRTC ready');
    return true;
  }catch(err){console.error('❌ WebRTC:',err);return false}
}

function setupSpatialAudio(xid,stream){
  const source=audioContext.createMediaStreamSource(stream);
  const gainNode=audioContext.createGain();
  const pannerNode=audioContext.createPanner();
  const analyser=audioContext.createAnalyser();
  analyser.fftSize=256;
  pannerNode.panningModel='HRTF';pannerNode.distanceModel='inverse';
  pannerNode.refDistance=minDistance;pannerNode.maxDistance=maxDistance;pannerNode.rolloffFactor=1;
  source.connect(gainNode);gainNode.connect(pannerNode);pannerNode.connect(analyser);analyser.connect(audioContext.destination);
  gainNodes.set(xid,{gainNode,pannerNode});
  analyserNodes.set(xid,analyser);
  console.log(\`🔊 Spatial audio: \${xid}\`);
}

function updateSpatialAudio(){
  for(const[xid,pos]of playerPositions){
    if(xid===currentUser.xid)continue;
    const nodes=gainNodes.get(xid);
    if(!nodes)continue;
    const{gainNode,pannerNode}=nodes;
    pannerNode.positionX.value=pos.x;pannerNode.positionY.value=pos.y;pannerNode.positionZ.value=pos.z;
    const dist=Math.sqrt((myPosition.x-pos.x)**2+(myPosition.y-pos.y)**2+(myPosition.z-pos.z)**2);
    let vol=calculateVolume(xid,dist,pos);
    gainNode.gain.setValueAtTime(vol,audioContext.currentTime);
  }
  updateNearbyPlayers();
}

function calculateVolume(xid,dist,pos){
  if(radioChannel&&pos.radioChannel===radioChannel)return 1.0;
  if(dist>maxDistance)return 0;
  if(dist<minDistance)return 1.0;
  return Math.max(0.01,1/(dist/minDistance));
}

function updateNearbyPlayers(){
  const container=document.getElementById('nearbyPlayers');
  if(!container)return;
  const nearby=[];
  for(const[xid,pos]of playerPositions){
    if(xid===currentUser.xid)continue;
    const dist=Math.sqrt((myPosition.x-pos.x)**2+(myPosition.y-pos.y)**2+(myPosition.z-pos.z)**2);
    const micOn=micStatusMap.get(xid)||false;
    if(dist<=maxDistance&&micOn){
      const vol=calculateVolume(xid,dist,pos);
      nearby.push({xid,name:pos.name||xid,dist:Math.round(dist),vol});
    }
  }
  nearby.sort((a,b)=>a.dist-b.dist);
  if(!nearby.length){
    container.innerHTML='<p style="color:#aaa;text-align:center">範囲内にマイクONのプレイヤーはいません</p>';
    return;
  }
  container.innerHTML=nearby.map(p=>{
    const analyser=analyserNodes.get(p.xid);
    let realVol=0;
    if(analyser){
      const dataArray=new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const avg=dataArray.reduce((a,b)=>a+b)/dataArray.length;
      realVol=Math.min(1,(avg/255)*p.vol);
    }
    return \`
      <div class="player-item">
        <div class="player-name">
          <span>🎤 \${p.name}</span>
          <span class="player-distance">\${p.dist}m</span>
        </div>
        <div class="volume-bar-container">
          <div class="volume-bar" style="width:\${realVol*100}%"></div>
        </div>
      </div>
    \`
  }).join('');
}

async function getMicrophone(){
  try{
    localStream=await navigator.mediaDevices.getUserMedia({
      audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,sampleRate:48000}
    });
    console.log('🎤 Mic granted');
    return true;
  }catch(err){
    console.error('❌ Mic:',err);
    if(err.name==='NotAllowedError')alert('マイクの使用が拒否されました。ブラウザの設定で許可してください。\\n\\nChrome: アドレスバー左のアイコン → マイク → 許可');
    else if(err.name==='NotFoundError')alert('マイクが見つかりません。マイクが接続されているか確認してください。');
    else alert('マイクエラー: '+err.message);
    return false;
  }
}

async function toggleMic(){
  micEnabled=!micEnabled;
  const btn=document.getElementById('micToggle');
  if(micEnabled){
    if(!localStream){
      const success=await getMicrophone();
      if(!success){
        micEnabled=false;
        return;
      }
    }
    btn.textContent='🎤 マイク: ON';
    btn.classList.add('btn-active');
    micStatusMap.set(currentUser.xid,true);
    broadcastMicStatus(true);
  }else{
    btn.textContent='🎤 マイク: OFF';
    btn.classList.remove('btn-active');
    if(pttActive)stopPTT();
    micStatusMap.set(currentUser.xid,false);
    broadcastMicStatus(false);
  }
}

function broadcastMicStatus(status){
  if(ws&&ws.readyState===WebSocket.OPEN){
    ws.send(JSON.stringify({type:'mic_status',xid:currentUser.xid,micOn:status}));
  }
}

async function startPTT(){
  if(!micEnabled){alert('先にマイクをONにしてください');return}
  if(!radioChannel){alert('先にラジオチャンネルに参加してください');return}
  if(pttActive)return;
  pttActive=true;
  document.getElementById('pttBtn').classList.add('ptt-active');
  document.getElementById('pttIcon').textContent='📡';
  playPTTBeep(true);
  const source=audioContext.createMediaStreamSource(localStream);
  source.connect(compressorNode);radioEffectNode.connect(audioContext.destination);
  if(peerConnection){
    localStream.getTracks().forEach(t=>peerConnection.addTrack(t,localStream));
    try{
      const offer=await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      const res=await fetch(API_URL+'/voice/sdp',{
        method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},
        body:JSON.stringify({offer})
      });
      const data=await res.json();
      if(data.success)await peerConnection.setRemoteDescription(data.answer);
    }catch(err){console.error('❌ PTT:',err)}
  }
  console.log('🎙️ PTT: Transmitting');
}

function stopPTT(){
  if(!pttActive)return;
  pttActive=false;
  document.getElementById('pttBtn').classList.remove('ptt-active');
  document.getElementById('pttIcon').textContent='📻';
  playPTTBeep(false);
  if(peerConnection&&localStream){
    peerConnection.getSenders().forEach(s=>{if(s.track)peerConnection.removeTrack(s)});
  }
  console.log('🎙️ PTT: Stopped');
}

function connectWebSocket(){
  ws=new WebSocket(WS_URL+'?xid='+encodeURIComponent(currentUser.xid));
  ws.onopen=()=>{console.log('🌐 WS connected');updateWSStatus('connected');startPing()};
  ws.onclose=()=>{console.log('🌐 WS closed');updateWSStatus('closed');stopPing();setTimeout(connectWebSocket,5000)};
  ws.onmessage=e=>{
    try{
      const data=JSON.parse(e.data);
      if(data.type==='pong'){
        const lat=Date.now()-lastPingTime;
        document.getElementById('pingDisplay').textContent=lat+'ms';
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
      }else if(data.type==='radio_update')checkRadioChannel();
      else if(data.type==='mic_status'){
        micStatusMap.set(data.xid,data.micOn);
        updateNearbyPlayers();
      }
    }catch(err){}
  };
}

function startPing(){
  stopPing();
  pingInterval=setInterval(()=>{
    if(ws&&ws.readyState===WebSocket.OPEN){lastPingTime=Date.now();ws.send(JSON.stringify({type:'ping'}))}
  },2000);
}

function stopPing(){
  if(pingInterval){clearInterval(pingInterval);pingInterval=null}
  document.getElementById('pingDisplay').textContent='-';
}

function updateWSStatus(s){
  const el=document.getElementById('wsStatus');
  if(s==='connected'){el.textContent='🟢 接続中';el.className='status-online'}
  else{el.textContent='🔴 '+s;el.className=''}
}

function updateRTCStatus(s){
  const el=document.getElementById('rtcStatus');
  if(!el)return;
  const map={connected:'🟢 接続',connecting:'🟡 接続中',disconnected:'🔴 切断',failed:'❌ 失敗'};
  el.textContent=map[s]||s;
}

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
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})
    });
    const data=await res.json();
    if(data.success){
      document.getElementById('authSuccess').textContent=data.message||'アカウント作成成功';
      document.getElementById('authSuccess').style.display='block';
      document.getElementById('showLogin').click();
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
    const res=await fetch(API_URL+'/auth/login',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})
    });
    const data=await res.json();
    if(data.success){
      currentUser={username:data.username,xid:data.xid};
      authToken=data.token;
      document.getElementById('authScreen').style.display='none';
      document.getElementById('mainApp').style.display='block';
      document.getElementById('currentUsername').textContent=data.username;
      initAudio();
      await setupWebRTC();
      connectWebSocket();
      checkRadioChannel();
      setInterval(updateNearbyPlayers,100);
    }else{
      document.getElementById('authError').textContent=data.error;
      document.getElementById('authError').style.display='block';
    }
  }catch(err){alert('サーバー接続エラー')}
});

document.getElementById('micToggle').addEventListener('click',toggleMic);

const pttBtn=document.getElementById('pttBtn');
pttBtn.addEventListener('mousedown',startPTT);
pttBtn.addEventListener('mouseup',stopPTT);
pttBtn.addEventListener('mouseleave',stopPTT);
pttBtn.addEventListener('touchstart',e=>{e.preventDefault();startPTT()});
pttBtn.addEventListener('touchend',e=>{e.preventDefault();stopPTT()});

document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&!pttActive&&radioChannel&&micEnabled&&document.getElementById('mainApp').style.display!=='none'){
    e.preventDefault();startPTT();
  }
});

document.addEventListener('keyup',e=>{
  if(e.code==='Space'&&pttActive){e.preventDefault();stopPTT()}
});

document.getElementById('joinRadioBtn').addEventListener('click',async()=>{
  const channel=document.getElementById('radioChannelInput').value.trim();
  if(!channel)return;
  try{
    const res=await fetch(API_URL+'/radio/join',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+authToken},
      body:JSON.stringify({channel})
    });
    const data=await res.json();
    if(data.success){
      radioChannel=channel;
      updateRadioUI(channel);
      if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type:'radio_update'}));
    }
  }catch(err){console.error('Radio join:',err)}
});

document.getElementById('leaveRadioBtn').addEventListener('click',async()=>{
  try{
    await fetch(API_URL+'/radio/leave',{method:'POST',headers:{'Authorization':'Bearer '+authToken}});
    radioChannel=null;
    updateRadioUI(null);
    if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type:'radio_update'}));
  }catch(err){console.error('Radio leave:',err)}
});

async function checkRadioChannel(){
  try{
    const res=await fetch(API_URL+'/radio/current',{headers:{'Authorization':'Bearer '+authToken}});
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

console.log('🎙️ Complete Voice Chat System loaded');
`

const LIVE_HTML=`<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>📻 Live</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%);color:#eee;font-family:'Segoe UI',sans-serif;min-height:100vh;padding:20px}
.container{max-width:1200px;margin:0 auto}
.header{text-align:center;margin-bottom:40px;padding:40px 20px;background:rgba(15,12,41,0.6);border-radius:16px}
.header h1{font-size:3em;background:linear-gradient(45deg,#f093fb 0%,#f5576c 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.channels-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px}
.channel-card{background:rgba(240,147,251,0.1);border:2px solid rgba(240,147,251,0.3);border-radius:16px;padding:24px}
.channel-name{font-size:1.8em;font-weight:700;color:#f093fb}
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>📻 Live Radio Channels</h1></div>
<div id="channelsContainer" class="channels-grid"></div>
</div>
<script>
const API_URL='https://mc-voice-relay.nemu1.workers.dev';
async function load(){
  try{
    const res=await fetch(API_URL+'/radio/channels/public');
    const data=await res.json();
    const c=document.getElementById('channelsContainer');
    if(!data.channels||!data.channels.length){c.innerHTML='<p style="text-align:center;color:#aaa">アクティブなチャンネルがありません</p>';return}
    c.innerHTML=data.channels.map(ch=>'<div class="channel-card"><div class="channel-name">'+ch.name+'</div><div>👥 '+ch.members.length+'人</div></div>').join('');
  }catch(e){}
}
load();setInterval(load,30000);
</script>
</body>
</html>`
