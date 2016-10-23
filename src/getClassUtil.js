'use strict';

function getClass (obj) {
  return {}.toString.call(obj).slice(8, -1);
}
exports.getClass = getClass;

exports.isFunction = function (obj) {
  return getClass(obj) === 'Function';
};

exports.isArray = function (obj) {
  return getClass(obj) === 'Array';
};

exports.isNumber = function (obj) {
  return getClass(obj) === 'Number';
};

exports.isString = function (obj) {
  return getClass(obj) === 'String';
};

exports.isObject = function (obj) {
  return getClass(obj) === 'Object';
};

exports.isBoolean = function (obj) {
  return getClass(obj) === 'Boolean';
};

exports.isNull = function (obj) {
  return getClass(obj) === 'Null';
};

exports.isUndefined = function (obj) {
  return getClass(obj) === 'Undefined';
};
