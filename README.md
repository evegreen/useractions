# **Smoketest**

Smoketest - pure javascript smoke-test framework. (currently in beta)

Full documentation are not here yet, but base API presents

## Getting started

### Npm

    npm install smoketest --save-dev

### Bower

    bower install smoketest --save-dev

Or just fetch build under [dist](https://github.com/evegreen/smoketest/tree/master/dist).

---

# Table of contents
- [Add tests to site](#add-tests-to-site)
- [Run tests](#run-tests)
- [Action methods](#action-methods)
- [Configure timeouts](#configure-timeouts)
- [Promisified methods](#promisified-methods)
- [Other](#other)

---

## Add tests to site

For add framework and tests to your site, just add it right in simple script.
[Look to the example](https://github.com/evegreen/smoketest/blob/master/tests/regression/exampleApp.html)

But if you want add framework and tests without change your site files, you can use userscripts (tampermonkey / greasemonkey extensions)
[Look to the example](https://github.com/evegreen/smoketest/blob/master/tests/regression/userScriptExample.js)

---

## Run tests

Just type in console `smokeTest.runAll();`
You can make typo in camelCase, it is no problem =)

---

## Action methods

interact methods:
- [click method](#click-method)
- [inputText method](#inputtext-method)
- [focusOn method](#focuson-method)
- [blur method](#blur-method)
- [pickInSelect method](#pickinselect-method)

get methods:
- [getText method](#gettext-method)
- [getValue method](#getvalue-method)

core methods:
- [findElement method](#findelement-method)
- [waitState method](#waitstate-method)



## Methods API

### click method
```js
var click = smokeTest.actions.click;
click('button#submit', optionalCallback);
```


### inputText method
```js
var inputText = smokeTest.actions.inputText;
inputText('input#login', 'John Doe', optionalCallback);
```


### focusOn method
```js
var focusOn = smokeTest.actions.focusOn;
focusOn('input#password', optionalCallback);
```


### blur method
```js
var blur = smokeTest.actions.blur;
blur('input#age', optionalCallback);
```


### pickInSelect method
```js
var pickInSelect = smokeTest.actions.pickInSelect;

// You can pass option value
pickInSelect('select#car', 'mercedez', optionalCallback);

// You can pass option innerHTML
pickInSelect('select#car', 'Mercedez Benz', optionalCallback);

// Or a number of selected value
pickInSelect('select#car', 2, optionalCallback);
```


### getText method
```js
var getText = smokeTest.actions.getText;
getText('div#selectedCar', function (err, text) {
  if (err) throw err;

  // work with text
});
```


### getValue method
```js
var getValue = smokeTest.actions.getValue;
getValue('input#surname', function (err, value) {
  if (err) throw err;

  // work with value
});
```


### findElement method
```js
var findElement = smokeTest.actions.findElement;

// You can use with default timeout waiting for element presense
findElement('div#main', function (err, element) {
  if (err) throw err;

  // work with element
});

// Or you can specify need timeout
findElement('div#main', 3000, function (err, element) {
  if (err) throw err;

  // work with element
});
```


### waitState method
```js
var waitState = smokeTest.actions.waitState;

waitState(function () {
  // this is predicate, it must return boolean value
  var loadedCarsInList = document.querySelectorAll('ul#cars>li').length;
  return loadedCarsInList === 12;
}, function (err) {
  // this is callback, it will called if predicate returns true, until timeout done
  if (err) throw err;

  // work with successfully loaded car list
}, 5000, 1000); // optional timeout and optional refresh time (wait 5 seconds and check predicate every second)
```

---

## Configure timeouts

### setDefaultRefreshTime method
```js
// every waitState method or findElement process will try every second
smokeTest.actions.setDefaultRefreshTime(1000);
```


### setDefaultTimeout method
```js
// every waitState method or findElement process will failed after 6 seconds
smokeTest.actions.setDefaultTimeout(6000);
```

---

## Promisified methods
All action methods has promisified version, in example `getText`:
```js
var getText = smokeTest.actions.promised.getText;

getText('div#carDescription')
.then(function (text) { /* work with text =) */ })
.catch(function (err) { /* handle error =( */ };
```

---

## Other
```js
smokeTest.version();
```
Returns versions of framework and bundled libraries
