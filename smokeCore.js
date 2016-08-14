'use strict';

var packageJson = require('./package.json');
// eslint-disable-next-line no-unused-vars
var css = require('./cssBundleInstructions.css');

// here is nessessary cloned mocha project with installed npm dependencies
// can not out from here mocha path, cause browserify can't handle this =(
var mocha = require('../mocha/browser-entry').mocha;
var smokeAlertify = require('alertify.js');
var smokeChai = require('chai');

var smokeActions = require('./smokeActions');

let startedOnce = false;
function runAll () {
  if (!startedOnce) {
    startedOnce = true;
    addMochaDiv();
    mocha.run();
  } else {
    console.warn('Tests already started. That can\'t run twice!');
  }
}

function getVersion () {
  return `SmokeTest: ${packageJson.version}
  Mocha: ${mocha.version}
  JQuery: ${packageJson.devDependencies.jquery}
  Chai: ${packageJson.devDependencies.chai}
  Alertify: ${packageJson.devDependencies['alertify.js']}`;
}

let loadedMessage = `SmokeTest framework loaded (v ${version})`;
// eslint-disable-next-line no-console
console.log(loadedMessage);
smokeAlertify.logPosition('bottom right');
try {
  smokeAlertify.log(loadedMessage);
} catch (err) {
  // eslint-disable-next-line quotes
  if (err.message === `Cannot read property 'appendChild' of null`) {
    throw new Error('Possible you add smoketestBundle.js before app .js files.\n Please add it in end of html');
  }
}

mocha.setup('bdd');
let setup = function (regime) {
  if (regime != 'bdd' && regime != 'tdd' && regime != 'qunit') {
    // eslint-disable-next-line quotes
    throw new Error("available setup() argument is 'bdd' / 'tdd' / 'qunit'");
  }

  mocha.setup(regime);
};

function addMochaDiv () {
  let mochaDiv = document.createElement('div');
  mochaDiv.setAttribute('id', 'mocha');
  document.body.appendChild(mochaDiv);
}

// EXPORTS TO WINDOW
let exportsObject = {
  mocha: mocha,
  actions: smokeActions,
  chai: smokeChai,
  alertify: smokeAlertify,
  runAll: runAll,
  runall: runAll,
  version: getVersion,
  setup: setup
};

window.smokeTest = exportsObject;
window.smoketest = exportsObject;
