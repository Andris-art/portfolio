// Shared favicon for the homepage and all /projects pages.
// Resolve assets from this script URL, so GitHub Pages project subpaths also work.
(() => {
  const current = document.currentScript;
  if (!current || !current.src) return;
  const siteRoot = new URL('.', current.src);
  const icons = [
    { rel: 'icon', type: 'image/x-icon', name: 'favicon.ico?v=13' },
    { rel: 'apple-touch-icon', type: 'image/png', name: 'apple-touch-icon.png?v=13' }
  ];
  for (const entry of icons) {
    if (document.head.querySelector(`link[rel="${entry.rel}"]`)) continue;
    const link = document.createElement('link');
    link.rel = entry.rel;
    link.type = entry.type;
    link.href = new URL(entry.name, siteRoot).href;
    document.head.appendChild(link);
  }
})();

if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.04});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}

// Portfolio engagement: fire milestones once per page view, only after real scrolling.
// Pageviews are recorded automatically by the Umami Cloud tracker.
(() => {
  const thresholds = [50, 75, 90];
  const fired = new Set();
  let scheduled = false;
  const handleScroll = () => {
    if (scheduled || fired.size === thresholds.length) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      if (!window.umami || typeof window.umami.track !== 'function') return;
      const doc = document.documentElement;
      const total = Math.max(doc.scrollHeight, document.body.scrollHeight);
      if (total <= window.innerHeight + 1) return;
      const depth = Math.min(100, Math.round((window.scrollY + window.innerHeight) / total * 100));
      for (const percent of thresholds) {
        if (depth >= percent && !fired.has(percent)) {
          fired.add(percent);
          window.umami.track('scroll_depth', { percent });
        }
      }
      if (fired.size === thresholds.length) window.removeEventListener('scroll', handleScroll);
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
})();


// V20 — reading progress in the persistent header, on all pages.
(() => {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;
  let pending = false;
  const update = () => {
    pending = false;
    const root = document.documentElement;
    const range = Math.max(0, root.scrollHeight - window.innerHeight);
    const progress = range ? Math.min(1, Math.max(0, window.scrollY / range)) : 1;
    bar.style.transform = `scaleX(${progress})`;
  };
  const requestUpdate = () => {if (!pending) {pending=true;requestAnimationFrame(update);}};
  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate,{passive:true});
  window.addEventListener('load',requestUpdate,{once:true});
  requestUpdate();
})();
