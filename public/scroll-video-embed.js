// scroll-video-embed.js — injects a fullscreen scroll video overlay on page load and provides a close button
(function(){
  const VIDEO_SRC = '/images/scroll.mp4';
  const STORAGE_KEY = 'asharavel_scroll_seen_vvideo_v1';
  // For testing, show every time. Set to false to respect storage.
  const FORCE_ALWAYS_SHOW = true;

  function createOverlay(){
    const overlay = document.createElement('div');
    overlay.className = 'scroll-video-overlay';

    const wrap = document.createElement('div');
    wrap.className = 'scroll-video-wrap';

    const video = document.createElement('video');
    video.src = VIDEO_SRC;
    video.autoplay = true;
    video.muted = true; // muted to allow autoplay
    video.playsInline = true;
    video.controls = false;
    video.loop = false; // play once like a gif
    video.setAttribute('preload','auto');

    // DO NOT auto-close when the video ends — keep the overlay on screen until
    // the user explicitly clicks the Close button. This helps testing because
    // it prevents the overlay from vanishing immediately at the end of playback.
    // The video will play once (video.loop = false) but we intentionally leave
    // the overlay in place; the Close button handler will remove it and set
    // the storage flag.
    // (No 'ended' listener here.)

    // close button
    const close = document.createElement('button');
    close.className = 'scroll-video-close';
    close.textContent = 'Close';
    close.addEventListener('click', ()=>{
      document.body.removeChild(overlay);
      try { localStorage.setItem(STORAGE_KEY,'1'); } catch(e){}
    });

    // custom play overlay (shown when autoplay is blocked). We avoid using
    // native controls so the animation looks like a GIF. The play button is
    // centered over the video and will attempt to play on user gesture.
    const play = document.createElement('button');
    play.className = 'scroll-video-play';
    play.setAttribute('aria-label','Play animation');
    play.innerHTML = '<svg viewBox="0 0 100 100" width="40" height="40" aria-hidden="true"><polygon points="30,20 80,50 30,80" fill="currentColor"/></svg>';
    play.style.display = 'none'; // hidden by default; shown if autoplay blocked
    play.addEventListener('click', async ()=>{
      try {
        await video.play();
        play.style.display = 'none';
      } catch(e){
        // If still blocked, keep the play button visible — user must allow.
      }
    });

    wrap.appendChild(video);
    wrap.appendChild(play);
    wrap.appendChild(close);
    overlay.appendChild(wrap);
    return {overlay, video};
  }

  function shouldShow(){
    if (FORCE_ALWAYS_SHOW) return true;
    try { return !localStorage.getItem(STORAGE_KEY); } catch(e){ return true; }
  }

  function inject(){
    if (!shouldShow()) return;
    // load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/scroll-video.css';
    document.head.appendChild(link);

    const {overlay, video} = createOverlay();
    document.body.appendChild(overlay);

    // ensure video plays (some browsers may block autoplay even when muted).
    // If autoplay is blocked, show the custom play overlay rather than
    // enabling native controls — this keeps the visual clean and consistent.
    const playOverlay = overlay.querySelector('.scroll-video-play');
    const tryPlay = async ()=>{
      try {
        const p = video.play();
        if (p && p.catch) await p;
        // if play succeeded, ensure the custom play UI is hidden
        if (playOverlay) playOverlay.style.display = 'none';
      } catch(err){
        if (playOverlay) playOverlay.style.display = 'flex';
      }
    };

  // small delay to let styles load
  setTimeout(tryPlay, 250);

  // ensure overlay variable is visible to the ended listener
  // (we captured overlay in the returned object)

    // ensure background shows when closed — background is part of page styles
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();
