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
      const parentLi = link.closest('li');
      const href = link.getAttribute('href');
      let tagged = false;
      let expectedClass = '';

      if (href && href.startsWith('#')) {
        try {
          const targetId = decodeURIComponent(href.substring(1));
          const target = document.getElementById(targetId);
          if (target) {
            const parentEn = target.closest('.lang-en');
            const parentZh = target.closest('.lang-zh');
            if (parentEn && !parentZh) { // Only English
              expectedClass = 'lang-en';
            } else if (parentZh) { // If it has Chinese or both, prefer Chinese for filtering
              expectedClass = 'lang-zh';
            }
          }
        } catch (e) {}
      }

      // Fallback: Check text content for Chinese characters if not tagged yet
      if (!expectedClass) {
        const text = link.textContent || '';
        const hasChinese = /[\u4e00-\u9fa5]/.test(text);
        if (hasChinese) {
          expectedClass = 'lang-zh';
        } else if (text.trim().length > 0) {
          expectedClass = 'lang-en';
        }
      }

      // Apply expected class if not already present
      if (expectedClass) {
        if (!link.classList.contains(expectedClass)) {
          link.classList.remove('lang-en', 'lang-zh');
          link.classList.add(expectedClass);
        }
        if (parentLi && !parentLi.classList.contains(expectedClass)) {
          parentLi.classList.remove('lang-en', 'lang-zh');
          parentLi.classList.add(expectedClass);
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
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.classList.contains('toc-link') || node.querySelector('.toc-link'))) {
              tocChanged = true;
            }
          });
        } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // If tocbot strips our classes when active states change
          const target = mutation.target;
          if (target.classList.contains('toc-link') || target.tagName === 'LI') {
            // We'll just trigger a check if the node doesn't have our tags but is a toc link/item
            if (!target.classList.contains('lang-en') && !target.classList.contains('lang-zh')) {
              tocChanged = true;
            }
          }
        }
      });
      if (tocChanged) {
        tagTOCLinks();
      }
    });

    const tocWrapper = document.getElementById('toc-wrapper');
    if (tocWrapper) {
      observer.observe(tocWrapper, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    } else {
      // Fallback if TOC wrapper isn't found yet or on this page
      const panel = document.getElementById('panel-wrapper') || document.body;
      observer.observe(panel, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
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