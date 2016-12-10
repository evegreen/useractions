'use strict';

var assert = require('chai').assert;
var promiseWrapper = require('../../src/promiseWrappers').unifyWrapper;

var funcWithoutArgs = function (cb) {
  return cb(null);
};

var funcWithArg = function (arg, cb) {
  assert.equal(arg, 'example arg');
  return cb(null);
};

var funcWith2Args = function (arg1, arg2, cb) {
  assert.equal(arg1, 'example arg1');
  assert.equal(arg2, 'example arg2');
  return cb(null);
};

var funcWithResult = function (cb) {
  return cb(null, 'example result');
};

// mocha done callback will be stored in global,
// cause we need test arguments directly in this tests
var resolveFunc = function (err) {
  assert.isNull(err);
  global.simpleCallbackDone();
};

var rejectFunc = function (err) {
  assert.equal(err, 'example error');
  global.errorCallbackDone();
};

var resolveWithResult = function (err, res) {
  assert.isNull(err);
  assert.equal(res, 'example result');
  global.callbackWithResultDone();
};

describe('promise wrappers', () => {
  it('works without argumets', done => {
    global.simpleCallbackDone = done;
    let promised = promiseWrapper(funcWithoutArgs);
    promised().then(resolveFunc);
    global.simpleCallbackDone = null;
  });
/*
  it('works with 1 argument', done => {

  });

  it('works with 2 arguments', done => {

  });

  it('works with result', done => {

  });

  it('works with error', done => {

  });
*/
});
