// Presentation Mode for Posts Tagged with 'slide'
(function() {
  'use strict';

  console.log('Presentation mode script loaded v8.7');

  // 0. IMMEDIATE DETECTION FOR SPEAKER VIEW OR REDIRECTS
  // Reveal.js Speaker View opens the page in an iframe within the notes window.
  // We must detect this early to apply the 'clean' presentation layout.
  if (window.location.search.includes('reveal-notes') || window.name.includes('reveal-notes') || window.location.search.includes('receiver')) {
    const noteStyle = document.createElement('style');
    noteStyle.innerHTML = `
      #main-wrapper, #sidebar, #search-results, footer, #toc-wrapper, 
      .post-meta, .post-tail-wrapper, .post-navigation, .masthead-wrapper, 
      #access-lastmod, .mode-switcher, #presentation-mode-btn { 
        display: none !important; 
      }
      body { background: #111 !important; color: #eee !important; overflow: auto !important; }
      .reveal-viewport { background: #111 !important; }
    `;
    document.head.appendChild(noteStyle);
    document.documentElement.classList.add('presentation-mode');
  }

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
  
  async function startPresentation() {
    const VERSION = '8.7';
    const docEl = document.documentElement;
    console.log('--- STARTING PRESENTATION v' + VERSION + ' ---');
    
    // 1. Immediate local fullscreen to capture gesture
    let fullscreenWorked = false;
    try {
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
        fullscreenWorked = true;
        console.log('Local fullscreen success');
      }
    } catch (e) {
      console.warn('Immediate fullscreen failed:', e);
    }

    // 2. Check for screens
    let externalScreen = null;
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await window.getScreenDetails();
        const screens = screenDetails.screens;
        externalScreen = screens.find(s => !s.isInternal);
        console.log('External screen found:', !!externalScreen);
      } catch (e) {
        console.warn('Screen details failed:', e);
      }
    }
    
    // Firefox/Safari Fallback: Detect if we're likely on a secondary screen
    let likelyOnSecondary = false;
    if (!externalScreen) {
        likelyOnSecondary = Math.abs(window.screenX) > 100 || Math.abs(window.screenY) > 100;
        console.log('Likely on secondary screen (fallback)?', likelyOnSecondary);
    }
    
    // 3. If external exists AND it's not where we currently are, try to move there
    if (externalScreen) {
        // Simple heuristic: if window's left is near external screen's left, we are already there
        const alreadyOnExternal = Math.abs(window.screenX - externalScreen.availLeft) < 100;
        if (!alreadyOnExternal) {
            try {
                console.log('Projecting to external screen...');
                await docEl.requestFullscreen({ screen: externalScreen });
            } catch (e) {
                console.warn('External project failed, staying local:', e);
            }
        }
    }

    const contentEl = document.querySelector('.content');
    console.log('Content element found:', !!contentEl);
    if (!contentEl) {
      console.warn('Presentation mode: .content element not found');
      alert('Unable to start presentation mode: content not found');
      return;
    }
    
    const originalContent = contentEl.cloneNode(true);
    
    // Check language preference
    const langPreference = localStorage.getItem('preferredLanguage') || 'chinese';
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
    
    // 3. FULLSCREEN PRE-EMPTIVE (Must happen early to preserve user gesture)
    const requestFullscreen = async (targetScreen) => {
      try {
        const options = targetScreen ? { screen: targetScreen } : {};
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen(options);
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
        return true;
      } catch (e) {
        console.warn("Fullscreen request failed", e);
        return false;
      }
    };

    // Determine target and GO!
    const target = externalScreen || null;
    await requestFullscreen(target);

    // After fullscreen is initiated, we can proceed with slower operations
    
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
    let currentTitleNode = null;

    // Helper to check for speaker notes
    function checkNote(text) {
      const t = text.trim();
      return t.startsWith('Note:') || t.startsWith('Note：') || 
             t.startsWith('(Note:') || t.startsWith('(Note：') ||
             t.startsWith('备注:') || t.startsWith('备注：') ||
             t.startsWith('（注：') || t.startsWith('(注：');
    }

    // Pre-process nodes into logical groups (Single or Bilingual Pair)
    const rawNodes = Array.from(originalContent.childNodes);
    const logicalGroups = [];
    
    for (let i = 0; i < rawNodes.length; i++) {
        const node = rawNodes[i];
        if (node.nodeType !== 1) continue; // Skip text nodes/comments
        
        let partner = null;
        if (langPreference === 'both' && (node.classList.contains('lang-en') || node.classList.contains('lang-zh'))) {
            // Find the partner if it exists
            const isEn = node.classList.contains('lang-en');
            const targetClass = isEn ? 'lang-zh' : 'lang-en';
            
            // Look ahead for the immediate next element partner
            let nextIdx = i + 1;
            while (nextIdx < rawNodes.length && rawNodes[nextIdx].nodeType !== 1) nextIdx++;
            
            if (nextIdx < rawNodes.length && rawNodes[nextIdx].nodeType === 1 && rawNodes[nextIdx].classList.contains(targetClass)) {
                partner = rawNodes[nextIdx];
                i = nextIdx; // Advance main loop to skip partner
            }
        }
        
        // Ensure En is always 'node' and Zh is always 'partner' if both exist
        if (partner && partner.classList.contains('lang-en')) {
            logicalGroups.push({ node: partner, partner: node });
        } else {
            logicalGroups.push({ node: node, partner: partner });
        }
    }

    // Process logical groups into slides
    logicalGroups.forEach(group => {
      const node = group.node;
      const zh = group.partner;
      
      const isBlock = ['P', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'FIGURE', 'DIV', 'TABLE', 'H2', 'H3'].includes(node.nodeName);
      if (!isBlock) return;

      // Special Case: Timeline
      if (node.classList.contains('timeline-wrapper')) {
        const eras = node.querySelectorAll('.timeline-era-section');
        eras.forEach(era => {
          currentHSection = document.createElement('section');
          slidesContainer.appendChild(currentHSection);
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
              if (activeLang) { hClone.innerHTML = activeLang.innerHTML; hClone.querySelector('.era-name').style.fontSize = '3em'; }
            }
            titleSlide.appendChild(hClone);
            currentHSection.appendChild(titleSlide);
          }
          era.querySelectorAll('.timeline-item').forEach(item => {
            const content = item.querySelector('.timeline-content');
            if (!content) return;
            const eventSlide = document.createElement('section');
            const date = content.querySelector('.timeline-date')?.textContent;
            const img = content.querySelector('img');
            const cat = content.querySelector('.timeline-category')?.textContent;
            if (langPreference === 'both') {
              const flex = document.createElement('div');
              flex.style.cssText = 'display: flex; gap: 40px; align-items: center; justify-content: center; height: 100%;';
              const leftCol = document.createElement('div'); leftCol.style.cssText = 'flex: 1; text-align: left;';
              const rightCol = document.createElement('div'); rightCol.style.cssText = 'flex: 1; text-align: left;';
              if (img) {
                const imgContainer = document.createElement('div'); imgContainer.style.cssText = 'margin-bottom: 20px; text-align: center;';
                const iClone = img.cloneNode(true); iClone.style.cssText = 'max-height: 40vh; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);';
                imgContainer.appendChild(iClone); eventSlide.appendChild(imgContainer);
              }
              const meta = document.createElement('div'); meta.style.cssText = 'font-size: 0.6em; opacity: 0.6; margin-bottom: 15px; text-align: center; letter-spacing: 2px;';
              meta.textContent = `${date}${cat ? ' • ' + cat : ''}`; eventSlide.appendChild(meta);
              const enT = content.querySelector('.timeline-title .lang-en')?.cloneNode(true);
              const enD = content.querySelector('.timeline-description .lang-en')?.cloneNode(true);
              const zhT = content.querySelector('.timeline-title .lang-zh')?.cloneNode(true);
              const zhD = content.querySelector('.timeline-description .lang-zh')?.cloneNode(true);
              if (enT) { enT.style.fontSize = '1.2em'; enT.style.marginBottom = '15px'; leftCol.appendChild(enT); }
              if (enD) { enD.style.fontSize = '0.75em'; leftCol.appendChild(enD); }
              if (zhT) { zhT.style.fontSize = '1.2em'; zhT.style.marginBottom = '15px'; rightCol.appendChild(zhT); }
              if (zhD) { zhD.style.fontSize = '0.75em'; rightCol.appendChild(zhD); }
              flex.appendChild(leftCol); flex.appendChild(rightCol); eventSlide.appendChild(flex);
            } else {
              if (img) { const iClone = img.cloneNode(true); iClone.style.cssText = 'max-height: 50vh; display: block; margin: 0 auto 20px; border-radius: 8px;'; eventSlide.appendChild(iClone); }
              const meta = document.createElement('div'); meta.style.cssText = 'font-size: 0.6em; opacity: 0.6; margin-bottom: 10px; text-align: center;';
              meta.textContent = `${date}${cat ? ' • ' + cat : ''}`; eventSlide.appendChild(meta);
              const lang = langPreference === 'english' ? 'en' : 'zh';
              const title = content.querySelector(`.timeline-title .lang-${lang}`)?.cloneNode(true);
              const desc = content.querySelector(`.timeline-description .lang-${lang}`)?.cloneNode(true);
              if (title) { title.style.fontSize = '1.5em'; title.style.textAlign = 'center'; eventSlide.appendChild(title); }
              if (desc) { desc.style.fontSize = '0.9em'; desc.style.textAlign = 'center'; desc.style.marginTop = '20px'; eventSlide.appendChild(desc); }
            }
            currentHSection.appendChild(eventSlide);
          });
        });
        return;
      }

      // 1. Check for Headers (New Horizontal Section)
      const isHeader = node.nodeName === 'H2' || node.nodeName === 'H3';
      const isHR = node.nodeName === 'HR';

      if (isHeader || isHR) {
        currentHSection = document.createElement('section');
        slidesContainer.appendChild(currentHSection);
        
        if (isHeader) {
          const headerSlide = document.createElement('section');
          currentHSection.appendChild(headerSlide);
          
          if (zh) {
            const hFlex = document.createElement('div');
            hFlex.style.cssText = 'display: flex; gap: 40px; align-items: center; justify-content: center; height: 100%;';
            const enH = node.cloneNode(true); enH.style.flex = '1'; enH.style.textAlign = 'right';
            const zhH = zh.cloneNode(true); zhH.style.flex = '1'; zhH.style.textAlign = 'left'; zhH.style.color = '#d4af37';
            hFlex.appendChild(enH); hFlex.appendChild(zhH);
            headerSlide.appendChild(hFlex);
            
            const bHeader = document.createElement('div');
            bHeader.className = 'bilingual-section-header';
            bHeader.style.cssText = 'display: flex; gap: 20px; width: 100%; justify-content: center; opacity: 0.9; margin-bottom: 30px; border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: 10px;';
            const enT = node.cloneNode(true); enT.style.fontSize = '0.9em'; enT.style.margin = '0'; enT.style.flex = '1'; enT.style.textAlign = 'right'; enT.style.color = '#fff';
            const zhT = zh.cloneNode(true); zhT.style.fontSize = '0.9em'; zhT.style.margin = '0'; zhT.style.flex = '1'; zhT.style.textAlign = 'left'; zhT.style.color = '#d4af37';
            bHeader.appendChild(enT); bHeader.appendChild(zhT);
            currentTitleNode = bHeader;
          } else {
            const hClone = node.cloneNode(true);
            hClone.style.textAlign = 'center';
            headerSlide.appendChild(hClone);
            currentTitleNode = node.cloneNode(true);
            currentTitleNode.style.fontSize = '1.1em';
            currentTitleNode.style.color = '#d4af37';
          }
          currentVSection = headerSlide;
        } else {
          currentTitleNode = null;
        }
        return;
      }

      // 2. Main Content Slides (Vertical Slides)
      if (checkNote(node.textContent + (zh ? zh.textContent : ''))) {
        const last = currentHSection ? currentHSection.lastElementChild : null;
        if (last) {
          let notes = last.querySelector('aside.notes') || document.createElement('aside');
          notes.className = 'notes'; last.appendChild(notes);
          notes.appendChild(node.cloneNode(true));
          if (zh) notes.appendChild(zh.cloneNode(true));
        }
        return;
      }

      if (!currentHSection) {
        currentHSection = document.createElement('section');
        slidesContainer.appendChild(currentHSection);
      }

      const vSlide = document.createElement('section');
      if (currentTitleNode) vSlide.appendChild(currentTitleNode.cloneNode(true));
      
      if (zh) {
        const sbs = document.createElement('div');
        sbs.style.cssText = 'display: flex; gap: 40px; height: 100%; align-items: center; justify-content: center;';
        const enCol = document.createElement('div'); enCol.style.cssText = 'flex: 1; text-align: left; font-size: 0.75em;';
        const zhCol = document.createElement('div'); zhCol.style.cssText = 'flex: 1; text-align: left; font-size: 0.75em;';
        enCol.appendChild(node.cloneNode(true)); zhCol.appendChild(zh.cloneNode(true));
        sbs.appendChild(enCol); sbs.appendChild(zhCol);
        vSlide.appendChild(sbs);
      } else {
        vSlide.appendChild(node.cloneNode(true));
      }
      currentHSection.appendChild(vSlide);
      currentVSection = vSlide;
    });

    console.log('Slides created (v8.5):', slidesContainer.children.length);
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
      #toc-wrapper { display: none !important; }
      .post-meta { display: none !important; }
      .post-tail-wrapper { display: none !important; }
      .post-navigation { display: none !important; }
      .masthead-wrapper { display: none !important; }
      #access-lastmod { display: none !important; }
      .mode-switcher { display: none !important; }
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
      #presentation-controls {
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        display: flex; gap: 10px; opacity: 0.5; transition: opacity 0.3s;
      }
      #presentation-controls:hover { opacity: 1; }
      #exit-presentation, #speaker-view {
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);
    
    // Create Reveal structure
    const revealDiv = document.createElement('div');
    revealDiv.className = 'reveal';
    
    // Controls container
    const controls = document.createElement('div');
    controls.id = 'presentation-controls';
    
    const hasFA = (typeof document.querySelector('.fas') !== 'undefined' || 
                   document.querySelector('link[href*="fontawesome"]') || 
                   document.querySelector('link[href*="fa-"]'));
    
    const speakerBtn = document.createElement('button');
    speakerBtn.id = 'speaker-view';
    speakerBtn.className = 'btn btn-sm btn-info text-white';
    speakerBtn.innerHTML = (hasFA ? '<i class="fas fa-comment-alt me-1"></i> ' : '💬 ') + 'Speaker';
    speakerBtn.title = 'Open Speaker View (S)';
    
    const exitBtn = document.createElement('button');
    exitBtn.id = 'exit-presentation';
    exitBtn.className = 'btn btn-sm btn-outline-light';
    exitBtn.innerText = 'Exit';
    
    controls.appendChild(speakerBtn);
    controls.appendChild(exitBtn);
    
    revealDiv.appendChild(controls);
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
            }).then(() => {
               // SUCCESSFUL INITIALIZATION
               console.log('Reveal initialized');
               
               // Automatic Multi-screen Deployment
               if (externalScreen || likelyOnSecondary) {
                 console.log('Attempting auto-deployment (Speaker View)...');
                 
                 // Open Speaker View on internal screen (0,0)
                 const notesPlugin = Reveal.getPlugin('notes');
                 if (notesPlugin) {
                    const originalOpen = window.open;
                    window.open = (url, name, features) => {
                      let f = features || "";
                      f = f.replace(/left=[^,]*/, 'left=0').replace(/top=[^,]*/, 'top=0');
                      if (!f.includes('left=')) f += ',left=0,top=0';
                      const win = originalOpen.call(window, url, name, f);
                      window.open = originalOpen;
                      return win;
                    };
                    notesPlugin.open();
                 }
               }
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

    // Speaker View handler
    speakerBtn.addEventListener('click', function() {
      if (typeof Reveal !== 'undefined') {
        const notesPlugin = Reveal.getPlugin('notes');
        if (notesPlugin) {
          // Monkey-patch window.open to force position on primary monitor (0,0)
          // This helps avoid the window opening on top of the presentation on secondary screens
          const originalOpen = window.open;
          window.open = function(url, name, features) {
            // Add or overwrite left/top features
            let updatedFeatures = features || "";
            if (updatedFeatures.includes('left=')) {
              updatedFeatures = updatedFeatures.replace(/left=[^,]*/, 'left=0');
            } else {
              updatedFeatures += (updatedFeatures ? ',' : '') + 'left=0';
            }
            if (updatedFeatures.includes('top=')) {
              updatedFeatures = updatedFeatures.replace(/top=[^,]*/, 'top=0');
            } else {
              updatedFeatures += (updatedFeatures ? ',' : '') + 'top=0';
            }
            
            console.log('Opening speaker view with forced coordinates:', updatedFeatures);
            const win = originalOpen.call(window, url, name, updatedFeatures);
            
            // Restore original window.open immediately
            window.open = originalOpen;
            return win;
          };
          
          notesPlugin.open();
          
          // Fallback restoration in case open() didn't call window.open synchronously
          setTimeout(() => { window.open = originalOpen; }, 100);
        }
      }
    });

    // Keyboard listener for Speaker View auto-open if needed
    document.addEventListener('keydown', function(e) {
      if (e.key.toLowerCase() === 's' && document.body.classList.contains('reveal-viewport')) {
        // Reveal.js handles 'S' by default, but we can intercept or enhance if needed
        console.log('Speaker view requested via keyboard');
      }
    });
  }
})();
