import {assert} from 'chai';
import wrapInPromise from '../../src/promiseWrapper';

describe('promise wrappers', () => {
  it('works without argumets', done => {
    let funcCalled = false;
    let funcWithoutArgs = function(cb) {
      funcCalled = true;
      return cb(null);
    };

    let promisedFuncWithoutArgs = wrapInPromise(funcWithoutArgs);

    promisedFuncWithoutArgs().then(() => {
      assert.isTrue(funcCalled);
      done();
    });
  });

  it('works with 1 argument', done => {
    let funcCalled = false;
    let funcWithArg = function(arg, cb) {
      assert.equal(arg, 'example arg');
      funcCalled = true;
      return cb(null);
    };

    let promisedFuncWithArg = wrapInPromise(funcWithArg);

    promisedFuncWithArg('example arg').then(() => {
      assert.isTrue(funcCalled);
      done();
    });
  });

  it('works with 2 arguments', done => {
    let funcCalled = false;
    let funcWith2Args = function(arg1, arg2, cb) {
      assert.equal(arg1, 'example arg1');
      assert.equal(arg2, 'example arg2');
      funcCalled = true;
      return cb(null);
    };

    let promisedFuncWith2Args = wrapInPromise(funcWith2Args);

    promisedFuncWith2Args('example arg1', 'example arg2').then(() => {
      assert.isTrue(funcCalled);
      done();
    });
  });

  it('works with result', done => {
    let funcWithResult = function(cb) {
      return cb(null, 'example result');
    };

    let promisedFuncWithResult = wrapInPromise(funcWithResult);

    promisedFuncWithResult().then(result => {
      assert.equal(result, 'example result');
      done();
    });
  });

  it('works with error', done => {
    let funcThatThrows = function(cb) {
      return cb('example error');
    };

    let promisedFuncThatThrows = wrapInPromise(funcThatThrows);

    promisedFuncThatThrows().catch(err => {
      assert.equal(err, 'example error');
      done();
    });
  });
});
