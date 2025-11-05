/* scroll.js
   Simple chroma-key: remove red-ish background pixels from video frames drawn to canvas.
   Tweak threshold values if needed for your specific footage.
*/
(function(){
  const video = document.getElementById('sourceVideo');
  const canvas = document.getElementById('scrollCanvas');
  const playBtn = document.getElementById('playBtn');
  if (!video || !canvas) return;

  const ctx = canvas.getContext('2d');
  let raf = null;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * devicePixelRatio);
    canvas.height = Math.round(rect.height * devicePixelRatio);
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }

  function isRedKey(r,g,b) {
    // conservative test: red is noticeably dominant and bright
    return r > 140 && r - Math.max(g,b) > 60;
  }

  function drawFrame(){
    try{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width/devicePixelRatio, canvas.height/devicePixelRatio);
      const w = canvas.width/devicePixelRatio, h = canvas.height/devicePixelRatio;
      let img = ctx.getImageData(0,0,w,h);
      const d = img.data;
      for (let i=0;i<d.length;i+=4){
        const r=d[i], g=d[i+1], b=d[i+2];
        if (isRedKey(r,g,b)) {
          d[i+3] = 0; // make pixel transparent
        }
      }
      ctx.putImageData(img,0,0);
    }catch(e){
      // ignore occasional errors if video not ready
    }
    raf = requestAnimationFrame(drawFrame);
  }

  function start() {
    resizeCanvas();
    if (raf) cancelAnimationFrame(raf);
    drawFrame();
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  playBtn.addEventListener('click', ()=>{
    if (video.paused) {
      video.play().catch(()=>{});
      playBtn.textContent = 'Pause';
    } else {
      video.pause();
      playBtn.textContent = 'Play';
    }
  });

  window.addEventListener('resize', resizeCanvas);

  video.addEventListener('play', ()=>{
    start();
    playBtn.textContent = 'Pause';
  });
  video.addEventListener('pause', ()=>{ stop(); playBtn.textContent='Play'; });

  // Try auto-play; if blocked, user can press Play
  video.muted = true;
  video.loop = true;
  video.play().then(()=>{
    // started
  }).catch(()=>{
    // autoplay blocked — leave paused and show Play button
    playBtn.textContent = 'Play';
  });

  // initial sizing
  requestAnimationFrame(resizeCanvas);
})();
