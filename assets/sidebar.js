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
          <a href="${href('css-notes/css-attributes.html')}" data-page="attributes">Attributes</a>
          <a href="${href('css-notes/css-headers.html')}" data-page="headers">Headers</a>
          <a href="${href('css-notes/css-html5-elements.html')}" data-page="html5-elements">HTML5 Elements</a>
          <a href="${href('css-notes/css-boilerplate.html')}" data-page="boilerplate">Boilerplate</a>
          <a href="${href('css-notes/css-meta-element.html')}" data-page="meta-element">Meta Element</a> 
          <a href="${href('css-notes/css-section.html')}" data-page="section">Section Element</a>
          <a href="${href('css-notes/css-images.html')}" data-page="images">Images</a>
          <a href="${href('css-notes/css-anchor.html')}" data-page="anchor">Anchor</a>
          <a href="${href('css-notes/css-lists.html')}" data-page="lists">Lists</a>
          <a href="${href('css-notes/css-emphasis-and-idiomatic-elements.html')}" data-page="emphasis-and-idiomatic-elements">Emphasis and Idiomatic Elements</a>
        </nav>
      </details>
      <details class="nav-group">
        <summary>Lab</summary>
        <nav class="nav-list" aria-label="Labs">
          <a href="${href('html-work/freecodecamp/Lab-Camperbot/index.html')}" data-page="camperbot-lab">Camperbot</a>
          <a href="${href('html-work/freecodecamp/Lab-Pet-Adoption-Page/index.html')}" data-page="pet-adoption-lab">Pet Adoption</a>
        </nav>
      </details>
      <details class="nav-group">
        <summary>Workshops</summary>
        <nav class="nav-list" aria-label="Workshops">
          <a href="${href('html-work/freecodecamp/Build-A-Cat-Photo-App/index.html')}" data-page="cat-photo-app">Cat Photo App</a>
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
