'use strict';

var inlineJquery = require('../node_modules/jquery/dist/jquery.min');

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

exports.directClick = directClick;
exports.click = click;
exports.focusOn = focusOn;
exports.blur = blur;
exports.changeValue = changeValue;
exports.pickInSelect = pickInSelect;
exports.triggerEvent = triggerEvent;
exports.triggerHandler = triggerHandler;

// EXPORTS ONLY FOR TESTS
let ___nonMockedJquery = inlineJquery;
exports.___jquerySetter = function (fakeJquery) {
  inlineJquery = fakeJquery;
};
exports.___jqueryRestore = function () {
  inlineJquery = ___nonMockedJquery;
};
