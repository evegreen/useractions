'use strict';

var smokeJquery = require('./node_modules/jquery/dist/jquery.min');

var getClassUtil = require('./getClassUtil');
var isFunction = getClassUtil.isFunction;
var isNumber = getClassUtil.isNumber;
var isBoolean = getClassUtil.isBoolean;
var isString = getClassUtil.isString;

var defaultTimeout = 2000;
var defaultRefreshTime = 300;

function setDefaultTimeout (timeout) {
  defaultTimeout = timeout;
}

function setDefaultRefreshTime (refreshTime) {
  defaultRefreshTime = refreshTime;
}

function checkFoundElement (element, selectorForError) {
  if (element != null) {
    return true;
  }

  throw new Error('Can\'t find element, selector = ' + selectorForError);
}

function findElement (selector, timeoutOrCb, cb) {
  if (!selector) {
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
    return findElementNormalized(selector, defaultTimeout, timeoutOrCb);
  }

  if (isNumber(timeoutOrCb)) {
    return findElementNormalized(selector, timeoutOrCb, cb);
  }
}

function checkUrlEndsWith(expectedUrlEnd, failCbOrNewUrl) {
  let actualUrl = window.location.href; // or can use document.URL
  if (actualUrl.endsWith(expectedUrlEnd)) {
    return true;
  }

  if (failCbOrNewUrl) {
    if (isFunction(failCbOrNewUrl)) {
      return failCbOrNewUrl();
    }

    if (isString(failCbOrNewUrl)) {
      return navigateToUrl(failCbOrNewUrl);
    }
  } else {
    throw new Error('actual Url ' + actualUrl + ' not ends with ' +
    expectedUrlEnd);
  }
}

function navigateToUrl (url) {
  window.location = url;
}

function findElementNormalized (selector, timeout, cb) {
  let foundElement;
  waitState(() => {
    foundElement = document.querySelector(selector);
    return checkFoundElement(foundElement);
  }, () => cb(null, foundElement), timeout);
}

function click (selector, cb = simpleThrowerCallback) {
  if (!selector) {
    throw new Error('selector argument is not defined');
  }

  findElement(selector, (err, element) => {
    if (err) {
      return cb(err);
    }

    smokeJquery(element).trigger('click');
    return cb(null);
  });
}

function focusOn (inputSelector, cb = simpleThrowerCallback) {
  if (!inputSelector) {
    throw new Error('inputSelector argument is not defined');
  }

  findElement(inputSelector, (err, element) => {
    if (err) {
      return cb(err);
    }

    smokeJquery(element).focus();
    return cb(null);
  });
}

function blur (selector, cb = simpleThrowerCallback) {
  if (!selector) {
    throw new Error('selector argument is not defined');
  }

  findElement(selector, (err, element) => {
    if (err) {
      return cb(err);
    }

    smokeJquery(element).blur();
    return cb(null);
  });
}

function inputText (selector, newValue, cb = simpleThrowerCallback) {
  if (!selector) {
    throw new Error('selector argument is not defined');
  }

  findElement(selector, (err, inputElement) => {
    if (err) {
      return cb(err);
    }

    inputElement.value = newValue;
    // need produce input event
    if (window.angular && window.angular.element) {
      // todo: why same triggerHandler from jquery doesn't work here? WTF
      angular.element(selector).triggerHandler('input');
    }

    return cb(null);
  });
}

function getText (selector, cb) {
  findElement(selector, (err, element) => {
    let result = element.innerText || element.textContent;
    return cb(null, result);
  });
}

function getValue (selector, cb) {
  findElement(selector, (err, element) => {
    let result = element.value;
    return cb(null, result);
  });
}

function selectInSelect (selectSelector, optionValueOrOptionNumber, cb = simpleThrowerCallback) {
  findElement(selectSelector, (err, selectElement) => {
    if (err) return cb(err);

    let selectOptions = [];
    for (let i = 0; i < selectElement.options.length; i++) {
      selectOptions.push(selectElement.options[i].value);
    }

    if (selectOptions.length < 1) {
      throw new Error(`select ${selectSelector} has no options`);
    }

    if (isString(optionValueOrOptionNumber)) {
      if (!selectOptions.includes(optionValueOrOptionNumber)) {
        throw new Error(`select ${selectSelector} not contains ${optionValueOrOptionNumber} option`);
      }

      selectElement.value = optionValueOrOptionNumber;
      // need produce input event
      if (window.angular && window.angular.element) {
        // todo: why same triggerHandler from jquery doesn't work here? WTF
        angular.element(selectSelector).triggerHandler('change');
      }

      return cb(null);
    }

    if (isNumber(optionValueOrOptionNumber)) {
      if (optionValueOrOptionNumber < 0) {
        throw new Error(`in ${selectSelector}: your option is less then 0`);
      }

      if (optionValueOrOptionNumber >= selectOptions.length) {
        throw new Error(`in ${selectSelector}: you selected ${optionValueOrOptionNumber}, but max number is ${selectOptions.length - 1}`);
      }

      selectElement.value = selectOptions[optionValueOrOptionNumber];
      // need produce input event
      if (window.angular && window.angular.element) {
        // todo: why same triggerHandler from jquery doesn't work here? WTF
        angular.element(selectSelector).triggerHandler('change');
      }

      return cb(null);
    }

    throw new Error('optionValueOrOptionNumber parameter is not string or number');
  });
}

function waitState (predicate, cb,
                    timeout = defaultTimeout,
                    refreshTime = defaultRefreshTime,
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

    setTimeout(waitState, refreshTime, predicate, cb,
        timeout, refreshTime, startTime);
  }
}

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

function simpleThrowerCallback (err) {
  if (err) throw err;
}

// PROMISED ACTIONS
// todo: mb unify promisify-wrapper for all callback-methods ?
function promisifyWrapper1arg (func, selector) {
  return new Promise((resolve, reject) => {
    func(selector, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function promisifyWrapper2arg (func, selector, secondArg) {
  return new Promise((resolve, reject) => {
    func(selector, secondArg, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function promisedClick (selector) {
  return promisifyWrapper1arg(click, selector);
}

function promisedBlur (selector) {
  return promisifyWrapper1arg(blur, selector);
}

function promisedFocusOn (selector) {
  return promisifyWrapper1arg(focusOn, selector);
}

function promisedSelectInSelect (selectSelector, optionValueOrOptionNumber) {
  return promisifyWrapper2arg(selectInSelect, selectSelector, optionValueOrOptionNumber);
}

function promisedGetText (selector) {
  return new Promise((resolve, reject) => {
    getText(selector, (err, text) => {
      if (err) {
        return reject(err);
      }

      return resolve(text);
    });
  });
}

function promisedGetValue (selector) {
  return new Promise((resolve, reject) => {
    getValue(selector, (err, value) => {
      if (err) {
        return reject(err);
      }

      return resolve(value);
    });
  });
}

function promisedInputText (selector, newValue) {
  return new Promise((resolve, reject) => {
    inputText(selector, newValue, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function promisedWaitState (predicate,
                            timeout = defaultTimeout,
                            refreshTime = defaultRefreshTime) {
  return new Promise((resolve, reject) => {
    waitState(predicate, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    }, timeout, refreshTime);
  });
}

function promisedFindElement (selector, optionalTimeout = defaultTimeout) {
  return new Promise((resolve, reject) => {
    findElement(selector, optionalTimeout, (err, element) => {
      if (err) {
        return reject(err);
      }

      return resolve(element);
    });
  });
}

let promisedActions = {};
promisedActions.click = promisedClick;
promisedActions.inputText = promisedInputText;
promisedActions.blur = promisedBlur;
promisedActions.focusOn = promisedFocusOn;
promisedActions.selectInSelect = promisedSelectInSelect;

promisedActions.getText = promisedGetText;
promisedActions.getValue = promisedGetValue;

promisedActions.waitState = promisedWaitState;
promisedActions.findElement = promisedFindElement;

// EXPORTS
exports.click = click;
exports.inputText = inputText;
exports.focusOn = focusOn;
exports.blur = blur;
exports.selectInSelect = selectInSelect;

exports.getText = getText;
exports.getValue = getValue;

exports.waitState = waitState;
exports.findElement = findElement;
exports.runPredicate = runPredicate;

exports.checkUrlEndsWith = checkUrlEndsWith;
exports.navigateToUrl = navigateToUrl;

exports.setDefaultRefreshTime = setDefaultRefreshTime;
exports.setDefaultTimeout = setDefaultTimeout;

exports.promised = promisedActions;

// EXPORTS ONLY FOR TESTS
let ___nonMockedJquery;
exports.___jquerySetter = function (fakeJquery) {
  ___nonMockedJquery = smokeJquery;
  smokeJquery = fakeJquery;
};
exports.___jqueryRestore = function () {
  smokeJquery = ___nonMockedJquery;
};
