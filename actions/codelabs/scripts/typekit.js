module.exports = () => {
  const config = {kitId: 'mge7bvf', scriptTimeout: 3000};
  const script = document.createElement('script');
  script.src = `https://use.typekit.net/${config.kitId}.js`;
  script.async = true;
  script.addEventListener('load', () => {
    window.Typekit.load(config);
  });
  document.head.appendChild(script);
};