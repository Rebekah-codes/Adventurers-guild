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

    // when the video ends, auto-close the overlay (behave like a gif that finishes)
    video.addEventListener('ended', ()=>{
      if (overlay && overlay.parentNode) {
        try { localStorage.setItem(STORAGE_KEY,'1'); } catch(e){}
        overlay.parentNode.removeChild(overlay);
      }
    });

    // close button
    const close = document.createElement('button');
    close.className = 'scroll-video-close';
    close.textContent = 'Close';
    close.addEventListener('click', ()=>{
      document.body.removeChild(overlay);
      try { localStorage.setItem(STORAGE_KEY,'1'); } catch(e){}
    });

    wrap.appendChild(video);
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

    // ensure video plays (some browsers may block, but muted autoplay usually allowed)
    const tryPlay = ()=>{
      const p = video.play();
      if (p && p.catch) p.catch(()=>{
        // show native controls as fallback
        video.controls = true;
      });
    };

  // small delay to let styles load
  setTimeout(tryPlay, 250);

  // ensure overlay variable is visible to the ended listener
  // (we captured overlay in the returned object)

    // ensure background shows when closed — background is part of page styles
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();
