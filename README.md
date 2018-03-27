# **UserActions**

Library, that helps simulate user actions for write fast functional tests fro browsers

## Getting started

### Npm

    npm install useractions --save-dev

---

# Table of contents
- [Add tests to webpage](#add-tests-to-webpage)
- [Run tests](#run-tests)
- [Action methods](#action-methods)
- [Configure timeouts](#configure-timeouts)
- [Promisified methods](#promisified-methods)
- [Already found element](#already-found-element)
- [Todo section](#todo)
- [Other](#other)

---

## Add tests to webpage

For add tests to your webpage, just add it right in simple script.
[Look to the example](https://github.com/evegreen/useractions/blob/master/tests/regression/exampleApp.html)

But if you want add lib and tests without change your webpage files, you can use userscripts (tampermonkey / greasemonkey extensions)

---

## Run tests

[Look to the example](https://github.com/evegreen/useractions/blob/master/tests/regression/exampleTestScript.js)

---

## Action methods

interact methods:
- [click method](#click-method)
- [event method](#event-method)
- [changeValue method](#changevalue-method)
- [focusOn method](#focuson-method)
- [blur method](#blur-method)
- [pickInSelect method](#pickinselect-method)
- [directClick method](#directclick-method)

get methods:
- [getText method](#gettext-method)
- [getValue method](#getvalue-method)

core methods:
- [findElement method](#findelement-method)
- [waitState method](#waitstate-method)



## Methods API

### click method
```js
var click = userActions.click;
click('button#submit', optionalCallback);
```


### event method
```js
var event = userActions.event;
event({
  type: 'click',
  target: 'button#submit'
}, optionalCallback);
```



### changeValue method
```js
var changeValue = userActions.changeValue;
changeValue('input#login', 'John Doe', optionalCallback);
```


### focusOn method
```js
var focusOn = userActions.focusOn;
focusOn('input#password', optionalCallback);
```


### blur method
```js
var blur = userActions.blur;
blur('input#age', optionalCallback);
```


### pickInSelect method
```js
var pickInSelect = userActions.pickInSelect;

// You can pass option value
pickInSelect('select#car', 'mercedez', optionalCallback);

// You can pass option innerHTML
pickInSelect('select#car', 'Mercedez Benz', optionalCallback);

// Or a number of selected value
pickInSelect('select#car', 2, optionalCallback);
```

### directClick method
```js
var directClick = userActions.directClick;

// this method calls .click() method of element directly (without events)
click('#myCheckbox', optionalCallback);
```

### getText method
```js
var getText = userActions.getText;
getText('div#selectedCar', function(err, text) {
  if (err) throw err;

  // work with text
});
```


### getValue method
```js
var getValue = userActions.getValue;
getValue('input#surname', function(err, value) {
  if (err) throw err;

  // work with value
});
```


### findElement method
```js
var findElement = userActions.findElement;

// You can use with default timeout waiting for element presense
findElement('div#main', function(err, element) {
  if (err) throw err;

  // work with element
});

// Or you can specify need timeout
findElement('div#main', 3000, function(err, element) {
  if (err) throw err;

  // work with element
});
```


### waitState method
```js
var waitState = userActions.waitState;

waitState(function() {
  // this is predicate, it must return boolean value
  var loadedCarsInList = document.querySelectorAll('ul#cars>li').length;
  return loadedCarsInList === 12;
}, function(err) {
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
userActions.setDefaultRefreshTime(1000);
```


### setDefaultTimeout method
```js
// every waitState method or findElement process will failed after 6 seconds
userActions.setDefaultTimeout(6000);
```

---

## Promisified methods
All action methods has promisified version, in example `getText`:
```js
var getText = userActions.promised.getText;

getText('div#carDescription')
.then(function(text) { /* work with text =) */ })
.catch(function(err) { /* handle error =( */ };
```

---

## Already found element
All action methods (promisified too) you can use with already found element.
It is comfortable for promise chaining:

```js
var promiseActions = userActions.promised;
var findElement = promiseActions.findElement;
var click = promiseActions.click;

findElement('#buttonForClick')
.then(button => click(button));
```

---

## TODO
- [ ] make possible es6 imports, not only IIFE
- [ ] console-browser integration for test runs
- [ ] step synchronization for non SPA websites (or crossdomain websites)
- [ ] headless chrome usage examples
- [ ] test runs results keeping
- [ ] test runs results statistics
- [ ] fix stacktrace after waiting recursive functions

---

## Other
```js
userActions.version();
```
Returns version of library and bundled dependencies
