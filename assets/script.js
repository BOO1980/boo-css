document.addEventListener('DOMContentLoaded', () => {
  setupQuickLinksHighlight();
});

function setupQuickLinksHighlight() {
  const quickLinks = Array.from(document.querySelectorAll(".quick-links a[href^='#']"));

  if (quickLinks.length === 0) return;

  const sections = quickLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  function setActive(id) {
    quickLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  let currentActive = null;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length > 0) {
        const newActive = visibleSections[0].target.id;

        if (newActive !== currentActive) {
          currentActive = newActive;
          setActive(currentActive);
        }
      }
    },
    {
      threshold: [0.3, 0.5, 0.7],
      rootMargin: '-30% 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Set first section active on load
  if (sections[0]) {
    setActive(sections[0].id);
  }

  function setTopicBarHeight() {
    const bar = document.querySelector('.topic-bar');
    if (!bar) return;
    document.documentElement.style.setProperty('--topic-bar-height', `${bar.offsetHeight}px`);
  }

  window.addEventListener('load', setTopicBarHeight);
  window.addEventListener('resize', setTopicBarHeight);
}
