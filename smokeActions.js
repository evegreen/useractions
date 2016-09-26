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
    return findElementNormalized(selectorOrElement, defaultTimeout, timeoutOrCb);
  }

  if (isNumber(timeoutOrCb)) {
    return findElementNormalized(selectorOrElement, timeoutOrCb, cb);
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

function findElementNormalized (selectorOrElement, timeout, cb) {
  if (selectorOrElement instanceof HTMLElement) {
    return cb(null, selectorOrElement);
  }

  let foundElement;
  waitState(() => {
    foundElement = document.querySelector(selectorOrElement);
    return checkFoundElement(foundElement);
  }, () => cb(null, foundElement), timeout);
}

function click (selectorOrElement, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement(selectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    if (element.href) {
      element.click();
    } else if (window.angular && window.angular.element) {
      if (element.type === 'checkbox') {
        element.click();
      } else {
        produceEventForAngular(element, 'click');
      }
    } else {
      smokeJquery(element).trigger('click');
    }
    return cb(null);
  });
}

function focusOn (inputSelectorOrElement, cb = simpleThrowerCallback) {
  if (!inputSelectorOrElement) {
    throw new Error('inputSelector argument is not defined');
  }

  findElement(inputSelectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    smokeJquery(element).focus();
    produceEventForAngular(element, 'focus');
    return cb(null);
  });
}

function blur (selectorOrElement, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement(selectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    // todo: need test on angular input, when input has some effect on blur event
    smokeJquery(element).blur();
    produceEventForAngular(element, 'blur');
    return cb(null);
  });
}

function inputText (selectorOrElement, newValue, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement(selectorOrElement, (err, inputElement) => {
    if (err) {
      return cb(err);
    }

    inputElement.value = newValue;
    produceEventForAngular(inputElement, 'input');
    return cb(null);
  });
}

function produceEventForAngular (element, eventName) {
  if (window.angular && window.angular.element) {
    // todo: why same triggerHandler from jquery doesn't work here? WTF
    // need pass only element, not selector (for compatibility with jquery light)
    angular.element(element).triggerHandler(eventName);
  }
}

function getText (selectorOrElement, cb) {
  findElement(selectorOrElement, (err, element) => {
    let result = element.innerText || element.textContent;
    return cb(null, result);
  });
}

function getValue (selectorOrElement, cb) {
  findElement(selectorOrElement, (err, element) => {
    let result = element.value;
    return cb(null, result);
  });
}

// option - number or value or innerHTML
function pickInSelect (selectSelectorOrElement, option, cb = simpleThrowerCallback) {
  findElement(selectSelectorOrElement, (err, selectElement) => {
    if (err) return cb(err);

    let valueOptions = [];
    let innerHtmlOptions = [];
    for (let i = 0; i < selectElement.options.length; i++) {
      valueOptions.push(selectElement.options[i].value);
      innerHtmlOptions.push(selectElement.options[i].innerHTML);
    }

    if (valueOptions.length < 1) {
      // i leave ${string} cast even if selectSelectorOrElement will be
      // an element by desygn or by laziness.
      // QA anyway will see problem in stacktrace
      throw new Error(`select ${selectSelectorOrElement} has no options`);
    }

    if (isString(option)) {

      if (valueOptions.includes(option)) {
        selectElement.value = option;
        produceEventForAngular(selectElement, 'change');
        return cb(null);
      }

      for (let i = 0; i < innerHtmlOptions.length; i++) {
        if (innerHtmlOptions[i] === option) {
          selectElement.value = valueOptions[i];
          produceEventForAngular(selectElement, 'change');
          return cb(null);
        }
      }

      return cb(new Error(`select ${selectSelectorOrElement} not contains ${option} option`));
    }

    if (isNumber(option)) {
      if (option < 0) {
        return cb(new Error(`in ${selectSelectorOrElement}: your option is less then 0`));
      }

      if (option >= valueOptions.length) {
        return cb(new Error(`in ${selectSelectorOrElement}: you selected ${option}, but max number is ${valueOptions.length - 1}`));
      }

      selectElement.value = valueOptions[option];
      produceEventForAngular(selectElement, 'change');
      return cb(null);
    }

    return cb(new Error('option parameter is not string or number'));
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

function promisedClick (selectorOrElement) {
  return promisifyWrapper1arg(click, selectorOrElement);
}

function promisedBlur (selectorOrElement) {
  return promisifyWrapper1arg(blur, selectorOrElement);
}

function promisedFocusOn (selectorOrElement) {
  return promisifyWrapper1arg(focusOn, selectorOrElement);
}

function promisedPickInSelect (selectSelectorOrElement, option) {
  return promisifyWrapper2arg(pickInSelect, selectSelectorOrElement, option);
}

function promisedGetText (selectorOrElement) {
  return new Promise((resolve, reject) => {
    getText(selectorOrElement, (err, text) => {
      if (err) {
        return reject(err);
      }

      return resolve(text);
    });
  });
}

function promisedGetValue (selectorOrElement) {
  return new Promise((resolve, reject) => {
    getValue(selectorOrElement, (err, value) => {
      if (err) {
        return reject(err);
      }

      return resolve(value);
    });
  });
}

function promisedInputText (selectorOrElement, newValue) {
  return new Promise((resolve, reject) => {
    inputText(selectorOrElement, newValue, err => {
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

function promisedFindElement (selectorOrElement, optionalTimeout = defaultTimeout) {
  return new Promise((resolve, reject) => {
    findElement(selectorOrElement, optionalTimeout, (err, element) => {
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
promisedActions.pickInSelect = promisedPickInSelect;

promisedActions.getText = promisedGetText;
promisedActions.getValue = promisedGetValue;

promisedActions.waitState = promisedWaitState;
promisedActions.findElement = promisedFindElement;

// EXPORTS
exports.click = click;
exports.inputText = inputText;
exports.focusOn = focusOn;
exports.blur = blur;
exports.pickInSelect = pickInSelect;

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

// todo: export angular-specific code to angular middlewares
