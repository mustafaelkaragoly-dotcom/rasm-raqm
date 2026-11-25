
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('on'); });
    }, {threshold:.12});
    document.querySelectorAll('.reveal:not(.on)').forEach(el=>{el.classList.add('motion-ready');observer.observe(el);});
    }

    document.getElementById('brief').addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const msg = [
        'مرحباً رسم ورقم، أرغب بمناقشة مشروع.',
        'اسم النشاط: ' + (fd.get('business')||''),
        'الخدمة: ' + (fd.get('service')||''),
        fd.get('social') ? 'الرابط: ' + fd.get('social') : '',
        fd.get('details') ? 'التفاصيل: ' + fd.get('details') : ''
      ].filter(Boolean).join('\n');
      location.href = 'https://wa.me/9647838108587?text=' + encodeURIComponent(msg);
    });
  