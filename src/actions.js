import {runPredicate, waitState, findElement} from './findModule';
import wrapInPromise from './promiseWrapper';
import _root from './globalRoot';
import {
  directClick,
  click,
  event,
  changeValue,
  focusOn,
  blur,
  pickInSelect
} from './interactModule';

_root.__defaultTimeout = 2000;
_root.__defaultRefreshTime = 300;

function setDefaultTimeout(timeout) {
  _root.__defaultTimeout = timeout;
}

function setDefaultRefreshTime(refreshTime) {
  _root.__defaultRefreshTime = refreshTime;
}

function getText(selectorOrElement, cb) {
  findElement(selectorOrElement, (err, element) => {
    let result = element.innerText || element.textContent;
    return cb(null, result);
  });
}

function getValue(selectorOrElement, cb) {
  findElement(selectorOrElement, (err, element) => {
    let result = element.value;
    return cb(null, result);
  });
}

let actionsModule = {};

actionsModule.promised = {};

actionsModule.directClick = directClick;
actionsModule.promised.directClick = wrapInPromise(directClick);

actionsModule.click = click;
actionsModule.promised.click = wrapInPromise(click);

actionsModule.event = event;
actionsModule.promised.event = wrapInPromise(event);

actionsModule.changeValue = changeValue;
actionsModule.promised.changeValue = wrapInPromise(changeValue);

actionsModule.focusOn = focusOn;
actionsModule.promised.focusOn = wrapInPromise(focusOn);

actionsModule.blur = blur;
actionsModule.promised.blur = wrapInPromise(blur);

actionsModule.pickInSelect = pickInSelect;
actionsModule.promised.pickInSelect = wrapInPromise(pickInSelect);

actionsModule.getText = getText;
actionsModule.promised.getText = wrapInPromise(getText);

actionsModule.getValue = getValue;
actionsModule.promised.getValue = wrapInPromise(getValue);

actionsModule.findElement = findElement;
actionsModule.promised.findElement = wrapInPromise(findElement);

actionsModule.waitState = waitState;
actionsModule.promised.waitState = function(
  predicate,
  timeout = _root.__defaultTimeout,
  refreshTime = _root.__defaultRefreshTime
) {
  return new Promise((resolve, reject) => {
    waitState(
      predicate,
      err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
      timeout,
      refreshTime
    );
  });
};

actionsModule.runPredicate = runPredicate;
actionsModule.setDefaultRefreshTime = setDefaultRefreshTime;
actionsModule.setDefaultTimeout = setDefaultTimeout;

export default actionsModule;
