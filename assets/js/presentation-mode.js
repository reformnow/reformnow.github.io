// Presentation Mode for Posts Tagged with 'slide'
(function() {
  'use strict';

  console.log('Presentation mode script loaded');

  // Create and inject presentation button
  function injectPresentationButton() {
    console.log('Attempting to inject presentation button v6 (TOC-aware)...');
    
    // We only want to inject the button on individual post pages.
    // In Chirpy, ONLY individual posts have a #toc-wrapper (Table of Contents).
    // Tab pages (Archives, Timelines, etc.) and the Home page do not.
    if (!document.getElementById('toc-wrapper')) {
      console.log('Not a post page (no #toc-wrapper found). Skipping.');
      return;
    }
    
    // 1. Get the main content of the post
    // On a post page, there's only one .content.
    const allContents = document.querySelectorAll('.content');
    
    allContents.forEach(contentEl => {
      // Skip if this content is inside a sidebar or panel (safety check)
      if (contentEl.closest('#panel-wrapper') || contentEl.closest('.card-body')) {
        return;
      }

      // 2. Since this is likely the main post content, check for the 'slide' tag
      // The 'slide' tag should be present on the page for this logic to run,
      // but we specifically check again here to be safe.
      const postTags = document.querySelectorAll('.post-tag');
      let hasSlideTag = false;
      postTags.forEach(tag => {
        if (tag.textContent.trim().toLowerCase() === 'slide') {
          hasSlideTag = true;
        }
      });

      if (!hasSlideTag) return;

      // 3. Find/Create placement target
      let switcher = contentEl.parentElement.querySelector('.lang-switcher');
      if (!switcher) {
        console.log('Creating language switcher for button placement...');
        switcher = document.createElement('div');
        switcher.className = 'lang-switcher my-4 py-2 border-bottom d-flex justify-content-between align-items-center';
        contentEl.parentNode.insertBefore(switcher, contentEl);
      }
      
      // 4. Inject the button if not already there
      if (switcher.querySelector('#start-presentation')) return;

      const button = document.createElement('button');
      button.id = 'start-presentation';
      button.className = 'btn btn-outline-primary btn-sm';
      
      const iconHtml = (typeof document.querySelector('.fas') !== 'undefined' || 
                       document.querySelector('link[href*="fontawesome"]') || 
                       document.querySelector('link[href*="fa-"]')) ? 
        '<i class="fas fa-desktop me-2"></i>' : '📊 ';
      button.innerHTML = iconHtml + 'Presentation Mode';
      
      switcher.appendChild(button);
      switcher.classList.add('d-flex', 'justify-content-between', 'align-items-center');
      
      button.addEventListener('click', startPresentation);
      console.log('Presentation button successfully injected into post content.');
    });
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPresentationButton);
  } else {
    injectPresentationButton();
  }
  
  function startPresentation() {
    console.log('startPresentation called');
    const contentEl = document.querySelector('.content');
    console.log('Content element found:', !!contentEl);
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
    // Get the post's featured image (preview-img) or first image from content
    const featuredImage = document.querySelector('.preview-img img')?.src || document.querySelector('img[src*="/posts/"]')?.src || document.querySelector('.content img')?.src || '';
    const postDesc = document.querySelector('meta[name="description"]')?.content || '';
    
    // Create cover slide
    const coverHSection = document.createElement('section');
    const coverVSection = document.createElement('section');
    coverVSection.className = 'cover-slide';
    coverVSection.innerHTML = `
      <div class="container py-4">
        <h1 class="reveal-title text-center mb-4" style="font-size: 2.8em; color: #d4af37; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${postTitle}</h1>
        <div class="cover-image-container" style="position: relative; width: 100%; max-width: 1000px; margin: 0 auto;">
          ${featuredImage ? `<img src="${featuredImage}" class="reveal-cover-img" style="width: 100%; max-height: 500px; object-fit: cover; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); display: block;">` : ''}
          ${postDesc ? `
            <div class="description-overlay" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 60px 30px 25px 30px; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; text-align: left;">
              <p class="reveal-description" style="font-size: 1.2em; color: #fff; margin: 0; line-height: 1.4; text-shadow: 1px 1px 5px rgba(0,0,0,0.8); max-width: 85%; font-weight: 300; letter-spacing: 0.5px;">${postDesc}</p>
            </div>
          ` : ''}
        </div>
      </div>
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
        createSlideWithLayout();
        // HR creates a new horizontal section
        currentHSection = document.createElement('section');
        currentVSection = document.createElement('section');
        currentHSection.appendChild(currentVSection);
        slidesContainer.appendChild(currentHSection);
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
          const isEnglish = node.classList.contains('lang-en');
          const sibling = isEnglish ? node.nextElementSibling : node.previousElementSibling;
          
          if (isEnglish && sibling && sibling.classList.contains('lang-zh')) {
            // Split content of both divs into chunks
            const enNodes = Array.from(node.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre, hr'));
            const zhNodes = Array.from(sibling.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre, hr'));
            
            let enChunk = [];
            let zhChunk = [];
            let maxLen = Math.max(enNodes.length, zhNodes.length);
            
            for (let i = 0; i < maxLen; i++) {
              const en = enNodes[i];
              const zh = zhNodes[i];
              
              if (!en && !zh) continue;

              const isHeader = en && (en.nodeName === 'H2' || en.nodeName === 'H3');
              const isHR = en && en.nodeName === 'HR';
              
              if (isHeader || isHR) {
                // Headers and HRs create a new horizontal section
                createSlideWithLayout();
                currentHSection = document.createElement('section');
                currentVSection = document.createElement('section');
                currentHSection.appendChild(currentVSection);
                slidesContainer.appendChild(currentHSection);
                
                if (isHeader) {
                  // Create side-by-side header slide
                  const headerSlide = document.createElement('section');
                  const headerFlex = document.createElement('div');
                  headerFlex.style.cssText = 'display: flex; gap: 40px; align-items: center; justify-content: center; height: 100%;';
                  
                  const enH = en.cloneNode(true);
                  enH.style.flex = '1';
                  enH.style.textAlign = 'right';
                  
                  const zhH = (zh && (zh.nodeName === 'H2' || zh.nodeName === 'H3')) ? zh.cloneNode(true) : en.cloneNode(true);
                  zhH.style.flex = '1';
                  zhH.style.textAlign = 'left';
                  
                  headerFlex.appendChild(enH);
                  headerFlex.appendChild(zhH);
                  headerSlide.appendChild(headerFlex);
                  currentHSection.appendChild(headerSlide);
                  
                  // Reset title node for subsequent vertical slides
                  currentTitleNode = enH.cloneNode(true);
                  currentTitleNode.style.fontSize = '0.8em';
                  currentTitleNode.style.textAlign = 'center';
                  currentTitleNode.style.opacity = '0.5';
                }
                continue;
              }

              // For all other content (P, UL, OL, PRE, etc.), create a vertical slide
              const slideSection = document.createElement('section');
              const sideBySideDiv = document.createElement('div');
              sideBySideDiv.style.cssText = 'display: flex; gap: 40px; height: 100%; align-items: center; justify-content: center;';
              
              const enCol = document.createElement('div');
              enCol.style.cssText = 'flex: 1; text-align: left; font-size: 0.75em;';
              if (en) enCol.appendChild(en.cloneNode(true));
              
              const zhCol = document.createElement('div');
              zhCol.style.cssText = 'flex: 1; text-align: left; font-size: 0.75em;';
              if (zh) zhCol.appendChild(zh.cloneNode(true));
              
              sideBySideDiv.appendChild(enCol);
              sideBySideDiv.appendChild(zhCol);
              slideSection.appendChild(sideBySideDiv);
              currentHSection.appendChild(slideSection);
            }
          }
        } else {
          // For English or Chinese only mode
          const langContent = node.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre, hr');
          langContent.forEach(child => {
            const isHeader = child.nodeName === 'H2' || child.nodeName === 'H3';
            const isHR = child.nodeName === 'HR';
            const isEmptyP = child.nodeName === 'P' && child.textContent.trim() === '';
            
            if (isHeader || isHR) {
              createSlideWithLayout();
              currentHSection = document.createElement('section');
              currentVSection = document.createElement('section');
              currentHSection.appendChild(currentVSection);
              slidesContainer.appendChild(currentHSection);
              
              if (isHeader) {
                currentTitleNode = child.cloneNode(true);
                currentVSection.appendChild(currentTitleNode.cloneNode(true));
              }
            } else if (!isEmptyP) {
              // Create a new vertical slide for every non-empty block element
              const vSlide = document.createElement('section');
              if (currentTitleNode) {
                const titleCopy = currentTitleNode.cloneNode(true);
                titleCopy.style.fontSize = '0.6em';
                titleCopy.style.opacity = '0.5';
                vSlide.appendChild(titleCopy);
              }
              vSlide.appendChild(child.cloneNode(true));
              currentHSection.appendChild(vSlide);
            }
          });
        }
    } else if (node.nodeName === 'P' && node.textContent.trim() === '') {
      // Empty paragraph - create new vertical slide
      if (currentVSection.childNodes.length > 0) {
        flushAndCreateNewSection();
      }
      } else if (isBlock && !isEmpty) {
      // Check if we have an image pending and this is substantial text
      if (pendingImage && node.textContent.trim().length > 50) {
        pendingText.push(node);
        createSlideWithLayout();
      } else {
        if (pendingImage) {
          pendingText.push(node);
        } else {
          // Add content to current vertical slide
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
    
    console.log('Slides created:', slidesContainer.children.length);
    console.log('Slides container innerHTML preview:', slidesContainer.innerHTML.substring(0, 500));

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
