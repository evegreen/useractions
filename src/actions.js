'use strict';

var findModule = require('./findModule');
var runPredicate = findModule.runPredicate;
var waitState = findModule.waitState;
var findElement = findModule.findElement;

var interactModule = require('./interactModule');
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
exports.promised.findElement = function (selectorOrElement, optionalTimeout = window.__defaultTimeout) {
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
exports.promised.waitState = function (predicate, timeout = window.__defaultTimeout, refreshTime = window.__defaultRefreshTime) {
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
exports.___jquerySetter = interactModule.___jquerySetter;
exports.___jqueryRestore = interactModule.___jqueryRestore;
