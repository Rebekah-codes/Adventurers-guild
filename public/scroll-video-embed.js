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
  // explicitly ensure controls attribute is not present. Some browsers may
  // show controls when autoplay is blocked — we'll strip them client-side
  // and present our own play UI instead.
  video.controls = false;
  try { video.removeAttribute('controls'); } catch(e){}
  video.loop = false; // play once
    video.setAttribute('preload','auto');
    // ensure any stray 'loop' attribute is removed for good measure
    try { video.removeAttribute('loop'); } catch(e){}

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
    const removeOverlay = ()=>{
      try { video.pause(); } catch(e){}
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
      try { localStorage.setItem(STORAGE_KEY,'1'); } catch(e){}
    };

    // only the close button will remove the overlay — do not close on
    // Escape or backdrop click per requested behavior.
    close.addEventListener('click', removeOverlay);

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
        // user gesture — try to play and hide native controls if any appear
        await video.play();
        play.style.display = 'none';
        try { video.removeAttribute('controls'); video.controls = false; } catch(e){}
      } catch(e){
        // If still blocked, keep the play button visible — user must allow.
      }
    });

    // end-of-video text element (hidden until video ends)
    const endText = document.createElement('div');
    endText.className = 'scroll-video-endtext';
    endText.style.display = 'none';
    // Replace static paragraphs with a single typewriter container so the text
    // appears with a typing animation after the video ends.
    endText.innerHTML = `
      <div class="end-content">
        <div class="scroll-typewriter" id="scroll-video-typewriter">
          <span class="text" id="scroll-video-text">To the brave soul whose name now graces our ledger.\n\nBy decree of the Guildmaster and the Circle of Blades, you are hereby welcomed into the Adventurers Guild of Asharavel. From the moss-laced ruins of Eldenmere to the frostbitten peaks of Tharundel, our banners fly where corruption festers and now, yours shall fly among them.\n\nYou are no longer wanderer, nor mercenary, nor lone blade in the dark. You are kin to elves, dwarves, humans, and all who stand against the shadow. Your oath binds you to the defense of the realm, the pursuit of honor, and the cleansing of evil in all its forms, be it goblin horde, spider brood, or troll siege.\n\nWithin these halls you shall find comrades, quests, and chronicles. Your deeds will be etched into the Guild’s log, your victories sung in the taverns of Silverfen, and your failures, should they come, be met with steel and solidarity.\n\nTake up your sigil. Ready your blade. The world awaits.\n\nSigned in ink and flame,\nGuildmaster of Asharavel</span>
          <span class="pen" style="display:none" aria-hidden="true">
            <!-- fuller calligraphy pen SVG: handle + ferrule + nib -->
            <svg viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <!-- handle (wood/dark-brown) -->
              <rect x="0" y="4" rx="6" ry="6" width="88" height="16" fill="#5a2f1a" />
              <!-- slight highlight on handle -->
              <rect x="6" y="6" rx="4" ry="4" width="60" height="6" fill="#7a4324" opacity="0.12"/>
              <!-- ferrule (metal band) -->
              <rect x="88" y="6" width="8" height="12" rx="2" ry="2" fill="#2b1a11" />
              <!-- nib -->
              <path class="nib" d="M104 4 L120 12 L104 20 L96 14 L104 4 Z" fill="#2b1a11" />
              <!-- nib slit / detail -->
              <rect x="108" y="11" width="2" height="2" rx="1" fill="#d6a873" />
            </svg>
          </span>
        </div>
      </div>`;

    // ensure the video does not restart if the browser or other code tries
    // to set loop — when playback ends, pause and leave the last frame.
    video.addEventListener('ended', ()=>{
      try { video.pause(); } catch(e){}
      try { video.currentTime = Math.max(0, video.duration || 0); } catch(e){}
      // show end text (if present)
      try {
        if (endText) { endText.style.display = 'flex'; endText.classList.add('visible'); }
        // Initialize and run the per-word typewriter animation for the end text
        try { startScrollVideoTypewriter(); } catch(e) { /* ignore errors */ }
      } catch(e){}
      // keep overlay visible until user presses Close
    });

    // Build the per-character typewriter effect for the end-of-video text
    function startScrollVideoTypewriter(){
      const textSpan = document.getElementById('scroll-video-text');
      if (!textSpan) return;
      const raw = textSpan.textContent || '';
      // compute per-character delay: slightly faster overall (approx ~25ms per char)
      const perCharDelay = 25; // ms per character

      // Build fragment: for whitespace characters, keep as text nodes; for visible characters wrap in span.char
      const frag = document.createDocumentFragment();
      let charIndex = 0;
        for (let i = 0; i < raw.length; i++) {
          const ch = raw[i];
          if (/\s/.test(ch)) {
            // preserve whitespace as text node
            frag.appendChild(document.createTextNode(ch));
          } else {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch;
            // do not set transitionDelay here; we'll reveal each char sequentially in JS
            frag.appendChild(span);
            charIndex += 1;
          }
        }

      textSpan.innerHTML = '';
      textSpan.appendChild(frag);

      // trigger reveal: after a small tick add 'visible' to all .char elements
      // sequentially reveal characters so we can move the caret along with typing
      const chars = Array.from(textSpan.querySelectorAll('.char'));
      const container = document.getElementById('scroll-video-typewriter');
  const penEl = document.querySelector('#scroll-video-typewriter .pen');
      if (container) container.classList.add('typing');
            if (penEl) {
    // ensure pen is ready for absolute positioning (will not affect layout)
    penEl.style.display = '';
    penEl.style.opacity = '1';
    penEl.style.left = '-9999px';
    penEl.style.top = '-9999px';
    penEl.style.transition = 'left 0.04s linear, top 0.04s linear, transform 0.08s ease';
    penEl.style.transformOrigin = '50% 50%';
  }

      chars.forEach((chEl, idx) => {
        setTimeout(() => {
          try {
            chEl.classList.add('visible');
            // position pen absolutely over/after this character so it does not reflow text
            if (penEl) {
              try {
                const chRect = chEl.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const penRect = penEl.getBoundingClientRect();
                // try to find the nib element inside the SVG and measure it
                const nibEl = penEl.querySelector('.nib');
                if (nibEl) {
                  const nibRect = nibEl.getBoundingClientRect();
                  // how far is the nib's left from the pen's left
                  const nibOffsetFromPenLeft = nibRect.left - penRect.left;
                  // desired x (relative to container) is character's right edge
                  const desiredNibX = chRect.right - containerRect.left;
                  const desiredPenLeft = desiredNibX - nibOffsetFromPenLeft;
                  // vertical: align nib center y with baseline-ish target
                  const nibCenterY = (nibRect.top + nibRect.bottom) / 2 - containerRect.top;
                  const desiredNibY = chRect.top - containerRect.top + (chRect.height * 0.62);
                  const desiredPenTop = penRect.top - containerRect.top + (desiredNibY - nibCenterY);
                  penEl.style.left = desiredPenLeft + 'px';
                  penEl.style.top = desiredPenTop + 'px';
                } else {
                  // fallback: simple placement near char edge
                  const left = (chRect.right - containerRect.left) + 2;
                  const top = chRect.top - containerRect.top + (chRect.height * 0.62);
                  penEl.style.left = left + 'px';
                  penEl.style.top = top + 'px';
                }
                // small tilt for variation; because we'll flip horizontally, use a positive base rotation
                const tilt = (idx % 3) - 1; // -1,0,1
                const baseRot = 18;
                const rotation = baseRot - (tilt * 6);
                penEl.style.transform = 'translate(-50%,-50%) scaleX(-1) rotate(' + rotation + 'deg)';
              } catch (e) { /* ignore positioning errors on old browsers */ }
            }
          } catch(e){}
        }, idx * perCharDelay);
      });

      // hide caret after last char + small buffer
      try {
        const totalMs = (chars.length * perCharDelay) + 250;
        if (penEl) {
          setTimeout(() => {
            try { if (container) container.classList.remove('typing'); penEl.style.display = 'none'; } catch(e){}
          }, totalMs);
        }
      } catch(e){}
    }

    // (no backdrop click handler — overlay only closes via the Close button)

    wrap.appendChild(video);
    wrap.appendChild(play);
    wrap.appendChild(endText);
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

    // load a handwritten/calligraphic font for the end-of-video text
    // (Great Vibes is a graceful fountain-pen-like script). If the
    // user is offline, the browser will fall back to Uncial Antiqua or
    // a generic cursive font already included on the page.
    try {
      const gf = document.createElement('link');
      gf.rel = 'stylesheet';
      gf.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
      document.head.appendChild(gf);
    } catch(e){}

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
        try { video.removeAttribute('controls'); video.controls = false; } catch(e){}
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
