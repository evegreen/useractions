import _root from './globalRoot';
import {isFunction, isNumber, isBoolean} from './getClassUtil';

export function runPredicate(predicate) {
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

export function waitState(
  predicate,
  cb,
  timeout = _root.__defaultTimeout,
  refreshTime = _root.__defaultRefreshTime,
  startTime = Date.now()
) {
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

    setTimeout(
      waitState,
      refreshTime,
      predicate,
      cb,
      timeout,
      refreshTime,
      startTime
    );
  }
}

function checkFoundElement(element, selectorForError) {
  if (element != null) {
    return true;
  }

  throw new Error("Can't find element, selector = " + selectorForError);
}

export function findElement(selectorOrElement, timeoutOrCb, cb) {
  if (!selectorOrElement) {
    throw new Error(
      'first argument of findElement() undefined, it must be css selector!'
    );
  }

  let secondArgumentErrorMessage =
    'second argument of findElement() must be timeout number or a callback function!';
  if (!timeoutOrCb) {
    throw new Error(secondArgumentErrorMessage);
  }

  if (!isFunction(timeoutOrCb) && !isNumber(timeoutOrCb)) {
    throw new Error(secondArgumentErrorMessage);
  }

  if (isFunction(timeoutOrCb)) {
    return findElementNormalized(
      selectorOrElement,
      _root.__defaultTimeout,
      timeoutOrCb
    );
  }

  if (isNumber(timeoutOrCb)) {
    return findElementNormalized(selectorOrElement, timeoutOrCb, cb);
  }
}

function findElementNormalized(selectorOrElement, timeout, cb) {
  if (selectorOrElement.nodeType) {
    return cb(null, selectorOrElement);
  }

  let foundElement;
  waitState(
    () => {
      foundElement = document.querySelector(selectorOrElement);
      return checkFoundElement(foundElement);
    },
    () => cb(null, foundElement),
    timeout
  );
}
