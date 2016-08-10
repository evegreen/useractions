/*
 * No need middlewares system, cause trigger events need for all frameworks, not only for angular
 */

'use strict';

module.exports = [
  {
    forMethod: 'changeValue',
    action: function (selector) {
      angular.element(selector).triggerHandler('input');
    }
  }
];

// OUT FROM smokeActions.js FILE

/*
 * Each middleware must root exports an array with middleware-objects.
 * This objects must have forMethod string value, than has mrthod name,
 * when this middleware will be used.
 * Runnable code must be in action parameter in function.
 *
 * First argument of action function must be selector.
 */

var angularMiddlewares = require('./angularMiddlewares');
var enabledMiddlewares = [];

function enableAngularMiddlewares (boolArg) {
  if (boolArg === undefined || !isBoolean(boolArg)) {
    throw new Error('wrong argument in enableAngularMiddlewares method, need boolean value');
  }

  if (boolArg === true) {
    angularMiddlewares.forEach(angularMiddleware => {
      if (!enabledMiddlewares.includes(angularMiddleware)) {
        enabledMiddlewares.push(angularMiddleware);
      }
    });
  } else {
    // todo: implement this ...
  }
}

// WAS in changeValue method
if (enabledMiddlewares.length > 0) {
  enabledMiddlewares.filter(middleware => middleware.forMethod === 'changeValue')
  .forEach(middleware => middleware.action(selector));
}
