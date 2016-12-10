'use strict';

module.exports = function (inlineJquery) {
  var findModule = require('./findModule');
  var runPredicate = findModule.runPredicate;
  var waitState = findModule.waitState;
  var findElement = findModule.findElement;

  var interactModule = require('./interactModule')(inlineJquery);
  var directClick = interactModule.directClick;
  var click = interactModule.click;
  var changeValue = interactModule.changeValue;
  var focusOn = interactModule.focusOn;
  var blur = interactModule.blur;
  var pickInSelect = interactModule.pickInSelect;
  var triggerEvent = interactModule.triggerEvent;
  var triggerHandler = interactModule.triggerHandler;

  var promiseWrappers = require('./promiseWrappers');
  var promisifyWrapper1arg = promiseWrappers.promisifyWrapper1arg;
  var promisifyWrapper2arg = promiseWrappers.promisifyWrapper2arg;
  var promisifyWrapper1res = promiseWrappers.promisifyWrapper1res;


  window.__defaultTimeout = 2000;
  window.__defaultRefreshTime = 300;

  function setDefaultTimeout (timeout) {
    window.__defaultTimeout = timeout;
  }

  function setDefaultRefreshTime (refreshTime) {
    window.__defaultRefreshTime = refreshTime;
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


  module.promised = {};

  module.directClick = directClick;
  module.promised.directClick = function (selectorOrElement) {
    return promisifyWrapper1arg(directClick, selectorOrElement);
  };

  module.click = click;
  module.promised.click = function (selectorOrElement) {
    return promisifyWrapper1arg(click, selectorOrElement);
  };

  module.changeValue = changeValue;
  module.promised.changeValue = function (selectorOrElement, newValue) {
    return promisifyWrapper2arg(changeValue, selectorOrElement, newValue);
  };

  module.focusOn = focusOn;
  module.promised.focusOn = function (selectorOrElement) {
    return promisifyWrapper1arg(focusOn, selectorOrElement);
  };

  module.blur = blur;
  module.promised.blur = function (selectorOrElement) {
    return promisifyWrapper1arg(blur, selectorOrElement);
  };

  module.pickInSelect = pickInSelect;
  module.promised.pickInSelect = function (selectSelectorOrElement, option) {
    return promisifyWrapper2arg(pickInSelect, selectSelectorOrElement, option);
  };

  module.triggerEvent = triggerEvent;
  module.promised.triggerEvent = function (selectorOrElement, eventName) {
    return promisifyWrapper2arg(triggerEvent, selectorOrElement, eventName);
  };

  module.triggerHandler = triggerHandler;
  module.promised.triggerHandler = function (selectorOrElement, eventName) {
    return promisifyWrapper2arg(triggerHandler, selectorOrElement, eventName);
  };

  module.getText = getText;
  module.promised.getText = function promisedGetText (selectorOrElement) {
    return promisifyWrapper1res(getText, selectorOrElement);
  };

  module.getValue = getValue;
  module.promised.getValue = function (selectorOrElement) {
    return promisifyWrapper1res(getValue, selectorOrElement);
  };

  module.findElement = findElement;
  module.promised.findElement = function (selectorOrElement, optionalTimeout = window.__defaultTimeout) {
    return new Promise((resolve, reject) => {
      findElement(selectorOrElement, optionalTimeout, (err, element) => {
        if (err) {
          return reject(err);
        }

        return resolve(element);
      });
    });
  };

  module.waitState = waitState;
  module.promised.waitState = function (predicate, timeout = window.__defaultTimeout, refreshTime = window.__defaultRefreshTime) {
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
