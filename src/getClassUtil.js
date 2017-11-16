'use strict';

let getClass = obj => ({}).toString.call(obj).slice(8, -1);
exports.getClass = getClass;
exports.isFunction = obj => getClass(obj) === 'Function';
exports.isArray = obj => getClass(obj) === 'Array';
exports.isNumber = obj => getClass(obj) === 'Number';
exports.isString = obj => getClass(obj) === 'String';
exports.isObject = obj => getClass(obj) === 'Object';
exports.isBoolean = obj => getClass(obj) === 'Boolean';
exports.isNull = obj => getClass(obj) === 'Null';
exports.isUndefined = obj => getClass(obj) === 'Undefined';
