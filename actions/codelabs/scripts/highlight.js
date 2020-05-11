module.exports = () => {
  let script = document.createElement("script");
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js';
  script.async = true;
  script.addEventListener('load', () => {
    script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/yaml.min.js";
    script.async = true;
    document.head.appendChild(script);
    window.hljs.initHighlightingOnLoad();
  });
  
  document.head.appendChild(script);
};