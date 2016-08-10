// right now this code not in use, because mocha has right in bundle

if (!window.mocha) {
  throw new Error('You forget to import mocha js framework to main html file (mocha.js file)');
}

let mochaStylesFound = false;
for (let styleSheetNumber in document.styleSheets) {
  if (document.styleSheets[styleSheetNumber].href) {
    if (document.styleSheets[styleSheetNumber].href.endsWith('mocha.css')) {
      mochaStylesFound = true;
    }
  }
}
if (!mochaStylesFound) {
  throw new Error('You forget to import mocha js framework to main html file (mocha.css file)');
}