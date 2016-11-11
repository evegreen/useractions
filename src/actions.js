'use strict';

var inlineJquery = require('../node_modules/jquery/dist/jquery.min');

var getClassUtil = require('./getClassUtil');
var isNumber = getClassUtil.isNumber;
var isString = getClassUtil.isString;

var findModule = require('./findModule')(defaultTimeout, defaultRefreshTime);
var runPredicate = findModule.runPredicate;
var waitState = findModule.waitState;
var findElement = findModule.findElement;

var promiseWrappers = require('./promiseWrappers');
var promisifyWrapper1arg = promiseWrappers.promisifyWrapper1arg;
var promisifyWrapper2arg = promiseWrappers.promisifyWrapper2arg;
var promisifyWrapper1res = promiseWrappers.promisifyWrapper1res;


var defaultTimeout = 2000;
var defaultRefreshTime = 300;

function setDefaultTimeout (timeout) {
  defaultTimeout = timeout;
}

function setDefaultRefreshTime (refreshTime) {
  defaultRefreshTime = refreshTime;
}


function directClick (selectorOrElement, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement(selectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    element.click();
    return cb(null);
  });
}

function click (selectorOrElement, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement(selectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    inlineJquery(element).trigger('click');
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

    inlineJquery(element).trigger('focus');
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

    inlineJquery(element).trigger('blur');
    return cb(null);
  });
}

function changeValue (selectorOrElement, newValue, cb = simpleThrowerCallback) {
  if (!selectorOrElement) {
    throw new Error('selector argument is not defined');
  }

  findElement(selectorOrElement, (err, inputElement) => {
    if (err) {
      return cb(err);
    }

    inputElement.value = newValue;
    return cb(null);
  });
}

function triggerEvent (selectorOrElement, eventName, cb = simpleThrowerCallback) {
  findElement(selectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    inlineJquery(element).trigger(eventName);
    return cb(null);
  });
}

function triggerHandler (selectorOrElement, eventName, cb = simpleThrowerCallback) {
  findElement(selectorOrElement, (err, element) => {
    if (err) {
      return cb(err);
    }

    inlineJquery(element).triggerHandler(eventName);
    return cb(null);
  });
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

    if (isNumber(option)) {
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

function simpleThrowerCallback (err) {
  if (err) throw err;
}

// EXPORTS
exports.promised = {};

exports.directClick = directClick;
exports.promised.directClick = function (selectorOrElement) {
  return promisifyWrapper1arg(directClick, selectorOrElement);
};

exports.click = click;
exports.promised.click = function (selectorOrElement) {
  return promisifyWrapper1arg(click, selectorOrElement);
};

exports.changeValue = changeValue;
exports.promised.changeValue = function (selectorOrElement, newValue) {
  return promisifyWrapper2arg(changeValue, selectorOrElement, newValue);
};

exports.focusOn = focusOn;
exports.promised.focusOn = function (selectorOrElement) {
  return promisifyWrapper1arg(focusOn, selectorOrElement);
};

exports.blur = blur;
exports.promised.blur = function (selectorOrElement) {
  return promisifyWrapper1arg(blur, selectorOrElement);
};

exports.pickInSelect = pickInSelect;
exports.promised.pickInSelect = function (selectSelectorOrElement, option) {
  return promisifyWrapper2arg(pickInSelect, selectSelectorOrElement, option);
};

exports.triggerEvent = triggerEvent;
exports.promised.triggerEvent = function (selectorOrElement, eventName) {
  return promisifyWrapper2arg(triggerEvent, selectorOrElement, eventName);
};

exports.triggerHandler = triggerHandler;
exports.promised.triggerHandler = function (selectorOrElement, eventName) {
  return promisifyWrapper2arg(triggerHandler, selectorOrElement, eventName);
};

exports.getText = getText;
exports.promised.getText = function promisedGetText (selectorOrElement) {
  return promisifyWrapper1res(getText, selectorOrElement);
};

exports.getValue = getValue;
exports.promised.getValue = function (selectorOrElement) {
  return promisifyWrapper1res(getValue, selectorOrElement);
};

exports.findElement = findElement;
exports.promised.findElement = function (selectorOrElement, optionalTimeout = defaultTimeout) {
  return new Promise((resolve, reject) => {
    findElement(selectorOrElement, optionalTimeout, (err, element) => {
      if (err) {
        return reject(err);
      }

      return resolve(element);
    });
  });
};

exports.waitState = waitState;
exports.promised.waitState = function (predicate, timeout = defaultTimeout, refreshTime = defaultRefreshTime) {
  return new Promise((resolve, reject) => {
    waitState(predicate, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    }, timeout, refreshTime);
  });
};

exports.runPredicate = runPredicate;
exports.setDefaultRefreshTime = setDefaultRefreshTime;
exports.setDefaultTimeout = setDefaultTimeout;

// EXPORTS ONLY FOR TESTS
let ___nonMockedJquery = inlineJquery;
exports.___jquerySetter = function (fakeJquery) {
  inlineJquery = fakeJquery;
};
exports.___jqueryRestore = function () {
  inlineJquery = ___nonMockedJquery;
};
