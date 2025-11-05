document.addEventListener('DOMContentLoaded', function(){
  const container = document.querySelector('.scroll-container');
  const paperWrap = document.querySelector('.paper-wrap');
  const left = document.querySelector('.roller.left');
  const right = document.querySelector('.roller.right');
  const play = document.getElementById('playScroll');

  function unfurl() {
    if (!container) return;
    container.classList.add('unfurled');
    if (paperWrap) paperWrap.classList.add('unfurled');
    if (left) left.classList.add('unfurled');
    if (right) right.classList.add('unfurled');
    // disable button after play
    if (play) play.disabled = true;

    // unlock scrollable text after animation
    setTimeout(()=>{
      const text = document.querySelector('.scroll-text');
      if (text) text.style.pointerEvents = 'auto';
    }, 1100);
  }

  // attach handlers if play exists
  if (play) {
    play.addEventListener('click', unfurl);
    // also allow pressing Enter/Space when focused
    play.addEventListener('keyup', function(e){ if (e.key === 'Enter' || e.key === ' ') unfurl(); });
  }

  // expose a small API for programmatic triggering
  window.__scroll2 = {
    play: unfurl,
    isUnfurled: ()=> container ? container.classList.contains('unfurled') : false
  };
});
