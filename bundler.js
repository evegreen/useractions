'use strict';

var packageJson = require('./package.json');
var inlineJquery = require('./node_modules/jquery/dist/jquery.min');
var actions = require('./src/actions');

function getVersion () {
  return `UserActions: ${packageJson.version}
  jQuery: ${packageJson.devDependencies.jquery}`;
}

// ADD JQUERY TO ACTIONS FOR SPECIAL CASES
actions.jQuery = inlineJquery;
actions.jquery = inlineJquery;
actions.$ = inlineJquery;

actions.version = getVersion;

window.userActions = actions;
window.useractions = actions;
