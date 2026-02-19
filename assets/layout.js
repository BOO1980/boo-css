function resolveProjectRoot() {
  const currentScript = document.currentScript;

  if (currentScript?.src) {
    try {
      return new URL('../', currentScript.src);
    } catch {
      // Fall back to document.baseURI.
    }
  }

  return new URL('../', document.baseURI);
}

const projectRoot = resolveProjectRoot();

async function loadSidebar() {
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;

  // If another script already mounted a sidebar, don't override it.
  if (mount.childElementCount > 0 || mount.textContent.trim()) return;

  try {
    const res = await fetch(new URL('partials/sidebar.html', projectRoot));
    if (!res.ok) return;

    // Guard again in case the sidebar was mounted while fetch was in-flight.
    if (mount.childElementCount > 0 || mount.textContent.trim()) return;

    mount.innerHTML = await res.text();

    mount.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || /^([a-z]+:|#)/i.test(href)) return;
      link.href = new URL(href.replace(/^\//, ''), projectRoot).toString();
    });
  } catch {
    // Ignore fetch failures (e.g. opening files directly without a web server).
  }
}

function highlightCurrentPage() {
  const page = document.body.dataset.page;
  const currentPath = new URL(window.location.href).pathname;

  const links = document.querySelectorAll('.sidebar a[data-page]');
  links.forEach((link) => {
    const pageMatch = page && link.dataset.page === page;
    const pathMatch = new URL(link.href, window.location.href).pathname === currentPath;
    link.classList.toggle('active-page', Boolean(pageMatch || pathMatch));
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  highlightCurrentPage();
});
