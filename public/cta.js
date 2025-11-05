document.addEventListener('DOMContentLoaded', function () {
  // Create CTA button
  try {
    const btn = document.createElement('a');
    btn.className = 'cta-apply floating-cta';
    btn.href = '/application.html';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Apply to join the Adventurers Guild');
    btn.textContent = 'Apply to join';
    // hidden until we decide to show
    btn.style.display = 'none';
    document.body.appendChild(btn);

    async function decideShow() {
      const token = localStorage.getItem('apiToken');
      if (!token) {
        btn.style.display = 'inline-block';
        return;
      }
      // If token present, ask backend if user is a member
      try {
        const res = await fetch('/api/me/', { headers: { 'Authorization': 'Token ' + token } });
        if (!res.ok) {
          // on error, show button conservatively
          btn.style.display = 'inline-block';
          return;
        }
        const data = await res.json();
        if (!data.is_member) {
          btn.style.display = 'inline-block';
        }
      } catch (e) {
        // network errors -> show the button
        btn.style.display = 'inline-block';
      }
    }

    decideShow();

    // Optional: check membership again when token changes in another tab
    window.addEventListener('storage', (e) => {
      if (e.key === 'apiToken') decideShow();
    });
  } catch (e) {
    console.error('CTA script error', e);
  }
});
