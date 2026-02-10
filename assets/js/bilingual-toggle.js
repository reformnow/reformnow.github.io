// Bilingual Toggle System
// Allows readers to switch between English, Chinese, or Both

(function() {
  'use strict';
  
  // Global function for button clicks
  window.setLanguageView = function(lang) {
    // Update button states
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
      }
    });
    
    // Show/hide content
    document.querySelectorAll('.lang-en').forEach(block => {
      block.style.display = (lang === 'english' || lang === 'both') ? 'block' : 'none';
    });
    
    document.querySelectorAll('.lang-zh').forEach(block => {
      block.style.display = (lang === 'chinese' || lang === 'both') ? 'block' : 'none';
    });
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
  };
  
  // Initialize on page load
  function init() {
    // Check if this is a bilingual post
    if (!document.querySelector('.lang-en') && !document.querySelector('.lang-zh')) return;
    
    // Restore saved preference or default to english
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) {
      setLanguageView(saved);
    } else {
      setLanguageView('english');
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();