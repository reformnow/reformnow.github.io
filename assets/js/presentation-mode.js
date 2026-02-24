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
    const h1 = document.querySelector('h1[data-toc-skip]');
    let postTitle = h1?.textContent || document.title.split(' | ')[0];
    
    let titleElement = null;
    
    // If bilingual titles exist, pick the right one or both
    if (h1 && (h1.querySelector('.lang-en') || h1.querySelector('.lang-zh'))) {
      const enTitle = h1.querySelector('.lang-en')?.innerText || h1.querySelector('.lang-en')?.textContent || '';
      const zhTitle = h1.querySelector('.lang-zh')?.innerText || h1.querySelector('.lang-zh')?.textContent || '';
      
      if (langPreference === 'english') {
        postTitle = enTitle || postTitle;
      } else if (langPreference === 'chinese') {
        postTitle = zhTitle || enTitle || postTitle;
      } else if (langPreference === 'both') {
        titleElement = document.createElement('div');
        titleElement.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        const enDiv = document.createElement('div');
        enDiv.style.fontSize = '0.8em';
        enDiv.textContent = enTitle;
        
        const zhDiv = document.createElement('div');
        zhDiv.style.cssText = 'font-size: 1em; color: #d4af37;';
        zhDiv.textContent = zhTitle;
        
        titleElement.appendChild(enDiv);
        titleElement.appendChild(zhDiv);
      }
    } else {
       // Single title, use innerText to be clean
       postTitle = h1?.innerText || postTitle;
    }

    // Get description from the post-desc element which now has bilingual spans
    const descEl = document.querySelector('.post-desc');
    let postDesc = document.querySelector('meta[name="description"]')?.content || '';
    
    let descElement = null;
    
    if (descEl && (descEl.querySelector('.lang-en') || descEl.querySelector('.lang-zh'))) {
      const enDesc = descEl.querySelector('.lang-en')?.innerText || descEl.querySelector('.lang-en')?.textContent || '';
      const zhDesc = descEl.querySelector('.lang-zh')?.innerText || descEl.querySelector('.lang-zh')?.textContent || '';
      
      if (langPreference === 'english') {
        postDesc = enDesc || postDesc;
      } else if (langPreference === 'chinese') {
        postDesc = zhDesc || enDesc || postDesc;
      } else if (langPreference === 'both') {
        descElement = document.createElement('div');
        descElement.style.cssText = 'display: flex; flex-direction: column; gap: 5px;';
        
        const enDiv = document.createElement('div');
        enDiv.style.cssText = 'font-size: 0.9em; opacity: 0.9;';
        enDiv.textContent = enDesc;
        
        const zhDiv = document.createElement('div');
        zhDiv.style.fontSize = '1em';
        zhDiv.textContent = zhDesc;
        
        descElement.appendChild(enDiv);
        descElement.appendChild(zhDiv);
      }
    }
    
    // Get the post's featured image
    const featuredImage = document.querySelector('.preview-img img')?.src || document.querySelector('img[src*="/posts/"]')?.src || document.querySelector('.content img')?.src || '';
    
    // Create cover slide
    const coverHSection = document.createElement('section');
    const coverVSection = document.createElement('section');
    coverVSection.className = 'cover-slide';
    const container = document.createElement('div');
    container.className = 'container py-4';
    
    const h1Title = document.createElement('h1');
    h1Title.className = 'reveal-title text-center mb-4';
    h1Title.style.cssText = 'font-size: 2.2em; color: #d4af37; text-shadow: 0 2px 10px rgba(0,0,0,0.5);';
    if (titleElement) {
      h1Title.appendChild(titleElement);
    } else {
      h1Title.textContent = postTitle;
    }
    container.appendChild(h1Title);
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'cover-image-container';
    imageContainer.style.cssText = 'position: relative; width: 100%; max-width: 1000px; margin: 0 auto;';
    
    if (featuredImage) {
      const img = document.createElement('img');
      img.src = featuredImage;
      img.className = 'reveal-cover-img';
      img.style.cssText = 'width: 100%; max-height: 500px; object-fit: cover; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); display: block;';
      imageContainer.appendChild(img);
    }
    
    if (descElement || postDesc) {
      const descOverlay = document.createElement('div');
      descOverlay.className = 'description-overlay';
      descOverlay.style.cssText = 'position: absolute; bottom: 0; left: 0; width: 100%; padding: 60px 30px 25px 30px; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; text-align: left;';
      
      const descTextAttr = document.createElement('div');
      descTextAttr.className = 'reveal-description';
      descTextAttr.style.cssText = 'color: #fff; margin: 0; line-height: 1.4; text-shadow: 1px 1px 5px rgba(0,0,0,0.8); max-width: 90%; font-weight: 300; letter-spacing: 0.5px;';
      
      if (descElement) {
        descTextAttr.appendChild(descElement);
      } else {
        descTextAttr.textContent = postDesc;
      }
      
      descOverlay.appendChild(descTextAttr);
      imageContainer.appendChild(descOverlay);
    }
    
    container.appendChild(imageContainer);
    coverVSection.appendChild(container);
    coverHSection.appendChild(coverVSection);
    slidesContainer.appendChild(coverHSection);

    // Parse content into slides
    let currentHSection = null;
    let currentVSection = null;

    // Track if we've created the first content section
    let hasCreatedFirstSection = false;
    
    let currentTitleNode = null;
    let pendingImage = null;
    let pendingText = [];
    
    function ensureHSection() {
      if (!currentHSection) {
        currentHSection = document.createElement('section');
        slidesContainer.appendChild(currentHSection);
      }
    }

    function createVSectionWithTitle() {
      const vSection = document.createElement('section');
      if (currentTitleNode) {
        const titleCopy = currentTitleNode.cloneNode(true);
        titleCopy.style.fontSize = '0.9em';
        titleCopy.style.opacity = '0.9';
        titleCopy.style.color = '#d4af37';
        vSection.appendChild(titleCopy);
      }
      return vSection;
    }
    
    function createSlideWithLayout() {
      if (!currentVSection) return;
      
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
      ensureHSection();
      createSlideWithLayout();
      currentVSection = createVSectionWithTitle();
      currentHSection.appendChild(currentVSection);
    }
    
    Array.from(originalContent.childNodes).forEach(node => {
      const isBlock = ['P', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'FIGURE', 'DIV', 'TABLE'].includes(node.nodeName);
      const isEmpty = node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
      const isImage = node.nodeName === 'IMG' || (node.nodeName === 'P' && node.querySelector('img')) || node.nodeName === 'FIGURE';
      const isTimeline = node.nodeName === 'DIV' && node.classList.contains('timeline-wrapper');
      
      if (isTimeline) {
        createSlideWithLayout();
        const eras = node.querySelectorAll('.timeline-era-section');
        eras.forEach(era => {
          // Each era is a new horizontal section
          currentHSection = document.createElement('section');
          slidesContainer.appendChild(currentHSection);
          
          // Era title slide
          const eraHeader = era.querySelector('.timeline-era-header');
          if (eraHeader) {
            const titleSlide = document.createElement('section');
            const hClone = eraHeader.cloneNode(true);
            if (langPreference === 'both') {
              hClone.style.cssText = 'display: flex; gap: 40px; align-items: center; justify-content: center;';
              hClone.querySelectorAll('.lang-en, .lang-zh').forEach(l => {
                l.style.flex = '1';
                l.style.textAlign = l.classList.contains('lang-en') ? 'right' : 'left';
                l.querySelector('.era-name').style.fontSize = '2.5em';
              });
            } else {
              const activeLang = hClone.querySelector(`.lang-${langPreference === 'english' ? 'en' : 'zh'}`);
              if (activeLang) {
                hClone.innerHTML = activeLang.innerHTML;
                hClone.querySelector('.era-name').style.fontSize = '3em';
              }
            }
            titleSlide.appendChild(hClone);
            currentHSection.appendChild(titleSlide);
          }
          
          // Events within this era
          const items = era.querySelectorAll('.timeline-item');
          items.forEach(item => {
            const content = item.querySelector('.timeline-content');
            if (!content) return;
            
            const eventSlide = document.createElement('section');
            const date = content.querySelector('.timeline-date')?.textContent;
            const img = content.querySelector('img');
            const cat = content.querySelector('.timeline-category')?.textContent;
            
            if (langPreference === 'both') {
              const flex = document.createElement('div');
              flex.style.cssText = 'display: flex; gap: 40px; align-items: center; justify-content: center; height: 100%;';
              
              const leftCol = document.createElement('div');
              leftCol.style.cssText = 'flex: 1; text-align: left;';
              const rightCol = document.createElement('div');
              rightCol.style.cssText = 'flex: 1; text-align: left;';
              
              if (img) {
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = 'margin-bottom: 20px; text-align: center;';
                const iClone = img.cloneNode(true);
                iClone.style.cssText = 'max-height: 40vh; width: auto; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);';
                imgContainer.appendChild(iClone);
                eventSlide.appendChild(imgContainer);
              }
              
              // Date and Category Label
              const meta = document.createElement('div');
              meta.style.cssText = 'font-size: 0.6em; opacity: 0.6; margin-bottom: 15px; text-align: center; letter-spacing: 2px;';
              meta.textContent = `${date}${cat ? ' • ' + cat : ''}`;
              eventSlide.appendChild(meta);
              
              const enTitle = content.querySelector('.timeline-title .lang-en')?.cloneNode(true);
              const enDesc = content.querySelector('.timeline-description .lang-en')?.cloneNode(true);
              const zhTitle = content.querySelector('.timeline-title .lang-zh')?.cloneNode(true);
              const zhDesc = content.querySelector('.timeline-description .lang-zh')?.cloneNode(true);
              
              if (enTitle) {
                enTitle.style.fontSize = '1.2em';
                enTitle.style.marginBottom = '15px';
                leftCol.appendChild(enTitle);
              }
              if (enDesc) {
                enDesc.style.fontSize = '0.75em';
                leftCol.appendChild(enDesc);
              }
              
              if (zhTitle) {
                zhTitle.style.fontSize = '1.2em';
                zhTitle.style.marginBottom = '15px';
                rightCol.appendChild(zhTitle);
              }
              if (zhDesc) {
                zhDesc.style.fontSize = '0.75em';
                rightCol.appendChild(zhDesc);
              }
              
              flex.appendChild(leftCol);
              flex.appendChild(rightCol);
              eventSlide.appendChild(flex);
            } else {
              // Single Language Layout
              if (img) {
                const iClone = img.cloneNode(true);
                iClone.style.cssText = 'max-height: 50vh; display: block; margin: 0 auto 20px; border-radius: 8px;';
                eventSlide.appendChild(iClone);
              }
              const meta = document.createElement('div');
              meta.style.cssText = 'font-size: 0.6em; opacity: 0.6; margin-bottom: 10px; text-align: center;';
              meta.textContent = `${date}${cat ? ' • ' + cat : ''}`;
              eventSlide.appendChild(meta);
              
              const lang = langPreference === 'english' ? 'en' : 'zh';
              const title = content.querySelector(`.timeline-title .lang-${lang}`)?.cloneNode(true);
              const desc = content.querySelector(`.timeline-description .lang-${lang}`)?.cloneNode(true);
              
              if (title) {
                title.style.fontSize = '1.5em';
                title.style.textAlign = 'center';
                eventSlide.appendChild(title);
              }
              if (desc) {
                desc.style.fontSize = '0.9em';
                desc.style.textAlign = 'center';
                desc.style.marginTop = '20px';
                eventSlide.appendChild(desc);
              }
            }
            
            currentHSection.appendChild(eventSlide);
          });
        });
        return; // Skip normal node processing
      }

    if (node.nodeName === 'H2' || node.nodeName === 'H3') {
      createSlideWithLayout();
      currentHSection = document.createElement('section');
      slidesContainer.appendChild(currentHSection);
      currentVSection = document.createElement('section');
      currentHSection.appendChild(currentVSection);
      hasCreatedFirstSection = true;

  currentTitleNode = node.cloneNode(true);
      currentVSection.appendChild(currentTitleNode.cloneNode(true));
    } else if (isImage) {
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
                slidesContainer.appendChild(currentHSection);
                currentVSection = null;
                
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
                  
                  // Create a bilingual title node for subsequent vertical slides
                  const bilingualHeader = document.createElement('div');
                  bilingualHeader.className = 'bilingual-section-header';
                  bilingualHeader.style.cssText = 'display: flex; gap: 20px; width: 100%; justify-content: center; opacity: 0.9; margin-bottom: 30px; border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: 10px;';
                  
                  const enT = en.cloneNode(true);
                  enT.style.fontSize = '0.9em';
                  enT.style.margin = '0';
                  enT.style.flex = '1';
                  enT.style.textAlign = 'right';
                  enT.style.color = '#fff';
                  
                  const zhT = (zh && (zh.nodeName === 'H2' || zh.nodeName === 'H3')) ? zh.cloneNode(true) : en.cloneNode(true);
                  zhT.style.fontSize = '0.9em';
                  zhT.style.margin = '0';
                  zhT.style.flex = '1';
                  zhT.style.textAlign = 'left';
                  zhT.style.color = '#d4af37';
                  
                  bilingualHeader.appendChild(enT);
                  bilingualHeader.appendChild(zhT);
                  currentTitleNode = bilingualHeader;
                }
                continue;
              }

              // For all other content (P, UL, OL, PRE, etc.), create a vertical slide
              ensureHSection();
              const slideSection = document.createElement('section');
              
              // Inject the bilingual title if it exists
              if (currentTitleNode) {
                slideSection.appendChild(currentTitleNode.cloneNode(true));
              }

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
              slidesContainer.appendChild(currentHSection);
              currentVSection = document.createElement('section');
              currentHSection.appendChild(currentVSection);
              
              if (isHeader) {
                currentTitleNode = child.cloneNode(true);
                currentVSection.appendChild(currentTitleNode.cloneNode(true));
              }
            } else if (!isEmptyP) {
              // Create a new vertical slide for every non-empty block element
              ensureHSection();
              const vSlide = document.createElement('section');
              if (currentTitleNode) {
                const titleCopy = currentTitleNode.cloneNode(true);
                titleCopy.style.fontSize = '1.1em';
                titleCopy.style.opacity = '0.9';
                titleCopy.style.color = '#d4af37';
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
          ensureHSection();
          if (!currentVSection) {
            currentVSection = createVSectionWithTitle();
            currentHSection.appendChild(currentVSection);
          }
          currentVSection.appendChild(node.cloneNode(true));
        }
      }
    } else if (!isEmpty) {
    if (pendingImage) {
      pendingText.push(node);
    } else {
      ensureHSection();
      if (!currentVSection) {
        currentVSection = createVSectionWithTitle();
        currentHSection.appendChild(currentVSection);
      }
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
