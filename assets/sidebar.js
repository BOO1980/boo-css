(function () {
  function resolveProjectRoot() {
    const currentScript = document.currentScript;

    if (currentScript?.src) {
      try {
        return new URL('../', currentScript.src);
      } catch {
        // Fallback to document.baseURI below.
      }
    }

    return new URL('../', document.baseURI);
  }

  const projectRoot = resolveProjectRoot();
  const href = (path) => new URL(path, projectRoot).toString();

  const sidebarHTML = `
    <aside class="sidebar" aria-label="Main navigation">
      <h2 class="sidebar-title">BOO CSS Vault</h2>

      <details class="nav-group" open>
        <summary>Home</summary>
        <nav class="nav-list" aria-label="Home">
          <a href="${href('tracker/tracking.html')}" data-page="tracking">Home</a>
        </nav>
      </details>
      <details class="nav-group" open>
        <summary>Notes</summary>
        <nav class="nav-list" aria-label="Notes">
          <a href="${href('css-notes/css-overview.html')}" data-page="overview">Main Overview</a>
          <a href="${href('css-notes/css-meta-viewport.html')}" data-page="meta-viewport">Meta Viewport</a>
          <a href="${href('css-notes/css-default-browser-styles.html')}" data-page="default-browser-styles">Default Browser Styles</a>  
        </nav>
      </details>
      <details class="nav-group">
        <summary>Lab</summary>
        <nav class="nav-list" aria-label="Labs">
        </nav>
      </details>
      <details class="nav-group">
        <summary>Workshops</summary>
        <nav class="nav-list" aria-label="Workshops">
        </nav>
      </details>
    </aside>
  `;

  function mountSidebar() {
    const mount = document.getElementById('sidebar-mount');
    if (!mount) return;
    mount.innerHTML = sidebarHTML;
  }

  function highlightCurrentPage() {
    const page = document.body.dataset.page;
    const currentPath = new URL(window.location.href).pathname;

    document.querySelectorAll('.nav-list a').forEach((a) => {
      const pageMatch = page && a.dataset.page === page;
      const pathMatch = new URL(a.href, window.location.href).pathname === currentPath;
      a.classList.toggle('active-page', Boolean(pageMatch || pathMatch));
    });
  }

  function persistNavGroups() {
    const groups = Array.from(document.querySelectorAll('.nav-group'));
    const keyBase = 'html-vault:nav:';

    // restore
    groups.forEach((details) => {
      const summaryText = (details.querySelector('summary')?.textContent || 'group').trim().toLowerCase();
      const key = keyBase + summaryText;
      const saved = localStorage.getItem(key);
      if (saved !== null) details.open = saved === 'open';
    });

    // save
    groups.forEach((details) => {
      details.addEventListener('toggle', () => {
        const summaryText = (details.querySelector('summary')?.textContent || 'group').trim().toLowerCase();
        const key = keyBase + summaryText;
        localStorage.setItem(key, details.open ? 'open' : 'closed');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    mountSidebar();
    highlightCurrentPage();
    persistNavGroups();
  });
})();
