// Bilingual Toggle System v1.5 - 2026-02-16
// Allows readers to switch between English, Chinese, or Both

(function() {
  'use strict';
  
  // Inject filtering CSS
  const style = document.createElement('style');
  style.id = 'bilingual-styles';
  style.textContent = `
    /* Core Visibility: Standard language toggle */
    .view-english .lang-zh { display: none !important; }
    .view-chinese .lang-en { display: none !important; }
    
    /* TOC Hierarchy: Keep parent shells visible if they have children of the active language */
    .view-chinese li.lang-en:has(.lang-zh) { display: block !important; }
    .view-chinese li.lang-en:has(.lang-zh) > .toc-link.lang-en { display: none !important; }
    .view-english li.lang-zh:has(.lang-en) { display: block !important; }
    .view-english li.lang-zh:has(.lang-en) > .toc-link.lang-zh { display: none !important; }
    
    /* Permanent Bilingual: Sidebar, Nav, and Section headings always show both */
    #sidebar .nav-item .lang-en, #sidebar .nav-item .lang-zh,
    #topbar-wrapper .lang-en, #topbar-wrapper .lang-zh,
    .panel-heading .lang-en, .panel-heading .lang-zh,
    #access-lastmod .lang-en, #access-lastmod .lang-zh { 
      display: inline !important; 
    }
    
    /* Separators for Menu items (Not TOC) */
    #sidebar .nav-item .lang-en + .lang-zh::before,
    #topbar-wrapper .lang-en + .lang-zh::before,
    .panel-heading .lang-en + .lang-zh::before,
    #access-lastmod .lang-en + .lang-zh::before { 
      content: "/"; margin: 0 4px; font-size: 0.8em; opacity: 0.5; 
    }
    
    /* Bilingual View: Main Content blocks */
    .view-bilingual .lang-en, .view-bilingual .lang-zh { display: inline-block; }
    .view-bilingual div.lang-en, .view-bilingual div.lang-zh, 
    .view-bilingual section.lang-en, .view-bilingual section.lang-zh { display: block !important; }
    
    /* TOC Layout: Vertical links with tight spacing */
    .toc-link { display: block !important; padding: 2px 0 2px 1.25rem !important; }
  `;
  document.head.appendChild(style);

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
    document.documentElement.classList.remove('view-english', 'view-chinese', 'view-bilingual');
    document.documentElement.classList.add(`view-${lang}`);
    
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
            if (node.nodeType === 1 && (node.className?.includes?.('toc-link') || node.querySelector?.('.toc-link'))) {
              tocChanged = true;
            }
          });
        }
      });
      if (tocChanged) {
        tagTOCLinks();
      }
    });

    const panel = document.getElementById('panel-wrapper') || document.body;
    observer.observe(panel, { childList: true, subtree: true });

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