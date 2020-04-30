const ENV = new URLSearchParams(location.search).get('env') === 'stage' ? 'demo' : 'prod';

let isLarge = window.innerWidth < 768;
const toggleLarge = () => {
  document.body.classList.toggle('spectrum--large', isLarge);
  document.body.classList.toggle('spectrum--medium', !isLarge);
};

toggleLarge();

window.addEventListener('resize', () => {
  isLarge = window.innerWidth < 768;
  
  toggleLarge();
});

let storage;
try {
  // In case disabled
  storage = window.sessionStorage;
} catch (e) {
  storage = {};
}

let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const toggleDarkMode = () => {
  document.body.classList.toggle('spectrum--dark', isDark);
  document.body.classList.toggle('spectrum--light', !isDark);
  main.classList.toggle('spectrum--darkest', isDark);
  main.classList.toggle('spectrum--lightest', !isDark);
};

darkSwitch.checked = isDark;
toggleDarkMode();

darkSwitch.addEventListener('change', () => {
  isDark = darkSwitch.checked;
  toggleDarkMode();
});

const renderCard = (item) => {
  const DEFAULT_THUMBNAIL = 'https://avatars0.githubusercontent.com/u/12461336?s=200&v=4';
  
  return `
        <a class="grid-item" href="${item.url || item.repo}" target="_blank">
          <div class="spectrum-Card spectrum-Card--quiet" role="rowheader" tabindex="0">
            <div class="spectrum-Card-preview">
              <div class="spectrum-Asset">
                <img class="spectrum-Asset-image" alt="" src="${item.thumbnail || DEFAULT_THUMBNAIL}">
              </div>
            </div>
            <div class="spectrum-Card-body">
              <div class="spectrum-Card-header">
                <div class="spectrum-Card-title"><strong>${item.title}</strong></div>
              </div>
              <div class="spectrum-Card-content">
                <div class="spectrum-Card-subtitle">${item.author ? `${item.author} -` : ''} ${item.published} ${item.duration ? `- ${item.duration} min` : ''}</div>
              </div>
              <p class="spectrum-Body spectrum-Body--S">${item.description}</p>
            </div>
          </div>
        </a>`;
};

// Navigation
const toggleSideNav = () => {
  sideNav.classList.toggle('is-open', !sideNav.classList.contains('is-open'));
  navToggleOverlay.classList.toggle('is-open', !navToggleOverlay.classList.contains('is-open'));
  navToggleAction.setAttribute('aria-expanded', sideNav.classList.contains('is-open'));
  navToggleAction.selected = sideNav.classList.contains('is-open');
};

const closeSideNav = () => {
  requestAnimationFrame(() => {
    if (sideNav.classList.contains('is-open')) {
      toggleSideNav();
      navToggleAction.focus();
    }
  });
};

navToggleAction.addEventListener('click', toggleSideNav);
navToggleOverlay.addEventListener('click', toggleSideNav);

// Init navigation
(async () => {
  if (!storage.index) {
    const INDEX_ACTION = `https://adobeioruntime.net/api/v1/web/aioe-${ENV}/aio-codelabs-0.0.1/index`;
    const find = await fetch(INDEX_ACTION);
    // Store the index locally for autocomplete
    storage.index = await find.text();
  }
  
  menu.addEventListener('click', async (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      
      if (!storage.index) {
        return;
      }
      
      let selectedMenu = menu.querySelector('.is-selected');
      selectedMenu && selectedMenu.classList.remove('is-selected');
      selectedMenu = event.target.parentElement;
      selectedMenu.classList.add('is-selected');
      
      const index = JSON.parse(storage.index);
      const type = selectedMenu.dataset.type;
      
      let selectedPanel = panels.querySelector('.is-selected');
      selectedPanel && selectedPanel.classList.remove('is-selected');
      
      selectedPanel = document.getElementById(`${type}Panel`);
      selectedPanel.classList.add('is-selected');
      
      closeSideNav();
      
      const grid = document.getElementById(`${type}Grid`);
      const spinner = document.getElementById(`${type}Spinner`);
      
      // Display pinned repos
      if (type && grid && grid.innerHTML === '') {
        const items = index.filter(item => item.type === type);
        
        grid.insertAdjacentHTML('beforeend', items.map(item => renderCard(item)).join(''));
        
        spinner.remove();
      }
    }
  });
  
  // Pinned repos
  menu.querySelector('.is-selected a').click();
})();

// Init Search
(() => {
  const SEARCH_ACTION = `https://adobeioruntime.net/api/v1/web/aioe-${ENV}/aio-codelabs-0.0.1/search`;
  
  searchInput.addEventListener('input', () => {
    if (!storage.index) {
      return;
    }
    
    const index = JSON.parse(storage.index);
    
    if (searchInput.value) {
      const max = window.innerWidth < 768 ? 3 : 10;
      const results = [];
      searchAutocompleteList.innerHTML = '';
      
      index.some((item) => {
        const query = searchInput.value.toLowerCase();
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
          results.push(item);
        }
      });
      
      if (results.length) {
        let html = '';
        results.some((item, i) => {
          if (i === max) {
            return true;
          }
          
          html += `
            <a href="${item.url || item.repo}" target="_blank" class="spectrum-Menu-item" role="option" tabindex="0">
              <span class="spectrum-Menu-itemLabel">${item.title}</span>
            </a>
          `;
        });
        
        searchAutocompleteList.insertAdjacentHTML('beforeend', html);
        searchAutocomplete.classList.add('is-open');
      }
      else {
        searchAutocomplete.classList.remove('is-open');
      }
    }
    else {
      searchAutocomplete.classList.remove('is-open');
    }
  });
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && searchAutocompleteList.childElementCount) {
      searchAutocompleteList.getElementsByTagName('a')[0].focus();
    }
  });
  
  // Trigger search on tab change
  searchPanel.addEventListener('click', (event) => {
    if (event.target.parentElement.hasAttribute('data-type')) {
      let selectedPanel = searchPanel.querySelector('.is-selected');
      selectedPanel && selectedPanel.classList.remove('is-selected');
      
      selectedPanel = event.target.parentElement;
      selectedPanel.classList.add('is-selected');
      
      searchTabsIndicator.style.transform = `translate(${selectedPanel.offsetLeft}px, 0px)`;
      searchTabsIndicator.style.width = `${selectedPanel.offsetWidth}px`;
      
      search.dispatchEvent(new Event('submit'));
    }
  });
  
  search.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!searchInput.value || !storage.index) {
      return;
    }
    
    // Close if opened
    searchAutocomplete.classList.remove('is-open');
    
    main.classList.add('is-loading');
    
    // Deselect
    const selectedMenu = menu.querySelector('.is-selected');
    selectedMenu && selectedMenu.classList.remove('is-selected');
    
    let selectedPanel = panels.querySelector('.is-selected');
    selectedPanel && selectedPanel.classList.remove('is-selected');
    
    // Show search panel
    searchPanel.classList.add('is-selected');
    
    closeSideNav();
    
    const index = JSON.parse(storage.index) || {};
    selectedPanel = searchPanel.querySelector('.is-selected');
    
    searchTabsIndicator.style.transform = `translate(${selectedPanel.offsetLeft}px, 0px)`;
    searchTabsIndicator.style.width = `${selectedPanel.offsetWidth}px`;
    searchTabsIndicator.hidden = false;
    
    const type = selectedPanel.dataset.type ? `&type=${selectedPanel.dataset.type}` : '';
    
    const find = await fetch(`${SEARCH_ACTION}?q=${searchInput.value}${type}`);
    const {res} = await find.json();
    
    if (res.count === 0) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 90" class="search-empty-illustration">
              <g>
                  <g>
                      <path d="M37.5,69A24.54,24.54,0,1,0,17,57.92l0,0L1.46,73.52A5,5,0,0,0,5,82.05H5a5,5,0,0,0,3.54-1.47L24.06,65l0,0A24.33,24.33,0,0,0,37.5,69Zm0-46A21.5,21.5,0,1,1,16,44.5,21.52,21.52,0,0,1,37.5,23ZM6.41,78.46A2,2,0,0,1,5,79.05H5a2,2,0,0,1-1.42-3.42L18.83,60.34a25.21,25.21,0,0,0,2.83,2.83Z"></path>
                      <path d="M28.67,53.33a1.51,1.51,0,0,0,1.06.44,1.49,1.49,0,0,0,1.06-.44l6.71-6.71,6.71,6.71a1.5,1.5,0,0,0,2.12,0,1.49,1.49,0,0,0,0-2.12L39.62,44.5l6.71-6.71a1.49,1.49,0,0,0,0-2.12,1.51,1.51,0,0,0-2.12,0L37.5,42.38l-6.71-6.71a1.5,1.5,0,0,0-2.12,2.12l6.71,6.71-6.71,6.71A1.51,1.51,0,0,0,28.67,53.33Z"></path>
                      <path d="M102.5,31a1.5,1.5,0,0,0-1.5,1.5V86.17a.83.83,0,0,1-.83.83H38.83a.83.83,0,0,1-.83-.83V73.5a1.5,1.5,0,0,0-3,0V86.17A3.84,3.84,0,0,0,38.83,90h61.34A3.84,3.84,0,0,0,104,86.17V32.5A1.5,1.5,0,0,0,102.5,31Z"></path>
                      <path d="M37.5,17A1.5,1.5,0,0,0,39,15.5V3.83A.83.83,0,0,1,39.83,3H75V26.5A1.5,1.5,0,0,0,76.5,28h25.55a1.5,1.5,0,0,0,1-2.57L77.55.43a1.43,1.43,0,0,0-.49-.32A1.41,1.41,0,0,0,76.52,0H39.83A3.84,3.84,0,0,0,36,3.83V15.5A1.5,1.5,0,0,0,37.5,17ZM78,5.07,98.37,25H78Z"></path>
                  </g>
              </g>
          </svg>
          <h3 class="spectrum-Heading spectrum-Heading--light spectrum-Heading--L">
            Sorry, we couldn't find any results for <strong>${searchInput.value}</strong>
          </h3>
          <p class="spectrum-Body spectrum-Body--S">Make sure all the words are spelled correctly or try to refine your keywords.</p>
        </div>
      `;
    }
    else {
      let details = '';
      let grid = '';
      
      for (const resItem of res.items) {
        const item = index.find(item => item.url === resItem.url || item.repo === resItem.url);
        
        if (item) {
          grid += renderCard(item);
        }
        
        details += `
          <div class="spectrum-Body spectrum-Body--M search-result">
            <div><a target="_blank" href="${resItem.url}" class="spectrum-Link spectrum-Link--quiet spectrum-Heading spectrum-Heading--M">${resItem.title}</a></div>
            ${resItem.description ? `<div class="spectrum-Body spectrum-Body--S search-result-description">${resItem.description}</div>` : ''}
            ${resItem.files.map(file => `<div><a target="_blank" class="spectrum-Link" href="${file.url}">${file.title}</a></div>`).join('')}
          </div>
        `;
      }
      
      searchResults.innerHTML = `
        <p class="spectrum-Body spectrum-Body--M search-result-count">
          ${res.count} search results for <strong>${searchInput.value}</strong> in ${selectedPanel.textContent.trim()}
        </p>
        <div role="grid" class="grid">${grid}</div>
        <div class="search-details">${details}
      `;
    }
    
    main.classList.remove('is-loading');
  });
})();