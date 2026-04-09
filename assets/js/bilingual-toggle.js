// Bilingual Toggle System v1.5 - 2026-02-16
// Allows readers to switch between English, Chinese, or Both

(function() {
  'use strict';
  
  // Note: Core bilingual CSS is now injected in head.html to prevent FOUC.

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
    
    // Update html class
    // Map 'both' to 'bilingual' to match CSS rules
    const classMode = (lang === 'both' ? 'bilingual' : lang);
    document.documentElement.classList.remove('view-english', 'view-chinese', 'view-bilingual');
    document.documentElement.classList.add(`view-${classMode}`);
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
  };
  
  // Tag TOC links based on their targets' language
  window.tagTOCLinks = function() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;

    tocLinks.forEach(link => {
      // Clear existing language classes to avoid double-tagging
      link.classList.remove('lang-en', 'lang-zh');
      const parentLi = link.closest('li');
      if (parentLi) parentLi.classList.remove('lang-en', 'lang-zh');

      const href = link.getAttribute('href');
      let tagged = false;

      if (href && href.startsWith('#')) {
        try {
          const targetId = decodeURIComponent(href.substring(1));
          const target = document.getElementById(targetId);
          if (target) {
            const parentEn = target.closest('.lang-en');
            const parentZh = target.closest('.lang-zh');
            if (parentEn && !parentZh) { // Only English
              link.classList.add('lang-en');
              if (parentLi) parentLi.classList.add('lang-en');
              tagged = true;
            } else if (parentZh) { // If it has Chinese or both, prefer Chinese for filtering
              link.classList.add('lang-zh');
              if (parentLi) parentLi.classList.add('lang-zh');
              tagged = true;
            }
          }
        } catch (e) {}
      }

      // Fallback: Check text content for Chinese characters if not tagged yet
      if (!tagged) {
        const text = link.textContent || '';
        const hasChinese = /[\u4e00-\u9fa5]/.test(text);
        if (hasChinese) {
          link.classList.add('lang-zh');
          if (parentLi) parentLi.classList.add('lang-zh');
        } else if (text.trim().length > 0) {
          // Default to English if it has text and not tagged
          link.classList.add('lang-en');
          if (parentLi) parentLi.classList.add('lang-en');
        }
      }
    });
  };

  // Initialize on page load
  function init() {
    console.log('Bilingual Toggle init (v1.5)');
    // Initial tagging
    tagTOCLinks();

    // Watch for dynamic TOC changes
    const observer = new MutationObserver((mutations) => {
      let tocChanged = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.classList.contains('toc-link') || node.querySelector('.toc-link'))) {
              tocChanged = true;
            }
          });
        }
      });
      if (tocChanged) {
        tagTOCLinks();
      }
    });

    const tocWrapper = document.getElementById('toc-wrapper');
    if (tocWrapper) {
      observer.observe(tocWrapper, { childList: true, subtree: true });
    } else {
      // Fallback if TOC wrapper isn't found yet or on this page
      const panel = document.getElementById('panel-wrapper') || document.body;
      observer.observe(panel, { childList: true, subtree: true });
    }

    // Recurrent check for first few seconds
    let checks = 0;
    const interval = setInterval(() => {
      tagTOCLinks();
      if (++checks > 10) clearInterval(interval);
    }, 1000);

    // Also run on full page load
    window.addEventListener('load', tagTOCLinks);

    // Restore saved preference or default to english
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) {
      setLanguageView(saved);
    } else {
      setLanguageView('chinese');
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();