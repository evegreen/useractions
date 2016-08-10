'use strict';

var expect = require('chai').expect;

var getClassUtil = require('../../getClassUtil');

describe('getClassUtil', () => {
  describe('getClass method', () => {
    let getClass = getClassUtil.getClass;

    it('returns "Function" when get function', done => {
      let myFunc = function () {};
      expect(getClass(myFunc)).to.equal('Function');
      done();
    });

    it('returns "Function" when get arrow function', done => {
      let myArrowFunc = () => {};
      expect(getClass(myArrowFunc)).to.equal('Function');
      done();
    });

    it('returns "Number" when get number', done => {
      expect(getClass(5)).to.equal('Number');
      done();
    });

    it('returns "String" when get string', done => {
      expect(getClass('lol')).to.equal('String');
      done();
    });

    it('returns "Undefined" when get nothing', done => {
      expect(getClass()).to.equal('Undefined');
      done();
    });

    it('returns "Null" when get null', done => {
      expect(getClass(null)).to.equal('Null');
      done();
    });

    it('returns "Object" when get simple object', done => {
      expect(getClass({})).to.equal('Object');
      done();
    });

    it('returns "Array" when get empty array', done => {
      expect(getClass([])).to.equal('Array');
      done();
    });

    it('returns "Boolean" when get true or false', done => {
      expect(getClass(true)).to.equal('Boolean');
      expect(getClass(false)).to.equal('Boolean');
      done();
    });
  });

  describe('isFunction method', () => {
    let isFunction = getClassUtil.isFunction;

    it('try function', done => {
      expect(isFunction((function () {}))).to.equal(true);
      done();
    });

    it('try arrow function', done => {
      expect(isFunction(() => {})).to.equal(true);
      done();
    });

    it('try object', done => {
      expect(isFunction({})).to.equal(false);
      done();
    });
  });

  describe('isArray method', () => {
    let isArray = getClassUtil.isArray;

    it('try array', done => {
      expect(isArray([])).to.equal(true);
      done();
    });

    it('try simple object', done => {
      expect(isArray({})).to.equal(false);
      done();
    });
  });

  describe('isNumber method', () => {
    let isNumber = getClassUtil.isNumber;

    it('try number', done => {
      expect(isNumber(5)).to.equal(true);
      done();
    });

    it('try object', done => {
      expect(isNumber({})).to.equal(false);
      done();
    });
  });

  describe('isString method', () => {
    let isString = getClassUtil.isString;

    it('try string', done => {
      expect(isString('my string')).to.equal(true);
      done();
    });

    it('try array', done => {
      expect(isString([])).to.equal(false);
      done();
    });
  });

  describe('isObject method', () => {
    let isObject = getClassUtil.isObject;

    it('try object', done => {
      expect(isObject({})).to.equal(true);
      done();
    });

    it('try number', done => {
      expect(isObject(5.5)).to.equal(false);
      done();
    });
  });

  describe('isNull method', () => {
    let isNull = getClassUtil.isNull;

    it('try null', done => {
      expect(isNull(null)).to.equal(true);
      done();
    });

    it('try zero number', done => {
      expect(isNull(0)).to.equal(false);
      done();
    });
  });

  describe('isUndefined method', () => {
    let isUndefined = getClassUtil.isUndefined;

    it('try undefined', done => {
      let lol = {};
      expect(isUndefined(lol.undef)).to.equal(true);
      done();
    });

    it('try defined', done => {
      let lol = {};
      expect(isUndefined(lol)).to.equal(false);
      done();
    });
  });

  describe('isBoolean method', () => {
    let isBoolean = getClassUtil.isBoolean;

    it('try true', done => {
      expect(isBoolean(true)).to.equal(true);
      done();
    });

    it('try false', done => {
      expect(isBoolean(false)).to.equal(true);
      done();
    });

    it('try undefined', done => {
      let myVar = {};
      expect(isBoolean(myVar.thisIsUndef)).to.equal(false);
      done();
    });

    it('try null', done => {
      expect(isBoolean()).to.equal(false);
      done();
    });

    it('try object', done => {
      expect(isBoolean({})).to.equal(false);
      done();
    });
  });
});
