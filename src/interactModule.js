import {findElement} from './findModule';
import {isNumber, isString} from './getClassUtil';

function simpleThrowerCallback(err) {
  if (err) throw err;
}

export function directClick(selectorOrElement, cb = simpleThrowerCallback) {
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
export function click(target, cb = simpleThrowerCallback) {
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
export function event(
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
export function focusOn(targetInput, cb = simpleThrowerCallback) {
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
export function blur(target, cb = simpleThrowerCallback) {
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

export function changeValue(
  selectorOrElement,
  newValue,
  cb = simpleThrowerCallback
) {
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

/**
 * @param {Number | String} option - number or value or innerHTML
 */
export function pickInSelect(
  selectSelectorOrElement,
  option,
  cb = simpleThrowerCallback
) {
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

      return cb(
        new Error(
          `select ${selectSelectorOrElement} not contains ${option} option`
        )
      );
    }

    if (isNumber(option)) {
      if (option < 0) {
        return cb(
          new Error(`in ${selectSelectorOrElement}: your option is less then 0`)
        );
      }

      if (option >= valueOptions.length) {
        return cb(
          new Error(
            `in ${selectSelectorOrElement}: you selected ${option}, but max number is ${valueOptions.length -
              1}`
          )
        );
      }

      selectElement.value = valueOptions[option];
      return cb(null);
    }

    return cb(new Error('option parameter is not string or number'));
  });
}
