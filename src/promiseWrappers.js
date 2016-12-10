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
exports.unifyWrapper = function (func, ...args) {
  let callback = function (err, result) {
    if (err) {
      return reject(err);
    }

    return resolve(result);
  }

  args.push(callback);

  return new Promise((resolve, reject) => {
    func.apply(args);
  });
};
