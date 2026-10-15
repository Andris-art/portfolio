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
