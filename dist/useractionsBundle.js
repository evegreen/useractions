(function () {
'use strict';

let _root;
try {
  _root = window;
} catch (err) {
  _root = global;
}

var _root$1 = _root;

let getClass = obj => ({}).toString.call(obj).slice(8, -1);

let getClassModule = {};

getClassModule.getClass = getClass;
getClassModule.isFunction = obj => getClass(obj) === 'Function';
getClassModule.isArray = obj => getClass(obj) === 'Array';
getClassModule.isNumber = obj => getClass(obj) === 'Number';
getClassModule.isString = obj => getClass(obj) === 'String';
getClassModule.isObject = obj => getClass(obj) === 'Object';
getClassModule.isBoolean = obj => getClass(obj) === 'Boolean';
getClassModule.isNull = obj => getClass(obj) === 'Null';
getClassModule.isUndefined = obj => getClass(obj) === 'Undefined';

let isFunction = getClassModule.isFunction;
let isNumber = getClassModule.isNumber;
let isBoolean = getClassModule.isBoolean;

function runPredicate (predicate) {
  if (isFunction(predicate)) {
    try {
      let result = predicate();
      if (!isBoolean(result)) {
        return false;
      }
      return result;
    } catch (err) {
      return false;
    }
  }

  throw new Error('Argument is not predicate function!');
}

function waitState (predicate, cb,
                    timeout = _root$1.__defaultTimeout,
                    refreshTime = _root$1.__defaultRefreshTime,
                    startTime = Date.now()) {
  if (!isFunction(predicate)) {
    throw new Error('First argument of waitState is not predicate!');
  }

  if (!isFunction(cb)) {
    throw new Error('Second argument of waitState is not function!');
  }

  if (timeout < refreshTime) {
    console.warn('Warning: Timeout argument less then refreshTime argument!');
  }

  if (runPredicate(predicate)) {
    return cb(null);
  } else {
    if (Date.now() - startTime > timeout) {
      return cb(new Error('Timeout in waitState occurred!'));
    }

    setTimeout(waitState, refreshTime, predicate, cb, timeout, refreshTime, startTime);
  }
}

function checkFoundElement (element, selectorForError) {
  if (element != null) {
    return true;
  }

  throw new Error('Can\'t find element, selector = ' + selectorForError);
}

function findElement (selectorOrElement, timeoutOrCb, cb) {
  if (!selectorOrElement) {
    throw new Error('first argument of findElement() undefined, it must be css selector!');
  }

  let secondArgumentErrorMessage = 'second argument of findElement() must be timeout number or a callback function!';
  if (!timeoutOrCb) {
    throw new Error(secondArgumentErrorMessage);
  }

  if (!isFunction(timeoutOrCb) && !isNumber(timeoutOrCb)) {
    throw new Error(secondArgumentErrorMessage);
  }

  if (isFunction(timeoutOrCb)) {
    return findElementNormalized(selectorOrElement, _root$1.__defaultTimeout, timeoutOrCb);
  }

  if (isNumber(timeoutOrCb)) {
    return findElementNormalized(selectorOrElement, timeoutOrCb, cb);
  }
}

function findElementNormalized (selectorOrElement, timeout, cb) {
  if (selectorOrElement.nodeType) {
    return cb(null, selectorOrElement);
  }

  let foundElement;
  waitState(() => {
    foundElement = document.querySelector(selectorOrElement);
    return checkFoundElement(foundElement);
  }, () => cb(null, foundElement), timeout);
}


let findModule = {};

findModule.runPredicate = runPredicate;
findModule.waitState = waitState;
findModule.findElement = findElement;

let isNumber$1 = getClassModule.isNumber;
let isString = getClassModule.isString;
let findElement$1 = findModule.findElement;

function directClick(selectorOrElement, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement$1(selectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    element.click();
    return cb(null);
  });
}

/**
 * @param {string|Element} target - target element or its selector
*/
function click(target, cb = simpleThrowerCallback) {
  if (!target) {
    throw new Error('selector argument is not defined');
  }

  findElement$1(target, (err, elem) => {
    if (err) {
      return cb(err);
    }

    let clickEvent = new Event('click', { bubbles: true, cancelable: true });
    elem.dispatchEvent(clickEvent);
    return cb(null);
  });
}

/**
 * @param {string} options.type - event name e.g. "click"
 * @param {string|Element} options.target - target element or its selector
*/
function event(
  { type, target, bubbles = true, cancelable = true },
  cb = simpleThrowerCallback
) {
  if (!type) {
    throw new Error('event name argument is not defined');
  }

  if (!target) {
    throw new Error('target selector argument is not defined');
  }

  findElement$1(target, (err, elem) => {
    if (err) {
      return cb(err);
    }

    let eventOptions = {
      bubbles,
      cancelable
    };
    let event = new Event(type, eventOptions);
    elem.dispatchEvent(event);
    return cb(null);
  });
}

/**
 * @param {string|Element} targetInput - target input element or its selector
*/
function focusOn(targetInput, cb = simpleThrowerCallback) {
  if (!targetInput) {
    throw new Error('inputSelector argument is not defined');
  }

  findElement$1(targetInput, (err, elem) => {
    if (err) {
      return cb(err);
    }

    elem.focus();
    return cb(null);
  });
}

/**
 * @param {string|Element} target - target element or its selector
 */
function blur(target, cb = simpleThrowerCallback) {
  if (!target) {
    throw new Error('selector argument is not defined');
  }

  findElement$1(target, (err, elem) => {
    if (err) {
      return cb(err);
    }

    elem.blur();
    return cb(null);
  });
}

function changeValue(selectorOrElement, newValue, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement$1(selectorOrElement, (err, inputElement) => {
    if (err) {
      return cb(err);
    }

    inputElement.value = newValue;
    return cb(null);
  });
}

// option - number or value or innerHTML
function pickInSelect(selectSelectorOrElement, option, cb = simpleThrowerCallback) {
  findElement$1(selectSelectorOrElement, (err, selectElement) => {
    if (err) return cb(err);

    let valueOptions = [];
    let innerHtmlOptions = [];
    for (let i = 0; i < selectElement.options.length; i++) {
      valueOptions.push(selectElement.options[i].value);
      innerHtmlOptions.push(selectElement.options[i].innerHTML);
    }

    if (valueOptions.length < 1) {
      // i leave ${string} cast even if selectSelectorOrElement will be
      // an element by design or by laziness.
      // QA-developer anyway will see problem in stacktrace
      throw new Error(`select ${selectSelectorOrElement} has no options`);
    }

    if (isString(option)) {
      if (valueOptions.includes(option)) {
        selectElement.value = option;
        return cb(null);
      }

      for (let i = 0; i < innerHtmlOptions.length; i++) {
        if (innerHtmlOptions[i] === option) {
          selectElement.value = valueOptions[i];
          return cb(null);
        }
      }

      return cb(new Error(`select ${selectSelectorOrElement} not contains ${option} option`));
    }

    if (isNumber$1(option)) {
      if (option < 0) {
        return cb(new Error(`in ${selectSelectorOrElement}: your option is less then 0`));
      }

      if (option >= valueOptions.length) {
        return cb(new Error(`in ${selectSelectorOrElement}: you selected ${option}, but max number is ${valueOptions.length - 1}`));
      }

      selectElement.value = valueOptions[option];
      return cb(null);
    }

    return cb(new Error('option parameter is not string or number'));
  });
}

function simpleThrowerCallback(err) {
  if (err) throw err;
}


let interactModule = {};
interactModule.directClick = directClick;
interactModule.click = click;
interactModule.event = event;
interactModule.focusOn = focusOn;
interactModule.blur = blur;
interactModule.changeValue = changeValue;
interactModule.pickInSelect = pickInSelect;

// this wrapper cannot handle function with many results,
// cause promise can pass only one of them to resolve function
function wrap(func) {
  return function(...funcArgs) {
    return new Promise((resolve, reject) => {
      func(...funcArgs, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  };
}

let runPredicate$1 = findModule.runPredicate;
let waitState$1 = findModule.waitState;
let findElement$2 = findModule.findElement;
let directClick$1 = interactModule.directClick;
let click$1 = interactModule.click;
let event$1 = interactModule.event;
let changeValue$1 = interactModule.changeValue;
let focusOn$1 = interactModule.focusOn;
let blur$1 = interactModule.blur;
let pickInSelect$1 = interactModule.pickInSelect;


_root$1.__defaultTimeout = 2000;
_root$1.__defaultRefreshTime = 300;

function setDefaultTimeout(timeout) {
  _root$1.__defaultTimeout = timeout;
}

function setDefaultRefreshTime(refreshTime) {
  _root$1.__defaultRefreshTime = refreshTime;
}

function getText(selectorOrElement, cb) {
  findElement$2(selectorOrElement, (err, element) => {
    let result = element.innerText || element.textContent;
    return cb(null, result);
  });
}

function getValue(selectorOrElement, cb) {
  findElement$2(selectorOrElement, (err, element) => {
    let result = element.value;
    return cb(null, result);
  });
}


let actionsModule = {};

actionsModule.promised = {};

actionsModule.directClick = directClick$1;
actionsModule.promised.directClick = wrap(directClick$1);

actionsModule.click = click$1;
actionsModule.promised.click = wrap(click$1);

actionsModule.event = event$1;
actionsModule.promised.event = wrap(event$1);

actionsModule.changeValue = changeValue$1;
actionsModule.promised.changeValue = wrap(changeValue$1);

actionsModule.focusOn = focusOn$1;
actionsModule.promised.focusOn = wrap(focusOn$1);

actionsModule.blur = blur$1;
actionsModule.promised.blur = wrap(blur$1);

actionsModule.pickInSelect = pickInSelect$1;
actionsModule.promised.pickInSelect = wrap(pickInSelect$1);

actionsModule.getText = getText;
actionsModule.promised.getText = wrap(getText);

actionsModule.getValue = getValue;
actionsModule.promised.getValue = wrap(getValue);

actionsModule.findElement = findElement$2;
actionsModule.promised.findElement = wrap(findElement$2);

actionsModule.waitState = waitState$1;
actionsModule.promised.waitState = function (predicate, timeout = _root$1.__defaultTimeout, refreshTime = _root$1.__defaultRefreshTime) {
  return new Promise((resolve, reject) => {
    waitState$1(predicate, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    }, timeout, refreshTime);
  });
};

actionsModule.runPredicate = runPredicate$1;
actionsModule.setDefaultRefreshTime = setDefaultRefreshTime;
actionsModule.setDefaultTimeout = setDefaultTimeout;

var version = "0.7.0-dev.1";

function getVersion () {
  return `UserActions: ${version}`;
}

actionsModule.version = getVersion;
actionsModule.getVersion = getVersion;

window.userActions = actionsModule;
window.useractions = actionsModule;

}());
