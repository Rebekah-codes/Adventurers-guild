// scroll2-embed.js — injects the scroll2 demo as a modal overlay on first visit and autoplays
(function(){
  const STORAGE_KEY = 'asharavel_scroll_seen_v1';
  // Toggle for testing: when true, the overlay will show every page load.
  // Set to false to respect the persisted localStorage flag.
  const FORCE_ALWAYS_SHOW = true;
  if (!FORCE_ALWAYS_SHOW && localStorage.getItem(STORAGE_KEY)) return; // already seen

  async function inject() {
    try {
      // load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/scroll2.css';
      document.head.appendChild(link);

      // fetch the demo page and extract .scroll-container
      const res = await fetch('/scroll2.html');
      if (!res.ok) return;
      const text = await res.text();
      const temp = document.createElement('div');
      temp.innerHTML = text;
      const container = temp.querySelector('.scroll-container');
      if (!container) return;

      // create overlay
      const overlay = document.createElement('div');
      overlay.className = 'scroll2-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '99999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.background = 'linear-gradient(180deg, rgba(2,4,6,0.6), rgba(2,4,6,0.75))';
      overlay.style.backdropFilter = 'blur(4px)';

      // close on ESC
      function cleanup() {
        document.body.removeChild(overlay);
        localStorage.setItem(STORAGE_KEY, '1');
        document.removeEventListener('keydown', onKey);
      }
      function onKey(e){ if (e.key === 'Escape') cleanup(); }
      document.addEventListener('keydown', onKey);

      // add close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.position='absolute';
      closeBtn.style.top='18px';
      closeBtn.style.right='18px';
      closeBtn.style.zIndex='100000';
      closeBtn.style.padding='8px 10px';
      closeBtn.style.borderRadius='8px';
      closeBtn.style.border='none';
      closeBtn.style.cursor='pointer';
      closeBtn.style.background='linear-gradient(90deg,#6d28d9,#0ea5b1)';
      closeBtn.onclick = cleanup;

      // make the container interactive and centered
      container.style.pointerEvents = 'auto';
      container.style.maxWidth = 'min(960px,94vw)';

      overlay.appendChild(container);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      // Ensure the demo script is executed in this page context so handlers attach.
      // If it's already present, reuse it; otherwise load it and wait for it to run.
      function ensureDemoScript() {
        return new Promise((resolve)=>{
          const existing = document.querySelector('script[src="/scroll2.js"]');
          if (existing) {
            // already loaded — resolve on next tick
            return resolve();
          }
          const s = document.createElement('script');
          s.src = '/scroll2.js';
          s.defer = false;
          s.onload = ()=>{ resolve(); };
          s.onerror = ()=>{ console.warn('Could not load /scroll2.js'); resolve(); };
          document.body.appendChild(s);
        });
      }

      await ensureDemoScript();

      // trigger the unfurl: find the play button inside the injected container
      const play = container.querySelector('#playScroll');
      if (play) {
        // small delay for CSS to load/paint and for scroll2.js to attach handlers
        setTimeout(()=>{
          try { play.focus(); play.click(); } catch(e){ /* ignore */ }
        }, 350);
      }

      // when user clicks the paper area to dismiss as well
      container.addEventListener('click', function(e){
        // if they click outside controls, close
        if (e.target === container || container.contains(e.target)) {
          // do nothing: let them interact. If they click the close button it's handled above.
        }
      });

    } catch (e) {
      console.error('scroll2-embed error', e);
    }
  }

  // inject after short delay so page content loads
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(inject, 300)); else setTimeout(inject,300);
})();
