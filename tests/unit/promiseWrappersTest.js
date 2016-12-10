'use strict';

var assert = require('chai').assert;
var promiseWrapper = require('../../src/promiseWrappers').unifyWrapper;

describe('promise wrappers', () => {
  it('works without argumets', done => {
    let funcCalled = false;
    let funcWithoutArgs = function (cb) {
      funcCalled = true;
      return cb(null);
    };

    // let promisedFuncWithoutArgs = function () {
    //   return promiseWrapper(funcWithoutArgs);
    // };
    let promisedFuncWithoutArgs = promiseWrapper(funcWithoutArgs);

    promisedFuncWithoutArgs()
    .then(() => {
      assert.isTrue(funcCalled);
      done();
    });
  });

  it('works with 1 argument', done => {
    let funcCalled = false;
    let funcWithArg = function (arg, cb) {
      assert.equal(arg, 'example arg');
      funcCalled = true;
      return cb(null);
    };

    // let promisedFuncWithArg = function (arg) {
    //   return promiseWrapper(funcWithArg, arg);
    // };
    let promisedFuncWithArg = promiseWrapper(funcWithArg);

    promisedFuncWithArg('example arg')
    .then(() => {
      assert.isTrue(funcCalled);
      done();
    });
  });

  it('works with 2 arguments', done => {
    let funcCalled = false;
    let funcWith2Args = function (arg1, arg2, cb) {
      assert.equal(arg1, 'example arg1');
      assert.equal(arg2, 'example arg2');
      funcCalled = true;
      return cb(null);
    };

    // let promisedFuncWith2Args = function (arg1, arg2) {
    //   return promiseWrapper(funcWith2Args, arg1, arg2);
    // };
    let promisedFuncWith2Args = promiseWrapper(funcWith2Args);

    promisedFuncWith2Args('example arg1', 'example arg2')
    .then(() => {
      assert.isTrue(funcCalled);
      done();
    });
  });

  it('works with result', done => {
    let funcWithResult = function (cb) {
      return cb(null, 'example result');
    };

    // let promisedFuncWithResult = function () {
    //   return promiseWrapper(funcWithResult);
    // }
    let promisedFuncWithResult = promiseWrapper(funcWithResult);

    promisedFuncWithResult()
    .then(result => {
      assert.equal(result, 'example result');
      done();
    });
  });

  it('works with error', done => {
    let funcThatThrows = function (cb) {
      return cb('example error');
    };

    // let promisedFuncThatThrows = function () {
    //   return promiseWrapper(funcThatThrows);
    // };
    let promisedFuncThatThrows = promiseWrapper(funcThatThrows);

    promisedFuncThatThrows()
    .catch(err => {
      assert.equal(err, 'example error');
      done();
    });
  });
});

// TODO: delete comments
