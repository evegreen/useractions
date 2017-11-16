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
