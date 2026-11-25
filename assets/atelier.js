(function(){
  'use strict';
  var nav=document.getElementById('navlinks'),toggle=document.querySelector('.mobile-toggle');
  function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',function(){var open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('entered');io.unobserve(e.target);}});},{threshold:0.05});document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('will-reveal');io.observe(el);});}
  document.querySelectorAll('[data-service]').forEach(function(a){a.addEventListener('click',function(){document.getElementById('service').value=a.dataset.service;});});
  document.getElementById('brief').addEventListener('submit',function(e){e.preventDefault();var f=new FormData(e.currentTarget),msg=['مرحباً رسم ورقم، أرغب بمناقشة مشروع.','اسم النشاط: '+f.get('business'),'الخدمة: '+f.get('service'),f.get('social')?'رابط النشاط: '+f.get('social'):'',f.get('details')?'التفاصيل: '+f.get('details'):''].filter(Boolean).join('\n');window.location.href='https://wa.me/9647838108587?text='+encodeURIComponent(msg);});
})();