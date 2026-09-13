import{audio}from'./audio.js';import{createGame}from'./game.js';import{liveBridge}from'./live.js';
const sfx=audio(),game=createGame(document.querySelector('#game'),sfx),live=liveBridge(game),$=s=>document.querySelector(s);
const soundBtn=$('#soundSettings'),testBtn=$('#testSound'),panelBtn=$('#panelButton'),closeBtn=$('#closePanel'),restartBtn=$('#restartGame'),minutesInput=$('#matchMinutes'),timerEl=$('#matchTimer'),podium=$('#finalPodium'),podiumList=$('#finalPodiumList'),newMatch=$('#newMatch');
let duration=300,remaining=300,timer=0,ended=false,settingsPause=false;
function fmtTime(sec){sec=Math.max(0,Math.ceil(sec));return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function syncTimer(){if(timerEl)timerEl.textContent=fmtTime(remaining)}
function chosenDuration(){const n=Math.max(1,Math.min(180,Math.floor(Number(minutesInput?.value)||5)));if(minutesInput)minutesInput.value=n;try{localStorage.setItem('mine-match-minutes',String(n))}catch{}return n*60}
function avatarFor(name){return game.player?.(name)?.avatar||''}
function showPodium(){ended=true;game.setPaused?.(true);const rows=game.top?.(3)||[];podiumList.replaceChildren();rows.forEach(([name,pts],i)=>{const item=document.createElement('div'),avatar=avatarFor(name);item.className='final-place place-'+(i+1);const photo=document.createElement('div');photo.className='final-avatar';if(avatar){const im=document.createElement('img');im.src=avatar;im.alt='';photo.appendChild(im)}else photo.textContent=(name[0]||'?').toUpperCase();const info=document.createElement('div');info.className='final-info';info.innerHTML=`<b>${i+1}º</b><strong>@${name}</strong><span>${game.formatScore?.(pts)||Math.round(pts)} pontos</span>`;item.append(photo,info);podiumList.appendChild(item)});if(!rows.length){const e=document.createElement('p');e.className='final-empty';e.textContent='Nenhum jogador pontuou.';podiumList.appendChild(e)}podium.hidden=false;sfx.play('level')}
function tick(){if(ended||settingsPause||game.isPaused?.())return;remaining-=.25;if(remaining<=0){remaining=0;syncTimer();showPodium();return}syncTimer()}
function startClock(){clearInterval(timer);timer=setInterval(tick,250)}
function resetMatch({close=true}={}){duration=chosenDuration();remaining=duration;ended=false;settingsPause=false;podium.hidden=true;game.command('reset');live.resetPlayers?.();game.setPaused?.(false);syncTimer();if(close)$('#panelModal')?.classList.remove('show')}
function syncSound(){const on=sfx.enabled();soundBtn.textContent=on?'🔊 Som: ligado':'🔇 Som: desligado';testBtn.disabled=!on}
try{const saved=Number(localStorage.getItem('mine-match-minutes'));if(saved>=1&&saved<=180)minutesInput.value=Math.floor(saved)}catch{}
duration=chosenDuration();remaining=duration;syncTimer();startClock();
soundBtn.onclick=()=>{sfx.toggle();syncSound()};testBtn.onclick=()=>sfx.play('level');
if(panelBtn)panelBtn.addEventListener('click',()=>{settingsPause=true;game.setPaused?.(true)});
if(closeBtn)closeBtn.addEventListener('click',()=>{settingsPause=false;if(!ended)game.setPaused?.(false)});
if(restartBtn)restartBtn.onclick=()=>resetMatch();
if(newMatch)newMatch.onclick=()=>resetMatch();
if(minutesInput)minutesInput.addEventListener('change',()=>{chosenDuration()});
syncSound();window.MineGame=game;
const testUsers=[{uniqueId:'ana',nickname:'Ana'},{uniqueId:'ghost',nickname:'Ghost'},{uniqueId:'live',nickname:'Live'},{uniqueId:'bia',nickname:'Bia'},{uniqueId:'leo',nickname:'Leo'},{uniqueId:'maya',nickname:'Maya'},{uniqueId:'dudu',nickname:'Dudu'},{uniqueId:'nina',nickname:'Nina'}];let botTimer=0,botRunning=false,botIndex=0;
function botSpawn(){const u=testUsers[botIndex++%testUsers.length],power=1+Math.floor(Math.random()*6);game.spawn({...u,power})}
function startBots(){if(botRunning)return;botRunning=true;botSpawn();botTimer=setInterval(()=>{if(document.hidden||ended)return;const state=game.state();if(state.balls<14)botSpawn()},1400)}
function stopBots(){botRunning=false;clearInterval(botTimer);botTimer=0}
function boot(){requestAnimationFrame(()=>requestAnimationFrame(()=>{game.resize?.();if(new URLSearchParams(location.search).has('bots'))startBots()}))}
if(document.readyState==='complete')boot();else addEventListener('load',boot,{once:true});
window.MineTestBots={start:startBots,stop:stopBots,spawn:botSpawn,state:()=>({running:botRunning,...game.state()})};