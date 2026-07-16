document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('yttForm');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtn = document.getElementById('prevBtn');
  const nextArrowBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  
  let currentStepIndex = 0;
  const totalSteps = steps.length - 1; // Exclude success step from progress

  // Initialize
  updateUI();

  // Next Button Clicks (Inline)
  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('submit-btn')) {
        submitForm();
      } else {
        advanceStep();
      }
    });
  });

  // Global Navigation (Bottom Arrows)
  prevBtn.addEventListener('click', () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  });

  nextArrowBtn.addEventListener('click', () => {
    advanceStep();
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    // Only handle Enter if we're not on the success step
    if (currentStepIndex >= steps.length - 1) return;

    const activeStep = steps[currentStepIndex];
    const activeInput = activeStep.querySelector('input, textarea');

    if (e.key === 'Enter') {
      // For textarea, require Cmd+Enter or Ctrl+Enter to advance
      if (activeInput && activeInput.tagName.toLowerCase() === 'textarea') {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          advanceStep();
        }
      } else {
        // For inputs, radio, or no inputs (like start screen), just Enter
        e.preventDefault();
        if (activeStep.querySelector('.submit-btn')) {
          submitForm();
        } else {
          advanceStep();
        }
      }
    }
  });

  function advanceStep() {
    if (validateStep(currentStepIndex)) {
      goToStep(currentStepIndex + 1);
    } else {
      // Shake or highlight invalid input
      const activeStep = steps[currentStepIndex];
      const input = activeStep.querySelector('input:invalid, textarea:invalid');
      if (input) {
        input.focus();
        input.style.borderColor = '#e35d5d'; // error color
        setTimeout(() => {
          input.style.borderColor = '';
        }, 1000);
      }
    }
  }

  function validateStep(index) {
    const step = steps[index];
    const requiredInputs = step.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    // For radio buttons, check if any is checked
    const radioGroups = new Set(Array.from(step.querySelectorAll('input[type="radio"][required]')).map(r => r.name));
    radioGroups.forEach(name => {
      const checked = step.querySelector(`input[name="${name}"]:checked`);
      if (!checked) isValid = false;
    });

    // For text/textarea
    requiredInputs.forEach(input => {
      if (input.type !== 'radio' && !input.value.trim()) {
        isValid = false;
      }
    });

    return isValid;
  }

  function goToStep(index) {
    if (index < 0 || index >= steps.length) return;

    // Remove active class from current
    steps[currentStepIndex].classList.remove('active');
    
    // If moving forward, we can add a class to animate the previous one up
    if (index > currentStepIndex) {
      steps[currentStepIndex].classList.add('fade-up');
    } else {
      // If moving backward, remove fade-up so it comes back down
      steps[index].classList.remove('fade-up');
    }

    currentStepIndex = index;
    steps[currentStepIndex].classList.add('active');

    // Focus the first input of the new step after transition
    setTimeout(() => {
      const input = steps[currentStepIndex].querySelector('input:not([type="radio"]), textarea');
      if (input) {
        input.focus();
      }
    }, 400);

    updateUI();
  }

  function updateUI() {
    // Update Progress
    const progressPercent = Math.min((currentStepIndex / (totalSteps - 1)) * 100, 100);
    progressBar.style.width = `${progressPercent}%`;

    // Update Nav Buttons
    prevBtn.disabled = currentStepIndex === 0 || currentStepIndex === steps.length - 1; // Disabled on first and success step
    nextArrowBtn.disabled = currentStepIndex === steps.length - 1; // Disabled on success step
    
    // Hide controls completely on success step
    const controls = document.querySelector('.form-controls');
    if (currentStepIndex === steps.length - 1) {
      controls.style.display = 'none';
      document.querySelector('.progress-container').style.display = 'none';
    } else {
      controls.style.display = 'flex';
      document.querySelector('.progress-container').style.display = 'block';
    }
  }

  function submitForm() {
    if (validateStep(currentStepIndex)) {
      const submitBtn = steps[currentStepIndex].querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner" style="display:inline-block; margin-right:8px; animation: spin 1s linear infinite;">↻</span> Submitting...';
      submitBtn.disabled = true;

      // Extract all form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Map data to Google Form entry IDs
      const googleFormData = new FormData();
      googleFormData.append('entry.1259628041', data.fullName || '');
      googleFormData.append('entry.691831395', data.preferredName || '');
      googleFormData.append('entry.606437191', data.pronouns || '');
      googleFormData.append('entry.822717005', data.email || '');
      googleFormData.append('entry.861627515', data.location || '');
      googleFormData.append('entry.1148455587', data.work || '');
      googleFormData.append('entry.1933749134', data.relationship || '');
      googleFormData.append('entry.278265767', data.firstFound || '');
      googleFormData.append('entry.1026617862', data.currentPractice || '');
      googleFormData.append('entry.1593210737', data.influences || '');
      googleFormData.append('entry.281801859', data.wherePractice || '');
      googleFormData.append('entry.976591315', data.goals || '');
      googleFormData.append('entry.1739093264', data.commitment || '');
      googleFormData.append('entry.85835337', data.commitmentDetails || '');
      googleFormData.append('entry.1894710284', data.injuries || '');
      googleFormData.append('entry.780045024', data.accommodations || '');
      googleFormData.append('entry.688776529', data.anythingElse || '');
      googleFormData.append('entry.1458245517', data.paymentPref || '');
      googleFormData.append('entry.94608760', 'By submitting this application, you acknowledge: You are ready to commit to the full training experience. You understand this is a space for growth, reflection, and accountability. All information shared is true to the best of your knowledge.');
      googleFormData.append('entry.1944213710', data.signature || '');
      
      const d = new Date();
      googleFormData.append('entry.1297530892_year', d.getFullYear());
      googleFormData.append('entry.1297530892_month', d.getMonth() + 1);
      googleFormData.append('entry.1297530892_day', d.getDate());
      googleFormData.append('entry.1297530892', d.toISOString().split('T')[0]);

      const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeB7lyrV38Gd5_D9WZfi98y7nKJfGkjs9DL9LhoQ9G7YtbUIA/formResponse";
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzgku1-f7nOA_rz5h-gLW2UYhqZXy3Fsaitdyty67gKCVuxIf_cSPzfpGTdeATijpU/exec";

      const formReq = fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData
      });

      const scriptReq = fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      });

      // Wait for both to complete
      Promise.all([formReq, scriptReq])
      .then(() => {
         if (typeof fbq === 'function') {
           fbq('track', 'Lead');
         }
         
         if (typeof gtag === 'function') {
           gtag('event', 'ytt_apply');
           gtag('event', 'conversion', {'send_to': 'AW-17913076908/e4YaCIPc9c8cEKy5z91C'});
         }
         
         goToStep(steps.length - 1);
      })
      .catch(error => {
         console.error('Error submitting forms:', error);
         alert("A network error occurred. Please check your connection and try again.");
         submitBtn.textContent = originalText;
         submitBtn.disabled = false;
      });
    }
  }
});
