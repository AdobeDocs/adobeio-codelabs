module.exports = () => {
  const URL = document.currentScript.src.split('?')[0];
  
  document.body.classList.add('spectrum');
  
  const isLarge = window.innerWidth < 768;
  document.body.classList.toggle('spectrum--large', isLarge);
  document.body.classList.toggle('spectrum--medium', !isLarge);
  
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.classList.add(isDark ? 'spectrum--dark' : 'spectrum--light');
  
  document.head.insertAdjacentHTML('beforeend', `
    <title>Adobe I/O CodeLabs</title>
  
    <link rel="icon" href="https://www.adobe.com/favicon.ico" type="image/x-icon"/>
    <link rel="shortcut icon" href="https://www.adobe.com/favicon.ico" type="image/x-icon"/>
  
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-global.css">
  
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-medium.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-large.css">
  
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-light.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-dark.css">
  
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/page@2.0.6/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/typography@2.1.2/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/icon@2.1.0/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/button@2.2.0/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/sidenav@2.0.5/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/circleloader@2.0.5/dist/index-vars.css">
  
    <link rel="stylesheet" href="${URL}?file=index.css">
  `);
  
  window.addEventListener('load', () => {
    document.body.insertAdjacentHTML('beforeend', `
    <div id="navToggleOverlay"></div>
    <div class="nav-toggle-header" role="banner">
      <a href="https://adobedocs.github.io/adobeio-codelabs">
        <svg class="adobe-icon" viewBox="0 0 30 26" focusable="false" aria-label="Adobe" role="img">
          <polygon points="19,0 30,0 30,26"></polygon>
          <polygon points="11.1,0 0,0 0,26"></polygon>
          <polygon points="15,9.6 22.1,26 17.5,26 15.4,20.8 10.2,20.8"></polygon>
        </svg>
        <h1 class="spectrum-Heading spectrum-Heading--S">Adobe I/O CodeLabs</h1>
      </a>
      <button class="spectrum-ActionButton" aria-label="Show Navigation Menu" id="navToggleAction">
        <svg class="spectrum-Icon spectrum-Icon--sizeS" focusable="false" aria-hidden="true" aria-label="Edit">
          <svg viewBox="0 0 10 7">
            <path d="M9.49 6H.51a.5.5 0 1 0 0 1h8.98a.5.5 0 0 0 0-1z"></path>
            <path
              d="M9.49 3H.51a.5.5 0 1 0 0 1h8.98a.5.5 0 0 0 0-1zM.51 1h8.98a.5.5 0 0 0 0-1H.51a.5.5 0 0 0 0 1z"></path>
          </svg>
        </svg>
      </button>
    </div>
  
    <div id="sideNav" role="navigation" aria-label="Navigation Menu">
      <a class="logo" href="https://adobedocs.github.io/adobeio-codelabs">
        <svg viewBox="0 0 30 26" focusable="false" aria-label="Adobe" role="img">
          <polygon points="19,0 30,0 30,26"></polygon>
          <polygon points="11.1,0 0,0 0,26"></polygon>
          <polygon points="15,9.6 22.1,26 17.5,26 15.4,20.8 10.2,20.8"></polygon>
        </svg>
  
        <h1 class="spectrum-Heading--S">Adobe I/O CodeLabs</h1>
      </a>
  
      <nav id="menu">
        <ul class="spectrum-SideNav">
          <li class="spectrum-SideNav-item">
            <a class="spectrum-SideNav-itemLink" href="?src=/README.html">Summary</a>
          </li>
        </ul>
      </nav>
    </div>
    <main id="main">
      <iframe id="viewer" hidden title="Viewer"></iframe>
      <div id="loading" class="spectrum-CircleLoader spectrum-CircleLoader--indeterminate spectrum-CircleLoader--large">
        <div class="spectrum-CircleLoader-track"></div>
        <div class="spectrum-CircleLoader-fills">
          <div class="spectrum-CircleLoader-fillMask1">
            <div class="spectrum-CircleLoader-fillSubMask1">
              <div class="spectrum-CircleLoader-fill"></div>
            </div>
          </div>
          <div class="spectrum-CircleLoader-fillMask2">
            <div class="spectrum-CircleLoader-fillSubMask2">
              <div class="spectrum-CircleLoader-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `);
  
    const createScript = (src, async) => {
      const script = document.createElement('script');
      script.async = async;
      script.src = src;
      document.head.appendChild(script);
    };
  
    createScript(`${URL}?file=typekit.js`);
    createScript(`${URL}?file=index.js`);
    createScript('https://unpkg.com/@adobe/focus-ring-polyfill@0.1.5/index.js', true);
  });
};
