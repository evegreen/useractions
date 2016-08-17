'use strict';

var assert = require('chai').assert;

var getClassUtil = require('../../getClassUtil');

describe('getClassUtil', () => {
  describe('getClass method', () => {
    let getClass = getClassUtil.getClass;

    it('returns "Function" when get function', done => {
      let myFunc = function () {};
      assert.equal(getClass(myFunc), 'Function');
      done();
    });

    it('returns "Function" when get arrow function', done => {
      let myArrowFunc = () => {};
      assert.equal(getClass(myArrowFunc), 'Function');
      done();
    });

    it('returns "Number" when get number', done => {
      assert.equal(getClass(5), 'Number');
      done();
    });

    it('returns "String" when get string', done => {
      assert.equal(getClass('lol'), 'String');
      done();
    });

    it('returns "Undefined" when get nothing', done => {
      assert.equal(getClass(), 'Undefined');
      done();
    });

    it('returns "Null" when get null', done => {
      assert.equal(getClass(null), 'Null');
      done();
    });

    it('returns "Object" when get simple object', done => {
      assert.equal(getClass({}), 'Object');
      done();
    });

    it('returns "Array" when get empty array', done => {
      assert.equal(getClass([]), 'Array');
      done();
    });

    it('returns "Boolean" when get true or false', done => {
      assert.equal(getClass(true), 'Boolean');
      assert.equal(getClass(false), 'Boolean');
      done();
    });
  });

  describe('isFunction method', () => {
    let isFunction = getClassUtil.isFunction;

    it('try function', done => {
      assert(isFunction((function () {})));
      done();
    });

    it('try arrow function', done => {
      assert(isFunction(() => {}));
      done();
    });

    it('try object', done => {
      assert.isFalse(isFunction({}));
      done();
    });
  });

  describe('isArray method', () => {
    let isArray = getClassUtil.isArray;

    it('try array', done => {
      assert(isArray([]));
      done();
    });

    it('try simple object', done => {
      assert.isFalse(isArray({}));
      done();
    });
  });

  describe('isNumber method', () => {
    let isNumber = getClassUtil.isNumber;

    it('try number', done => {
      assert(isNumber(5));
      done();
    });

    it('try object', done => {
      assert.isFalse(isNumber({}));
      done();
    });
  });

  describe('isString method', () => {
    let isString = getClassUtil.isString;

    it('try string', done => {
      assert(isString('my string'));
      done();
    });

    it('try array', done => {
      assert.isFalse(isString([]));
      done();
    });
  });

  describe('isObject method', () => {
    let isObject = getClassUtil.isObject;

    it('try object', done => {
      assert(isObject({}));
      done();
    });

    it('try number', done => {
      assert.isFalse(isObject(5.5));
      done();
    });
  });

  describe('isNull method', () => {
    let isNull = getClassUtil.isNull;

    it('try null', done => {
      assert(isNull(null));
      done();
    });

    it('try zero number', done => {
      assert.isFalse(isNull(0));
      done();
    });
  });

  describe('isUndefined method', () => {
    let isUndefined = getClassUtil.isUndefined;

    it('try undefined', done => {
      let lol = {};
      assert(isUndefined(lol.undef));
      done();
    });

    it('try defined', done => {
      let lol = {};
      assert.isFalse(isUndefined(lol));
      done();
    });
  });

  describe('isBoolean method', () => {
    let isBoolean = getClassUtil.isBoolean;

    it('try true', done => {
      assert(isBoolean(true));
      done();
    });

    it('try false', done => {
      assert(isBoolean(false));
      done();
    });

    it('try undefined', done => {
      let myVar = {};
      assert.isFalse(isBoolean(myVar.thisIsUndef));
      done();
    });

    it('try null', done => {
      assert.isFalse(isBoolean());
      done();
    });

    it('try object', done => {
      assert.isFalse(isBoolean({}));
      done();
    });
  });
});
