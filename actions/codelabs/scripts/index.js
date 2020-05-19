module.exports = async () => {
  const ENV = new URLSearchParams(location.search).get('env') === 'stage' ? 'demo' : 'prod';
  const ENV_PARAM = ENV === 'demo' ? '&env=stage' : '';
  const ABOUT_ACTION = `https://adobeioruntime.net/api/v1/web/aioe-${ENV}/aio-codelabs-0.0.1/about`;
  
  let isLarge = window.innerWidth < 768;
  const toggleLarge = () => {
    document.body.classList.toggle('spectrum--large', isLarge);
    document.body.classList.toggle('spectrum--medium', !isLarge);
    if (viewer.contentDocument) {
      viewer.contentDocument.body.classList.toggle('spectrum--large', isLarge);
      viewer.contentDocument.body.classList.toggle('spectrum--medium', !isLarge);
    }
  };
  
  window.addEventListener('resize', () => {
    isLarge = window.innerWidth < 768;
    
    toggleLarge();
  });
  
  let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Navigation
  const toggleSideNav = () => {
    sideNav.classList.toggle('is-open', !sideNav.classList.contains('is-open'));
    navToggleOverlay.classList.toggle('is-open', !navToggleOverlay.classList.contains('is-open'));
    navToggleAction.setAttribute('aria-expanded', sideNav.classList.contains('is-open'));
    navToggleAction.classList.toggle('is-selected', sideNav.classList.contains('is-open'));
  };
  
  navToggleAction.addEventListener('click', toggleSideNav);
  navToggleOverlay.addEventListener('click', toggleSideNav);
  
  const getIndex = async () => {
    loadingText.textContent = 'Requesting index';
    
    let repository = localStorage.getItem('repository');
    let ck = new Date().getTime();
    
    if (repository) {
      const res = await fetch(`${ABOUT_ACTION}?repository=${repository}&page=manifest.json`);
      const {sha} = await res.json();
      ck = sha;
    }
    
    const manifest = await fetch(`/manifest.json?ck=${ck}`);
    const index = await manifest.json();
    localStorage.setItem('repository', index.repository);
  
    return index;
  };
  
  const getSrc = () => {
    return new URLSearchParams(location.search).get('src');
  };
  
  const render = () => {
    const selectedStep = menu.querySelector('.is-selected');
    if (!selectedStep.dataset.loaded) {
      loadingText.textContent = `Pulling ${selectedStep.textContent.trim()}`;
      selectedStep.dataset.loaded = true;
    }
    else {
      loadingText.textContent = '';
    }
    
    const url = selectedStep.querySelector('a').href.replace('?src=/', '');
    // When assigning the URL with viewer.src = url, it adds a new entry to the browser's list of visited URLs to go back to
    // Which messes up navigation
    
    viewer.contentWindow.location.replace(`${url}?ck=${selectedStep.dataset.ck}${ENV_PARAM}`);
    
    requestAnimationFrame(() => {
      if (sideNav.classList.contains('is-open')) {
        toggleSideNav();
        navToggleAction.focus();
      }
    });
  };
  
  const transformLab = (doc) => {
    const src = getSrc();
    const path = `${location.protocol}//${location.host}`;
    const header = doc.body.querySelector('header');
    const footer = doc.body.querySelector('footer');
    const main = doc.body.querySelector('main');
    
    const spectrumify = (selectors, className) => {
      selectors.split(',').forEach((name) => {
        for (const el of main.querySelectorAll(name)) {
          el.classList.add(...className.split(' '));
        }
      });
    };
  
    const readingTime = (text) => {
      const wordsPerMinute = 200;
      const noOfWords = text.split(/\s/g).length;
      const minutes = noOfWords / wordsPerMinute;
      return Math.ceil(minutes);
    };
    
    // Transform relative paths to absolute
    for (const anchor of main.querySelectorAll('a[href]')) {
      if (anchor.href.startsWith(path)) {
        anchor.classList.add('nav-anchor');
        anchor.setAttribute('href', `${path}?src=${anchor.href.replace(path, '')}`);
      }
      else {
        // Force target blank
        anchor.setAttribute('target', '_blank');
      }
    }
    
    spectrumify('h1', 'spectrum-Heading spectrum-Heading--XXL');
    spectrumify('h2', 'spectrum-Heading spectrum-Heading--XL');
    spectrumify('h3', 'spectrum-Heading spectrum-Heading--L');
    spectrumify('h4', 'spectrum-Heading spectrum-Heading--M');
    spectrumify('h5', 'spectrum-Heading spectrum-Heading--S');
    spectrumify('h6', 'spectrum-Heading spectrum-Heading--XS');
    spectrumify('code', `spectrum-Code spectrum-Code--S spectrum-Well`);
    spectrumify('p, ol, ul', `spectrum-Body spectrum-Body--M`);
    spectrumify('table', 'spectrum-Table');
    spectrumify('thead', 'spectrum-Table-head');
    spectrumify('tbody', 'spectrum-Table-body');
    spectrumify('tbody tr', 'spectrum-Table-row');
    spectrumify('th', 'spectrum-Table-headCell');
    spectrumify('td', 'spectrum-Table-cell');
    spectrumify('a', 'spectrum-Link');
    
    const titles = [];
    for (const title of doc.body.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      titles.push({
        label: title.textContent.trim(),
        url: `#${title.id}`
      });
    }
  
    const page = src.replace('.html', '.md');
    const selectedStep = menu.querySelector('.is-selected');
    
    main.insertAdjacentHTML('beforeend', `
      <div class="side-panel">
        <h3 class="spectrum-Detail spectrum-Detail--M">On this page</h3>
        <ul>
          ${titles.map(title => `<li><a class="spectrum-Link" href="${title.url}">${title.label}</a></li>`).join('')}
        </ul>
        <h3 class="spectrum-Detail spectrum-Detail--M">About this page</h3>
        <ul>
          <li>${selectedStep.dataset.duration || readingTime(main.textContent)} min read</li>
          <li>Last update: ${selectedStep.dataset.lastUpdate}</li>
          <li>Author: <a class="spectrum-Link" href="mailto:${selectedStep.dataset.authorEmail}">${selectedStep.dataset.authorName}</a></li>
        </ul>
        <h3 class="spectrum-Detail spectrum-Detail--M">Help</h3>
        <ul>
          <li><a href="mailto:iodev@adobe.com" class="spectrum-Link" target="_blank">Contact us</a></li>
          <li><a href="https://docs.adobe.com/content/help/en/contributor/contributor-guide/introduction.html" class="spectrum-Link" target="_blank">Learn more</a></li>
        </ul>
      </div>
    `);
    
    header.innerHTML = `
      <nav class="header-item">
        <ul class="spectrum-Breadcrumbs">
          <li class="spectrum-Breadcrumbs-item">
            <a class="spectrum-Breadcrumbs-itemLink" target="_parent" href="https://adobedocs.github.io/adobeio-codelabs">Firefly CodeLabs</a>
            <svg class="spectrum-Icon spectrum-UIIcon-ChevronRightSmall spectrum-Breadcrumbs-itemSeparator" focusable="false" aria-hidden="true">
              <path d="M5.5 4a.747.747 0 0 0-.22-.53C4.703 2.862 3.242 1.5 2.04.23A.75.75 0 1 0 .98 1.29L3.69 4 .98 6.71a.75.75 0 1 0 1.06 1.06l3.24-3.24A.747.747 0 0 0 5.5 4z"></path>
            </svg>
          </li>
          <li class="spectrum-Breadcrumbs-item">
            <a class="spectrum-Breadcrumbs-itemLink" target="_parent" href="${path}${menu.querySelector('a').getAttribute('href')}">${index.title}</a>
            <svg class="spectrum-Icon spectrum-UIIcon-ChevronRightSmall spectrum-Breadcrumbs-itemSeparator" focusable="false" aria-hidden="true">
              <path d="M5.5 4a.747.747 0 0 0-.22-.53C4.703 2.862 3.242 1.5 2.04.23A.75.75 0 1 0 .98 1.29L3.69 4 .98 6.71a.75.75 0 1 0 1.06 1.06l3.24-3.24A.747.747 0 0 0 5.5 4z"></path>
            </svg>
          </li>
          <li class="spectrum-Breadcrumbs-item">
            <a class="spectrum-Breadcrumbs-itemLink" target="_parent" href="${location}" aria-current="page">${selectedStep.textContent.trim()}</a>
          </li>
        </ul>
      </nav>
  
      <div class="header-item">
        <div class="spectrum-ToggleSwitch">
          <input type="checkbox" class="spectrum-ToggleSwitch-input" id="darkSwitch" ${isDark ? 'checked' : ''}>
          <span class="spectrum-ToggleSwitch-switch"></span>
          <label class="spectrum-ToggleSwitch-label" for="darkSwitch">Dark mode</label>
        </div>
        <a role="button" href="${index.repository}/issues/new?body=Issue%20in%20${page}" target="_blank" class="spectrum-Button spectrum-Button--primary">
          <span class="spectrum-Button-label">Log an issue</span>
        </a>
        <a role="button" href="${index.repository}/edit/master${page}" target="_blank" class="spectrum-Button spectrum-Button--cta">
          <span class="spectrum-Button-label">Edit this page</span>
        </a>
      </div>
    `;
    
    footer.innerHTML = `
      <hr class="footer-rule spectrum-Rule spectrum-Rule--medium" />
      <ul>
        <li>
          © Adobe. All rights reserved.
        </li>
        <li>
          <a class="spectrum-Link spectrum-Link--quiet" href="https://www.adobe.com/privacy.html">Privacy (Updated)</a>
        </li>
        <li>
          <a class="spectrum-Link spectrum-Link--quiet" href="https://www.adobe.com/legal/terms.html">Terms of use</a>
        </li>
        <li>
          <a class="spectrum-Link spectrum-Link--quiet" href="https://www.adobe.com/privacy/cookies.html">Cookies</a>
        </li>
      </ul>
    `;
    footer.classList.add('footer');
  
    doc.body.className = `spectrum spectrum-Typography ${isDark ? 'spectrum--darkest' : 'spectrum--lightest'} ${isLarge ? 'spectrum--large' : 'spectrum--medium'}`;
  };
  
  window.onpopstate = (event) => {
    const step = Array.from(menu.getElementsByTagName('a')).find(item => item.href === event.state.href);
    if (!step.parentElement.classList.contains('is-selected')) {
      step.click();
    }
  };
  
  menu.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      
      viewer.hidden = true;
      loading.hidden = false;
      loadingText.hidden = false;
      
      // Update selection
      const selected = menu.querySelector('.is-selected');
      selected && selected.classList.remove('is-selected');
      event.target.parentElement.classList.add('is-selected');
      
      // Update aria-current to reflect current page.
      const currentItem = menu.querySelector('[aria-current]');
      currentItem && currentItem.removeAttribute('aria-current');
      event.target.setAttribute('aria-current', 'page');
      
      // Update the main region to give it a unique label
      main.setAttribute('aria-label', event.target.textContent.trim());
      
      render();
    }
  });
  
  const index = await getIndex();
  
  // Update title
  document.title = index.title;
  
  // Create Navigation
  const src = getSrc();
  
  loadingText.textContent = 'Importing latest state';
  
  // todo Support multi-level navigation
  let steps = '';
  for (const step of index.navigation) {
    const isStepSelected = src === `${step.url}.html`;
    
    const page = `${step.url}.md`;
    const res = await fetch(`${ABOUT_ACTION}?repository=${index.repository}&page=${page}`);
    const {sha, author} = await res.json();
    
    steps += `
      <li data-url="${step.url}" data-author-email="${index.author && index.author.email || author.email}" data-author-name="${index.author && index.author.name || author.name}" data-ck="${sha}" data-last-update="${new Date(author.date).toLocaleDateString()}" data-duration="${step.duration || ''}" class="spectrum-SideNav-item ${isStepSelected ? 'is-selected' : ''}" ${isStepSelected ? 'aria-current="page"' : ''}>
        <a class="spectrum-SideNav-itemLink" href="?src=${step.url}.html">${step.title}</a>
      </li>
    `;
  }
  menu.firstElementChild.insertAdjacentHTML('beforeend', steps);
  
  const firstNav = index.navigation[0];
  // If no step selected then select first one by default
  if (src === null) {
    const newUrl = `${location.protocol}//${location.host}${location.pathname}?src=${firstNav.url}.html`;
    history.replaceState({href: newUrl}, '', newUrl);
  
    const selected = menu.querySelector('.is-selected');
    selected && selected.classList.remove('is-selected');
    
    const firstStep = menu.getElementsByTagName('li')[0];
    firstStep.classList.add('is-selected');
    firstStep.setAttribute('aria-current', 'page');
  }
  
  viewer.beforeunload = () => {
    loading.hidden = false;
    loadingText.hidden = false;
    viewer.hidden = true;
  };
  
  viewer.onload = () => {
    const src = viewer.contentWindow.location.href;
    
    const step = Array.from(menu.getElementsByTagName('a')).find(item => src.startsWith(item.href.replace('?src=/', '')));
    if (!step.parentElement.classList.contains('is-selected')) {
      step.parentElement.classList.add('is-selected');
    }
    
    if (location.href !== step.href) {
      history.pushState({href: step.href}, '', step.href);
    }
    
    viewer.contentWindow.addEventListener('click', (event) => {
      if (event.target.classList.contains('nav-anchor')) {
        event.preventDefault();
        
        const nextStep = Array.from(menu.getElementsByTagName('a')).find(item => item.href === event.target.href);
        if (nextStep) {
          nextStep.click();
        }
      }
    });
    
    viewer.contentWindow.addEventListener('change', (event) => {
      if (event.target.id === 'darkSwitch') {
        isDark = event.target.checked;
        
        document.body.classList.toggle('spectrum--dark', isDark);
        document.body.classList.toggle('spectrum--light', !isDark);
        
        if (viewer.contentDocument) {
          viewer.contentDocument.body.classList.toggle('spectrum--darkest', isDark);
          viewer.contentDocument.body.classList.toggle('spectrum--lightest', !isDark);
        }
      }
    });
    
    transformLab(viewer.contentDocument);
  
    loading.hidden = true;
    loadingText.hidden = true;
    viewer.hidden = false;
    
    if (viewer.preload) {
      viewer.preload = false;
      // Preload for browser caching
      for (const step of menu.getElementsByTagName('li')) {
        fetch(`${step.dataset.url}.html?ck=${step.dataset.ck}`);
      }
    }
  };
  
  viewer.preload = true;
  
  render();
};