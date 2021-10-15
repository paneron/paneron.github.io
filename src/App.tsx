import makeApp from '@riboseinc/paneron-website-common/scaffolding/makeApp'


export default makeApp({
  title: "Paneron",
  topLinks: [{
    text: "Paneron",
    target: "/",
    selected: true,
    isHeader: true,
  }, {
    text: "Extensions",
    target: "https://extensions.paneron.org/",
    external: true,
  }],
});
