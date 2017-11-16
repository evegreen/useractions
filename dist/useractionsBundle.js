(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./package.json":2,"./src/actions":3}],2:[function(require,module,exports){
module.exports={
  "name": "useractions",
  "title": "UserActions",
  "main": "dist/useractionsBundle.js",
  "version": "0.5.0",
  "description": "Library, that helps simulate user actions for write fast functional tests",
  "directories": {
    "test": "tests"
  },
  "scripts": {
    "build": "./node_modules/.bin/browserify bundler.js -o dist/useractionsBundle.js",
    "devmode": "./node_modules/.bin/watchify bundler.js -o dist/useractionsBundle.js",
    "test": "./node_modules/.bin/_mocha tests/unit --recursive",
    "lint": "./node_modules/.bin/eslint -c .eslintrc.js bundler.js src/**/*.js tests/**/*.js",
    "regression-test": "node ./tests/regression/openRegressionTestPage.js",
    "build-prod": "npm run lint && npm run test && npm run build && npm run regression-test",
    "coverage": "./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha tests/unit/**/*.js --recursive ; exit 0"
  },
  "files": [
    "dist",
    "src",
    "tests",
    "README.md",
    "LICENSE",
    "bundler.js"
  ],
  "author": {
    "name": "evegreen",
    "email": "romenbane@gmail.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/evegreen/useractions.git"
  },
  "keywords": [
    "test",
    "action",
    "actions",
    "functional",
    "simulate"
  ],
  "bugs": {
    "url": "https://github.com/evegreen/useractions/issues"
  },
  "license": "MIT",
  "devDependencies": {
    "browserify": "14.3.0",
    "chai": "3.5.0",
    "eslint": "3.19.0",
    "istanbul": "0.4.5",
    "mocha": "^4.0.1",
    "opn": "^5.1.0",
    "sinon": "2.2.0",
    "watchify": "3.9.0"
  }
}

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function() {
  var findModule = require('./findModule');
  var runPredicate = findModule.runPredicate;
  var waitState = findModule.waitState;
  var findElement = findModule.findElement;

  var interactModule = require('./interactModule')();
  var directClick = interactModule.directClick;
  var click = interactModule.click;
  var event = interactModule.event;
  var changeValue = interactModule.changeValue;
  var focusOn = interactModule.focusOn;
  var blur = interactModule.blur;
  var pickInSelect = interactModule.pickInSelect;

  var promiseWrapper = require('./promiseWrapper');


  window.__defaultTimeout = 2000;
  window.__defaultRefreshTime = 300;

  function setDefaultTimeout(timeout) {
    window.__defaultTimeout = timeout;
  }

  function setDefaultRefreshTime(refreshTime) {
    window.__defaultRefreshTime = refreshTime;
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


  module.promised = {};

  module.directClick = directClick;
  module.promised.directClick = promiseWrapper(directClick);

  module.click = click;
  module.promised.click = promiseWrapper(click);

  module.event = event;
  module.promised.event = promiseWrapper(event);

  module.changeValue = changeValue;
  module.promised.changeValue = promiseWrapper(changeValue);

  module.focusOn = focusOn;
  module.promised.focusOn = promiseWrapper(focusOn);

  module.blur = blur;
  module.promised.blur = promiseWrapper(blur);

  module.pickInSelect = pickInSelect;
  module.promised.pickInSelect = promiseWrapper(pickInSelect);

  module.getText = getText;
  module.promised.getText = promiseWrapper(getText);

  module.getValue = getValue;
  module.promised.getValue = promiseWrapper(getValue);

  module.findElement = findElement;
  module.promised.findElement = promiseWrapper(findElement);

  module.waitState = waitState;
  module.promised.waitState = function(predicate, timeout = window.__defaultTimeout, refreshTime = window.__defaultRefreshTime) {
    return new Promise((resolve, reject) => {
      waitState(predicate, err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      }, timeout, refreshTime);
    });
  };

  module.runPredicate = runPredicate;
  module.setDefaultRefreshTime = setDefaultRefreshTime;
  module.setDefaultTimeout = setDefaultTimeout;

  return module;
};

},{"./findModule":4,"./interactModule":6,"./promiseWrapper":7}],4:[function(require,module,exports){
'use strict';

var getClassUtil = require('./getClassUtil');
var isFunction = getClassUtil.isFunction;
var isNumber = getClassUtil.isNumber;
var isBoolean = getClassUtil.isBoolean;

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
                    timeout = window.__defaultTimeout,
                    refreshTime = window.__defaultRefreshTime,
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
    return findElementNormalized(selectorOrElement, window.__defaultTimeout, timeoutOrCb);
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

exports.runPredicate = runPredicate;
exports.waitState = waitState;
exports.findElement = findElement;

},{"./getClassUtil":5}],5:[function(require,module,exports){
'use strict';

let getClass = obj => ({}).toString.call(obj).slice(8, -1);
exports.getClass = getClass;
exports.isFunction = obj => getClass(obj) === 'Function';
exports.isArray = obj => getClass(obj) === 'Array';
exports.isNumber = obj => getClass(obj) === 'Number';
exports.isString = obj => getClass(obj) === 'String';
exports.isObject = obj => getClass(obj) === 'Object';
exports.isBoolean = obj => getClass(obj) === 'Boolean';
exports.isNull = obj => getClass(obj) === 'Null';
exports.isUndefined = obj => getClass(obj) === 'Undefined';

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function() {
  var getClassUtil = require('./getClassUtil');
  var isNumber = getClassUtil.isNumber;
  var isString = getClassUtil.isString;

  var findModule = require('./findModule');
  var findElement = findModule.findElement;

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

  /**
   * @param {string|Element} target - target element or its selector
  */
  function click(target, cb = simpleThrowerCallback) {
    if (!target) {
      throw new Error('selector argument is not defined');
    }

    findElement(target, (err, elem) => {
      if (err) {
        return cb(err);
      }

      let clickEvent = new Event('click', {bubbles: true, cancelable: true});
      elem.dispatchEvent(clickEvent);
      return cb(null);
    });
  }

  /**
   * @param {string} options.type - event name e.g. "click"
   * @param {string|Element} options.target - target element or its selector
  */
  function event(
    {type, target, bubbles = true, cancelable = true},
    cb = simpleThrowerCallback
  ) {
    if (!type) {
      throw new Error('event name argument is not defined');
    }

    if (!target) {
      throw new Error('target selector argument is not defined');
    }

    findElement(target, (err, elem) => {
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

    findElement(targetInput, (err, elem) => {
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

    findElement(target, (err, elem) => {
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

    findElement(selectorOrElement, (err, inputElement) => {
      if (err) {
        return cb(err);
      }

      inputElement.value = newValue;
      return cb(null);
    });
  }

  // option - number or value or innerHTML
  function pickInSelect(selectSelectorOrElement, option, cb = simpleThrowerCallback) {
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

  function simpleThrowerCallback(err) {
    if (err) throw err;
  }

  module.directClick = directClick;
  module.click = click;
  module.event = event;
  module.focusOn = focusOn;
  module.blur = blur;
  module.changeValue = changeValue;
  module.pickInSelect = pickInSelect;

  return module;
};

},{"./findModule":4,"./getClassUtil":5}],7:[function(require,module,exports){
'use strict';

// this wrapper cannot handle function with many results,
// cause promise can pass only one of them to resolve function
module.exports = function(func) {
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
};

},{}]},{},[1]);
