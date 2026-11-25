(()=>{'use strict';
const root=document.documentElement,w=document.getElementById('welcome'),pause=document.getElementById('welcome-pause'),images=Array.from(w.querySelectorAll('.welcome-photo')),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let current=0,timer=null,paused=reduced.matches,closing=false,shown=false;
function stop(){clearInterval(timer);timer=null}
function next(){current=(current+1)%images.length;images.forEach((im,i)=>im.classList.toggle('current',i===current));const el=w.querySelector('.welcome-progress i');if(el)el.replaceWith(el.cloneNode())}
function play(){stop();if(shown&&!paused&&!document.hidden&&!root.classList.contains('lite'))timer=setInterval(next,5000)}
function pauseState(){w.classList.toggle('paused',paused);pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Play animation / تشغيل الحركة':'Pause animation / إيقاف الحركة');play()}
function open(){if(shown||closing)return;w.hidden=false;shown=true;document.body.classList.add('welcome-open');pauseState();w.querySelector('[data-enter="ar"]').focus({preventScroll:true})}
function enter(lang){if(closing)return;if(lang&&root.lang!==lang)document.getElementById('language').click();closing=true;stop();try{sessionStorage.setItem('reef-welcome-v7','1')}catch(e){};const done=()=>{w.hidden=true;w.classList.remove('exiting');document.body.classList.remove('welcome-open');shown=false;closing=false;window.scrollTo(0,0);document.getElementById('welcome-replay').focus({preventScroll:true});document.querySelector('.menu-mast').classList.add('mast-enter')};if(reduced.matches){done();return}w.classList.add('exiting');setTimeout(done,740)}
w.querySelectorAll('[data-enter]').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.enter)));document.getElementById('welcome-skip').addEventListener('click',()=>enter());document.getElementById('welcome-replay').addEventListener('click',open);pause.addEventListener('click',()=>{paused=!paused;pauseState()});document.addEventListener('visibilitychange',play);if(reduced.addEventListener)reduced.addEventListener('change',()=>{paused=reduced.matches;pauseState()});document.addEventListener('keydown',ev=>{if(shown&&!closing&&ev.key==='Escape')enter()});
w.addEventListener('keydown',ev=>{if(ev.key!=='Tab'||!shown)return;const controls=Array.from(w.querySelectorAll('a[href],button:not([disabled])'));const first=controls[0],last=controls[controls.length-1];if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus()}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus()}});
let seen=false;try{seen=sessionStorage.getItem('reef-welcome-v7')==='1'}catch(e){}if(!seen&&!root.classList.contains('lite')&&!location.hash)open();


const rail=document.getElementById('categories'),tools=document.querySelector('.menu-tools'),grid=document.getElementById('grid'),nav=document.querySelector('.top'),buttons=Array.from(rail.querySelectorAll('[data-category]')),groups=Array.from(grid.querySelectorAll('.menu-group'));let active=null,pending=0,lock=null,lockTimer=0,observer=null;
function visibleGroups(){return groups.filter(g=>!g.hidden)}
function revealRail(b){const r=rail.getBoundingClientRect(),br=b.getBoundingClientRect();if(br.left<r.left+3||br.right>r.right-3){const delta=(br.left+br.right-r.left-r.right)/2;rail.scrollBy({left:delta,behavior:reduced.matches?'instant':'smooth'})}}
function setActive(k,follow=true){if(active===k)return;active=k;for(const b of buttons){const yes=b.dataset.category===k&&!b.disabled;b.setAttribute('aria-pressed',String(yes));if(yes){b.setAttribute('aria-current','location');if(follow)revealRail(b)}else b.removeAttribute('aria-current')}}
function offset(){return nav.getBoundingClientRect().height+tools.getBoundingClientRect().height+12}
function unlock(){lock=null;clearTimeout(lockTimer);schedule()}
function track(){pending=0;const list=visibleGroups();if(!list.length){setActive(null);return}if(lock){if(lock.hidden){unlock();return}const top=lock.getBoundingClientRect().top;if(Math.abs(top-offset())<22){lock=null;clearTimeout(lockTimer)}else return}
const line=offset()+10;let g=list[0];for(const item of list){if(item.getBoundingClientRect().top<=line)g=item;else break}
setActive(g.dataset.group)}
function schedule(){if(!pending)pending=requestAnimationFrame(track)}
function scrollGroup(g){if(!g||g.hidden)return;clearTimeout(lockTimer);lock=g;setActive(g.dataset.group);const top=Math.max(0,window.scrollY+g.getBoundingClientRect().top-offset());window.scrollTo({top,behavior:reduced.matches?'instant':'smooth'});lockTimer=setTimeout(unlock,1400);schedule()}
rail.addEventListener('click',ev=>{const b=ev.target.closest('[data-category]');if(b&&!b.disabled)scrollGroup(groups.find(g=>g.dataset.group===b.dataset.category))});
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('touchstart',()=>{if(lock)unlock()},{passive:true});window.addEventListener('wheel',()=>{if(lock)unlock()},{passive:true});window.addEventListener('keydown',e=>{if(lock&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))unlock()});
document.addEventListener('reef:layout',()=>{schedule()});
document.addEventListener('reef:filters',()=>{lock=null;clearTimeout(lockTimer);const list=visibleGroups();if(list.length&&grid.getBoundingClientRect().top<offset())scrollGroup(list[0]);else schedule()});
if('ResizeObserver'in window){const ro=new ResizeObserver(schedule);ro.observe(tools);ro.observe(nav);ro.observe(grid)}
if(!reduced.matches&&'IntersectionObserver'in window){observer=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting&&!e.target.hidden){e.target.classList.add('reveal-card');observer.unobserve(e.target)}}},{threshold:.1});document.querySelectorAll('.dish').forEach(el=>observer.observe(el))}
document.querySelectorAll('.filter-panel select,.filter-panel button').forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'click',()=>{document.querySelector('.filters').open=false}));
document.addEventListener('pointerdown',ev=>{const f=document.querySelector('.filters');if(f.open&&!f.contains(ev.target))f.open=false});document.getElementById('language').addEventListener('click',()=>{active=null;schedule()});schedule();
})();