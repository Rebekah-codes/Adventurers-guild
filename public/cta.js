document.addEventListener('DOMContentLoaded', function () {
  // Create CTA button
  try {
    // Do not show CTA on the application page itself
    const path = window.location.pathname || '/';
    if (path.endsWith('/application.html') || path === '/application' || path.startsWith('/application')) return;

    // Respect session dismissal
    if (sessionStorage.getItem('ctaDismissed')) return;

    // container holds the link, dismiss button, and optional tooltip
    const container = document.createElement('div');
    container.className = 'cta-container floating-cta';
    container.setAttribute('role', 'region');

    const link = document.createElement('a');
    link.className = 'cta-apply';
    link.href = '/application.html';
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', 'Apply to join the Adventurers Guild');
    link.textContent = 'Apply to join';

    const dismiss = document.createElement('button');
    dismiss.className = 'cta-dismiss';
    dismiss.setAttribute('aria-label', 'Dismiss apply button');
    dismiss.innerHTML = '&times;';

    const tooltip = document.createElement('div');
    tooltip.className = 'cta-tooltip';
    tooltip.textContent = 'New members welcome — join us!';

    container.appendChild(link);
    container.appendChild(dismiss);
    container.appendChild(tooltip);
    container.style.display = 'none';
    document.body.appendChild(container);

    // Show animation/tooltip for first-time viewers in this session
    const seenKey = 'ctaSeen';

    async function decideShow() {
      const token = localStorage.getItem('apiToken');
      // if no token, show CTA
      if (!token) {
        showContainer();
        return;
      }
      try {
        const res = await fetch('/api/me/', { headers: { 'Authorization': 'Token ' + token } });
        if (!res.ok) {
          showContainer();
          return;
        }
        const data = await res.json();
        if (!data.is_member) showContainer();
      } catch (e) {
        showContainer();
      }
    }

    function showContainer() {
      container.style.display = 'inline-block';
      // If first time in this session, show tooltip animation
      if (!sessionStorage.getItem(seenKey)) {
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 4000);
        sessionStorage.setItem(seenKey, '1');
      }
    }

    dismiss.addEventListener('click', (ev) => {
      ev.preventDefault();
      container.style.display = 'none';
      sessionStorage.setItem('ctaDismissed', '1');
    });

    // Re-evaluate when token changes elsewhere
    window.addEventListener('storage', (e) => {
      if (e.key === 'apiToken') decideShow();
    });

    decideShow();
  } catch (e) {
    console.error('CTA script error', e);
  }
});
