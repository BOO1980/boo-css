// backdrop element
const backdrop = document.createElement('div');
backdrop.className = 'sidebar-backdrop';
document.body.appendChild(backdrop);

const btn = document.querySelector('.nav-toggle');

function setOpen(open) {
  document.body.classList.toggle('nav-open', open);
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

btn?.addEventListener('click', () => {
  setOpen(!document.body.classList.contains('nav-open'));
});

backdrop.addEventListener('click', () => setOpen(false));

// Escape closes
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setOpen(false);
});
