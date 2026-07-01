document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll('.scrolly-step');
  const visuals = document.querySelectorAll('.scrolly-visual');

  if (!steps.length || !visuals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all
        steps.forEach(s => s.classList.remove('is-active'));
        visuals.forEach(v => v.classList.remove('is-active'));
        
        // Add active to current step
        entry.target.classList.add('is-active');
        
        // Add active to corresponding visual
        const index = entry.target.getAttribute('data-index');
        const visual = document.querySelector(`.scrolly-visual[data-index="${index}"]`);
        if(visual) {
          visual.classList.add('is-active');
        }
      }
    });
  }, {
    // Trigger when the element crosses the middle 10% of the screen
    rootMargin: "-45% 0px -45% 0px", 
    threshold: 0
  });

  steps.forEach(step => observer.observe(step));
});
