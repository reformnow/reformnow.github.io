// Bilingual Toggle System
// Allows readers to switch between English, Chinese, or Both

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function init() {
    // Check if this is a bilingual post
    if (!document.querySelector('.post-content')) return;
    
    // Create language switcher
    createLanguageSwitcher();
    
    // Set default view
    setLanguageView('english');
  }
  
  function createLanguageSwitcher() {
    // Find the post header
    const header = document.querySelector('h1.dynamic-title');
    if (!header) return;
    
    // Create switcher container
    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.style.cssText = 'margin: 1rem 0; padding: 0.5rem 0; border-bottom: 1px solid #e9ecef;';
    
    // Create buttons
    switcher.innerHTML = `
      <div class="btn-group" role="group" aria-label="Language switcher">
        <button type="button" class="btn btn-sm btn-outline-primary active" data-lang="english" onclick="setLanguageView('english')">
          English
        </button>
        <button type="button" class="btn btn-sm btn-outline-primary" data-lang="chinese" onclick="setLanguageView('chinese')">
          中文
        </button>
        <button type="button" class="btn btn-sm btn-outline-primary" data-lang="both" onclick="setLanguageView('both')">
          Both / 双语
        </button>
      </div>
      <small class="text-muted ms-2" style="font-size: 0.8rem;">Click to switch language</small>
    `;
    
    // Insert after header
    header.parentNode.insertBefore(switcher, header.nextSibling);
  }
  
  // Global function
  window.setLanguageView = function(lang) {
    const content = document.querySelector('.post-content');
    if (!content) return;
    
    // Update button states
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
        btn.classList.replace('btn-outline-primary', 'btn-primary');
      } else {
        btn.classList.remove('active');
        btn.classList.replace('btn-primary', 'btn-outline-primary');
      }
    });
    
    // Show/hide content
    const englishBlocks = content.querySelectorAll('.lang-en');
    const chineseBlocks = content.querySelectorAll('.lang-zh');
    
    englishBlocks.forEach(block => {
      block.style.display = (lang === 'english' || lang === 'both') ? 'block' : 'none';
    });
    
    chineseBlocks.forEach(block => {
      block.style.display = (lang === 'chinese' || lang === 'both') ? 'block' : 'none';
    });
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
  };
  
  // Restore saved preference
  function restorePreference() {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) {
      setLanguageView(saved);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
    restorePreference();
  }
})();