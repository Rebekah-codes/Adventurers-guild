document.addEventListener('DOMContentLoaded', function(){
  const container = document.querySelector('.scroll-container');
  const paperWrap = document.querySelector('.paper-wrap');
  const left = document.querySelector('.roller.left');
  const right = document.querySelector('.roller.right');
  const play = document.getElementById('playScroll');

  function unfurl() {
    container.classList.add('unfurled');
    paperWrap.classList.add('unfurled');
    left.classList.add('unfurled');
    right.classList.add('unfurled');
    // disable button after play
    play.disabled = true;
  }

  play.addEventListener('click', unfurl);

  // also allow pressing Enter/Space when focused
  play.addEventListener('keyup', function(e){ if (e.key === 'Enter' || e.key === ' ') unfurl(); });
});
