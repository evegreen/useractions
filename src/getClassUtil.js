let getClass = obj => ({}).toString.call(obj).slice(8, -1);

let getClassModule = {};

getClassModule.getClass = getClass;
getClassModule.isFunction = obj => getClass(obj) === 'Function';
getClassModule.isArray = obj => getClass(obj) === 'Array';
getClassModule.isNumber = obj => getClass(obj) === 'Number';
getClassModule.isString = obj => getClass(obj) === 'String';
getClassModule.isObject = obj => getClass(obj) === 'Object';
getClassModule.isBoolean = obj => getClass(obj) === 'Boolean';
getClassModule.isNull = obj => getClass(obj) === 'Null';
getClassModule.isUndefined = obj => getClass(obj) === 'Undefined';

export default getClassModule;
