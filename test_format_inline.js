const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

(async () => {
  const appJs = fs.readFileSync('./app.js', 'utf8');
  const dom = new JSDOM(`<!doctype html><html><body><header></header></body></html>`, { runScripts: 'outside-only' });
  const { window } = dom;
  // Provide a minimal localStorage
  window.localStorage = { getItem: () => 'true', setItem: () => {} };
  // Evaluate the app.js in the window context
  dom.runVMScript(new vm.Script(appJs));
  // Can't easily call formatInline (it's inside closure). We'll instead check that the highlight toggle was created
  const toggle = window.document.getElementById('highlight-toggle');
  console.log('Toggle present?', !!toggle);
})();
