const KEY='mine-sound';
export function audio(){
 let ctx=null,master=null,on=localStorage.getItem(KEY)!=='0',needsGesture=true;
 const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
 function destroy(){try{ctx?.close?.()}catch{}ctx=null;master=null;needsGesture=true}
 function build(){
  if(ctx?.state==='closed')destroy();
  if(ctx)return ctx;
  const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
  try{ctx=new A({latencyHint:'interactive'})}catch{ctx=new A()}
  master=ctx.createGain();master.gain.value=1;master.connect(ctx.destination);
  needsGesture=ctx.state!=='running';ctx.onstatechange=()=>{needsGesture=ctx.state!=='running'};
  return ctx
 }
 function prime(c){try{const b=c.createBuffer(1,1,22050),s=c.createBufferSource(),g=c.createGain();g.gain.value=.000001;s.buffer=b;s.connect(g).connect(master);s.start(c.currentTime)}catch{}}
 function unlock(){
  if(!on)return null;const c=build();if(!c)return null;
  try{if(c.state!=='running'){const p=c.resume();p?.catch?.(()=>{})}prime(c);needsGesture=false}catch{needsGesture=true}
  return c
 }
 function get(){if(!on)return null;const c=build();if(!c)return null;if(c.state==='closed'){destroy();return unlock()}if(c.state!=='running')return unlock();return c}
 function tone(freq=300,d=.06,type='sine',gain=.04,end=freq*.7,delay=0){
  const c=get();if(!c)return;
  try{const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(35,end),t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(master);o.start(t);o.stop(t+d+.02)}catch{}
 }
 function play(k,power=1){if(k==='hit'){tone(560+power*18,.055,'triangle',.025,240);tone(280,.045,'sine',.012,160,.012)}else if(k==='break'){tone(920,.09,'square',.026,320);tone(460,.12,'triangle',.02,120,.018)}else if(k==='wall'){tone(170,.035,'sine',.016,110)}else if(k==='spawn'){tone(260,.08,'sine',.032,520);tone(520,.09,'triangle',.022,880,.045)}else if(k==='power'){tone(190,.13,'sawtooth',.03,760);tone(380,.15,'triangle',.022,1180,.05)}else if(k==='level'){[392,523,659,784].forEach((f,i)=>tone(f,.12,'triangle',.026,f*1.25,i*.07))}}
 function toggle(){on=!on;localStorage.setItem(KEY,on?'1':'0');if(on){unlock();play('spawn')}return on}
 const gesture=()=>{if(on&&(needsGesture||ctx?.state!=='running'||standalone()))unlock()};
 ['touchstart','touchend','pointerdown','pointerup','click','keydown'].forEach(ev=>document.addEventListener(ev,gesture,{passive:true,capture:true}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){needsGesture=true;return}if(ctx?.state==='closed')destroy();else if(ctx?.state!=='running')needsGesture=true});
 window.addEventListener('pageshow',()=>{if(ctx?.state==='closed')destroy();else if(ctx?.state!=='running')needsGesture=true});
 window.addEventListener('focus',()=>{if(!document.hidden&&on&&ctx?.state==='running')prime(ctx)});
 return{play,toggle,enabled:()=>on,unlock,status:()=>({supported:!!(window.AudioContext||window.webkitAudioContext),state:ctx?.state||'not-created',enabled:on,needsGesture})}
}