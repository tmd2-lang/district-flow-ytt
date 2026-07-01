document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll('.scrolly-step');
  const visuals = document.querySelectorAll('.scrolly-visual');

  if (!steps.length || !visuals.length) return;

  // Adjust trigger point based on device
  // On mobile, the visual is at the top 40vh, so we want the text to trigger lower down
  const isMobile = window.innerWidth <= 768;
  const rootMargin = isMobile ? "-40% 0px -20% 0px" : "-45% 0px -45% 0px";

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
    // Trigger based on device viewport
    rootMargin: rootMargin, 
    threshold: 0
  });

  steps.forEach(step => observer.observe(step));
});
