'use strict';

var packageJson = require('./package.json');
var actions = require('./src/actions')();

function getVersion () {
  return `UserActions: ${packageJson.version}`;
}

actions.version = getVersion;
actions.getVersion = getVersion;

window.userActions = actions;
window.useractions = actions;
