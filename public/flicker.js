// Simple particle-based subtle flicker background
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const container = document.querySelector('.background-container');
  if (!container || prefersReduced) return;

  const palette = ['#6d28d9','#7c3aed','##5eead4','#0ea5b1','#0f766e'];
  // Fix accidental double-# in one color
  palette[2] = '#5eead4';

  const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight)/50000));

  function rand(min,max){ return Math.random()*(max-min)+min }

  for (let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'flicker-particle';
    const size = Math.round(rand(3,18));
    el.style.width = size+'px'; el.style.height = size+'px';
    el.style.left = (Math.random()*100)+'vw';
    el.style.top = (Math.random()*100)+'vh';
    const color = palette[Math.floor(Math.random()*palette.length)];
    el.style.background = color;
    const dur = rand(0.8,3.5).toFixed(2)+'s';
    el.style.animationDuration = dur;
    el.style.animationDelay = rand(0,3)+'s';
    el.style.opacity = rand(0.12,0.9);
    container.appendChild(el);
  }

  // Reflow on resize: throttle
  let t;
  window.addEventListener('resize', ()=>{
    clearTimeout(t); t = setTimeout(()=>{
      while(container.firstChild) container.removeChild(container.firstChild);
      for (let i=0;i<count;i++){
        const el = document.createElement('div'); el.className='flicker-particle';
        const size = Math.round(rand(3,18)); el.style.width=size+'px'; el.style.height=size+'px';
        el.style.left = (Math.random()*100)+'vw'; el.style.top = (Math.random()*100)+'vh';
        const color = palette[Math.floor(Math.random()*palette.length)]; el.style.background=color;
        el.style.animationDuration = rand(0.8,3.5).toFixed(2)+'s'; el.style.animationDelay = rand(0,3)+'s';
        el.style.opacity = rand(0.12,0.9);
        container.appendChild(el);
      }
    },250);
  });
})();
