import actions from './actions';
import {version} from '../package.json';

function getVersion() {
  return `UserActions: ${version}`;
}

actions.version = getVersion;
actions.getVersion = getVersion;

window.userActions = actions;
window.useractions = actions;
