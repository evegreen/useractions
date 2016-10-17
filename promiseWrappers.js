'use strict';

// todo: mb unify promisify-wrapper for all callback-methods ?
exports.promisifyWrapper1arg = function (func, selector) {
  return new Promise((resolve, reject) => {
    func(selector, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

exports.promisifyWrapper2arg = function (func, selector, secondArg) {
  return new Promise((resolve, reject) => {
    func(selector, secondArg, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}
