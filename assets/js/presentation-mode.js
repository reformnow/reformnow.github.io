// Presentation Mode for Posts Tagged with 'slide'
(function() {
  'use strict';
  
  // Create and inject presentation button
  function injectPresentationButton() {
    // Check if this post has the 'slide' tag
    const postTags = document.querySelectorAll('.post-tag');
    let hasSlideTag = false;
    postTags.forEach(tag => {
      if (tag.textContent.trim().toLowerCase() === 'slide') {
        hasSlideTag = true;
      }
    });
    
    if (!hasSlideTag) return;
    
    const tocWrapper = document.getElementById('toc-wrapper');
    if (!tocWrapper) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'presentation-trigger-container';
    buttonContainer.className = 'mt-3';
    
    const button = document.createElement('button');
    button.id =  'start-presentation';
    button.className = 'btn btn-outline-primary btn-sm w-100';
    // Check if Font Awesome is available, fallback to emoji if not
    const iconHtml = (typeof document.querySelector('.fas') !== 'undefined' || 
                     document.querySelector('link[href*="fontawesome"]') || 
                     document.querySelector('link[href*="fa-"]')) ? 
      '<i class="fas fa-desktop me-2"></i>' : '📊 ';
    button.innerHTML = iconHtml + 'Presentation Mode';
    
    buttonContainer.appendChild(button);
    tocWrapper.appendChild(buttonContainer);
    
    // Attach click handler
    button.addEventListener('click', startPresentation);
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPresentationButton);
  } else {
    injectPresentationButton();
  }
  
  function startPresentation() {
    const contentEl = document.querySelector('.content');
    if (!contentEl) {
      console.warn('Presentation mode: .content element not found');
      alert('Unable to start presentation mode: content not found');
      return;
    }
    
    const originalContent = contentEl.cloneNode(true);
    
    // Check language preference
    const langPreference = localStorage.getItem('preferredLanguage') || 'english';
    const hasBilingualContent = contentEl.querySelector('.lang-en') && contentEl.querySelector('.lang-zh');
    
    // Filter content based on language preference
    if (hasBilingualContent) {
      const contentCopy = originalContent.cloneNode(true);
      const langEnDivs = contentCopy.querySelectorAll('.lang-en');
      const langZhDivs = contentCopy.querySelectorAll('.lang-zh');
      
      if (langPreference === 'english') {
        // Show only English
        langZhDivs.forEach(div => div.remove());
      } else if (langPreference === 'chinese') {
        // Show only Chinese
        langEnDivs.forEach(div => div.remove());
      }
      // For 'both', keep both and handle later
      
      // Replace originalContent with filtered version for processing
      while (originalContent.firstChild) {
        originalContent.removeChild(originalContent.firstChild);
      }
      while (contentCopy.firstChild) {
        originalContent.appendChild(contentCopy.firstChild);
      }
    }

    // Request Fullscreen
    const docEl = document.documentElement;
    try {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e);
    }
    
    // Create slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'slides';
    
    // Get post metadata from page
    const postTitle = document.querySelector('h1[data-toc-skip]')?.textContent || document.title.split(' | ')[0];
    // Get the first image from the article content
    const postImage = document.querySelector('.content img')?.src || '';
    const postDesc = document.querySelector('meta[name="description"]')?.content || '';
    
    // Create cover slide
    const coverHSection = document.createElement('section');
    const coverVSection = document.createElement('section');
    coverVSection.className = 'cover-slide';
    coverVSection.innerHTML = `
      <h1 class="reveal-title text-center mb-4">${postTitle}</h1>
      ${postImage ? `<div class="text-center mb-4"><img src="${postImage}" class="reveal-cover-img" style="max-height: 500px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); background: transparent !important;"></div>` : ''}
      ${postDesc ? `<p class="reveal-description text-center mt-3">${postDesc}</p>` : ''}
    `;
    coverHSection.appendChild(coverVSection);
    slidesContainer.appendChild(coverHSection);
    
    // Parse content into slides
    let currentHSection = document.createElement('section');
    let currentVSection = document.createElement('section');
    currentHSection.appendChild(currentVSection);
    slidesContainer.appendChild(currentHSection);
    
    let currentTitleNode = null;
    let pendingImage = null;
    let pendingText = [];
    
    function createSlideWithLayout() {
      if (pendingImage && pendingText.length > 0) {
        // Create two-column layout: image left, text right
        const layoutDiv = document.createElement('div');
        layoutDiv.className = 'slide-layout';
        
        const imgDiv = document.createElement('div');
        imgDiv.appendChild(pendingImage.cloneNode(true));
        
        const textDiv = document.createElement('div');
        pendingText.forEach(textNode => textDiv.appendChild(textNode.cloneNode(true)));
        
        layoutDiv.appendChild(imgDiv);
        layoutDiv.appendChild(textDiv);
        currentVSection.appendChild(layoutDiv);
      } else if (pendingImage) {
        // Only image, no text
        currentVSection.appendChild(pendingImage.cloneNode(true));
      } else if (pendingText.length > 0) {
        // Only text, no image
        pendingText.forEach(textNode => currentVSection.appendChild(textNode.cloneNode(true)));
      }
      
      pendingImage = null;
      pendingText = [];
    }
    
    function flushAndCreateNewSection() {
      createSlideWithLayout();
      currentVSection = document.createElement('section');
      currentHSection.appendChild(currentVSection);
      if (currentTitleNode) {
        currentVSection.appendChild(currentTitleNode.cloneNode(true));
      }
    }
    
    Array.from(originalContent.childNodes).forEach(node => {
      const isBlock = ['P', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'FIGURE', 'DIV', 'TABLE'].includes(node.nodeName);
      const isEmpty = node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
      const isImage = node.nodeName === 'IMG' || (node.nodeName === 'P' && node.querySelector('img')) || node.nodeName === 'FIGURE';
      
      if (node.nodeName === 'H2' || node.nodeName === 'H3') {
        createSlideWithLayout();
        currentHSection = document.createElement('section');
        currentVSection = document.createElement('section');
        currentHSection.appendChild(currentVSection);
        slidesContainer.appendChild(currentHSection);
        
        currentTitleNode = node.cloneNode(true);
        currentVSection.appendChild(currentTitleNode.cloneNode(true));
      } else if (node.nodeName === 'HR') {
        flushAndCreateNewSection();
      } else if (isImage) {
        // Check if we already have an image pending (new slide for multiple images)
        if (pendingImage) {
          createSlideWithLayout();
        }
        // Extract image from P or FIGURE if needed
        if (node.nodeName === 'P' && node.querySelector('img')) {
          pendingImage = node.querySelector('img');
          // Add any caption text
          const caption = node.querySelector('em, figcaption');
          if (caption && !pendingText.includes(caption)) {
            pendingText.push(caption);
          }
        } else {
          pendingImage = node;
        }
      } else if (node.nodeName === 'DIV' && (node.classList.contains('lang-en') || node.classList.contains('lang-zh'))) {
        // Handle bilingual language divs
        if (langPreference === 'both') {
          // In "both" mode, we need to pair English and Chinese side by side
          // Store the current node and look for its pair
          const isEnglish = node.classList.contains('lang-en');
          const sibling = isEnglish ? node.nextElementSibling : node.previousElementSibling;
          
          if (isEnglish && sibling && sibling.classList.contains('lang-zh')) {
            // We have both English and Chinese - create side-by-side slide
            const slideSection = document.createElement('section');
            const sideBySideDiv = document.createElement('div');
            sideBySideDiv.style.cssText = 'display: flex; gap: 40px; height: 100%; align-items: flex-start;';
            
            // English side (left)
            const enDiv = document.createElement('div');
            enDiv.style.cssText = 'flex: 1; text-align: left; font-size: 0.7em;';
            const enContent = node.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre');
            enContent.forEach(child => enDiv.appendChild(child.cloneNode(true)));
            
            // Chinese side (right)
            const zhDiv = document.createElement('div');
            zhDiv.style.cssText = 'flex: 1; text-align: left; font-size: 0.7em;';
            const zhContent = sibling.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre');
            zhContent.forEach(child => zhDiv.appendChild(child.cloneNode(true)));
            
            sideBySideDiv.appendChild(enDiv);
            sideBySideDiv.appendChild(zhDiv);
            slideSection.appendChild(sideBySideDiv);
            slidesContainer.appendChild(slideSection);
          }
          // Skip the Chinese div since we already processed it with English
        } else {
          // For English or Chinese only mode, extract content normally
          const langContent = node.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre');
          langContent.forEach(child => {
            if (child.nodeName === 'H2' || child.nodeName === 'H3') {
              // Create new horizontal slide for headers
              createSlideWithLayout();
              currentHSection = document.createElement('section');
              currentVSection = document.createElement('section');
              currentHSection.appendChild(currentVSection);
              slidesContainer.appendChild(currentHSection);
              
              currentTitleNode = child.cloneNode(true);
              currentVSection.appendChild(currentTitleNode.cloneNode(true));
            } else {
              // Add other content to current vertical slide
              currentVSection.appendChild(child.cloneNode(true));
            }
          });
        }
      } else if (isBlock && !isEmpty) {
      // Check if we have an image pending and this is substantial text
      if (pendingImage && node.textContent.trim().length > 50) {
        pendingText.push(node);
        createSlideWithLayout();
      } else {
        if (currentVSection.childNodes.length > 0 && !pendingImage) {
          flushAndCreateNewSection();
        }
        if (pendingImage) {
          pendingText.push(node);
        } else {
          currentVSection.appendChild(node.cloneNode(true));
      }
    }
  } else if (!isEmpty) {
    if (pendingImage) {
      pendingText.push(node);
    } else {
      currentVSection.appendChild(node.cloneNode(true));
    }
  }
});

// Flush any remaining content
    createSlideWithLayout();
    
    // Load Reveal.js styles
    const styles = [
      'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css',
      'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/league.css',
      'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/highlight/monokai.css'
    ];
    
    styles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
    
    // Add custom styles
    const style = document.createElement('style');
    style.innerHTML = `
      body { overflow: hidden; }
      #main-wrapper { display: none !important; }
      #sidebar { display: none !important; }
      #search-results { display: none !important; }
      footer { display: none !important; }
      .reveal-viewport { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: #222; }
      .reveal .slides section { text-align: left; font-size: 0.8em; }
      .reveal.overview .slides section {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      .reveal.overview .slides section.present {
        outline: 4px solid #ff8c00 !important;
        outline-offset: 2px;
      }
      .reveal h1, .reveal h2, .reveal h3 { text-transform: none; }
      .reveal .cover-slide { text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; }
      .reveal .cover-slide h1 { font-size: 2.2em; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
      .reveal .cover-slide p { font-size: 1.2em; color: #ccc; }
      .reveal img { max-height: 500px; width: 100%; object-fit: contain; background: none !important; box-shadow: none !important; }
      .reveal .slide-layout { display: flex; gap: 40px; align-items: center; height: 100%; }
      .reveal .slide-layout > div:first-child { flex: 1; max-width: 50%; }
      .reveal .slide-layout > div:last-child { flex: 1; max-width: 50%; text-align: left; font-size: 0.75em; }
      .reveal .slide-layout img { max-height: 400px; border-radius: 8px; }
      .reveal .shimmer { animation: none !important; background: none !important; }
      .reveal .shimmer::before { display: none !important; }
      #exit-presentation {
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        opacity: 0.5; transition: opacity 0.3s;
      }
      #exit-presentation:hover { opacity: 1; }
    `;
    document.head.appendChild(style);
    
    // Create Reveal structure
    const revealDiv = document.createElement('div');
    revealDiv.className = 'reveal';
    const exitBtn = document.createElement('button');
    exitBtn.id = 'exit-presentation';
    exitBtn.className = 'btn btn-sm btn-secondary text-white';
    exitBtn.innerText = 'Exit';
    revealDiv.appendChild(exitBtn);
    revealDiv.appendChild(slidesContainer);
    
    document.body.appendChild(revealDiv);
 document.body.classList.add('reveal-viewport');
    
    // Load Reveal.js scripts
    const scripts = [
      'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js',
      'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/highlight/highlight.js',
      'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/notes/notes.js'
    ];
    
    let loadedCount = 0;
    let failedCount = 0;
    
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        loadedCount++;
        if (loadedCount === scripts.length) {
          try {
            Reveal.initialize({
              hash: true,
              slideNumber: 'c/t',
              plugins: [ RevealHighlight, RevealNotes ]
            });
          } catch (e) {
            console.error('Failed to initialize Reveal.js:', e);
          }
        }
      };
      script.onerror = () => {
        failedCount++;
        console.error('Failed to load script:', src);
        if (failedCount === scripts.length) {
          alert('Failed to load presentation resources. Please check your internet connection.');
        }
      };
      document.head.appendChild(script);
    });
    
    // Exit handler
    exitBtn.addEventListener('click', function() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      
      revealDiv.remove();
      document.body.classList.remove('reveal-viewport');
      document.querySelectorAll('style, link[href*="reveal"], script[src*="reveal"]').forEach(el => {
        if (el.href?.includes('reveal') || el.src?.includes('reveal') || el.innerHTML?.includes('reveal')) {
          el.remove();
        }
      });
    });
  }
})();
