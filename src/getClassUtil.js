export const getClass = obj => ({}.toString.call(obj).slice(8, -1));

export const isFunction = obj => getClass(obj) === 'Function';
export const isArray = obj => getClass(obj) === 'Array';
export const isNumber = obj => getClass(obj) === 'Number';
export const isString = obj => getClass(obj) === 'String';
export const isObject = obj => getClass(obj) === 'Object';
export const isBoolean = obj => getClass(obj) === 'Boolean';
export const isNull = obj => getClass(obj) === 'Null';
export const isUndefined = obj => getClass(obj) === 'Undefined';
