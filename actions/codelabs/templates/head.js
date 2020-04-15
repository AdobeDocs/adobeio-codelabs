module.exports = () => {
  const URL = document.currentScript.src.split('?')[0];
  
  document.head.insertAdjacentHTML('beforeend', `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-global.css">
    
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-medium.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-large.css">
    
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-lightest.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/vars@2.2.0/dist/spectrum-darkest.css">
    
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/page@2.0.6/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/typography@2.1.2/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/icon@2.1.0/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/button@2.2.0/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/table@2.0.6/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/breadcrumb@2.0.5/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/toggle@2.1.0/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/link@2.0.6/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/well@2.0.5/dist/index-vars.css">
    <link rel="stylesheet" href="https://unpkg.com/@spectrum-css/rule@2.0.6/dist/index-vars.css">
    
    <link rel="stylesheet" href="${URL}?file=head.css">
  `);
  
  const createScript = (src, async) => {
    const script = document.createElement('script');
    script.async = async;
    script.src = src;
    document.head.appendChild(script);
  };
  
  createScript(`${URL}?file=typekit.js`);
  createScript(`${URL}?file=highlight.js`);
  createScript('https://unpkg.com/@adobe/focus-ring-polyfill@0.1.5/index.js', true);
};