'use strict';

// TODO: maybe unify promisify-wrappers for all callback-methods ?

exports.promisifyWrapper1arg = function (func, selector) {
  return new Promise((resolve, reject) => {
    func(selector, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

exports.promisifyWrapper2arg = function (func, selector, secondArg) {
  return new Promise((resolve, reject) => {
    func(selector, secondArg, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

exports.promisifyWrapper1res = function (func, selector) {
  return new Promise((resolve, reject) => {
    func(selector, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
};

// this wrapper cannot handle function with many results,
// cause promise can pass only one of them to resolve function
exports.unifyWrapper = function (func, ...funcArgs) {
  return new Promise((resolve, reject) => {
    debugger;
    func(...funcArgs, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
};
