'use strict';

var assert = smokeTest.chai.assert;

var smokeActions = smokeTest.actions;
var promisedActions = smokeActions.promised;

describe('click method', () => {

  let click = smokeActions.click;

  it('works when check immediate result after click', done => {
    let immediateResultButtonSelector = 'input#immediateResultButton';
    let resultSelector = 'div#immediateResult';

    // check element doesn't exist before click
    let emptyImmediateResult = document.querySelector(resultSelector);
    assert.isNull(emptyImmediateResult);

    click(immediateResultButtonSelector, err => {
      if (err) throw err;

      // check exists after click
      let immediateResult = document.querySelector(resultSelector);

      assert.equal(immediateResult.id, 'immediateResult');
      assert.equal(immediateResult.innerHTML, 'immediateResult');
      done();
    });
  });
});

describe('changeValue method', () => {
  let inputText = smokeActions.inputText;

  it('works when simple change input value', done => {
    let testInputSelector = 'input#forChangeValue';

    let initialValue = document.querySelector(testInputSelector).value;
    assert.equal(initialValue, 'forChangeValueInitial');

    inputText(testInputSelector, 'value changed!', err => {
      if (err) throw err;

      let newValue = document.querySelector(testInputSelector).value;
      assert.equal(newValue, 'value changed!');
      done();
    });
  });
});

describe('getValue method', () => {

  let getValue = smokeActions.getValue;

  it('works with simple input', done => {
    let testInputSelector = 'input#forGetValue';
    getValue(testInputSelector, (err, value) => {
      assert.isNull(err);
      assert.equal(value, 'forGetValue');
      done();
    });
  });
});

describe('getText method', () => {

  let getText = smokeActions.getText;

  it('works with simple div element with inner text', done => {
    let testDivSelector = 'div#forGetText';
    getText(testDivSelector, (err, text) => {
      assert.isNull(err);
      assert.equal(text, 'forGetText');
      done();
    });
  });
});

describe('findElement method', () => {
  let findElement = smokeActions.findElement;
  it('can be called with element selector', done => {
    findElement('#forFindElementBySelector', (err, element) => {
      assert.isNull(err);
      assert.equal(element.innerHTML, 'expected result one');
      done();
    });
  });

  it('can be called with already found element', done => {
    let foundElement = document.querySelector('#forFindElementByAlreadyFoundElement');
    findElement(foundElement, (err, element) => {
      assert.isNull(err);
      assert.equal(element.innerHTML, 'expected result two');
      done();
    });
  });
});

describe('pickInSelect method', () => {

  let pickInSelect = smokeActions.pickInSelect;

  it('pick by option number', done => {
    pickInSelect('select#forPickInSelectByOptionNumber', 1, err => {
      assert.isNull(err);
      let actualValue = document.querySelector('select#forPickInSelectByOptionNumber').value;
      assert.equal(actualValue, 'mercedez');
      done();
    });
  });

  it('pick by option value', done => {
    pickInSelect('select#forPickInSelectByValue', 'bmw', err => {
      assert.isNull(err);
      let actualValue = document.querySelector('select#forPickInSelectByValue').value;
      assert.equal(actualValue, 'bmw');
      done();
    });
  });

  it('pick by option innerHtml', done => {
    pickInSelect('select#forPickInSelectByInnerHtml', 'Mercedez Benz', err => {
      assert.isNull(err);
      let actualValue = document.querySelector('select#forPickInSelectByInnerHtml').value;
      assert.equal(actualValue, 'mercedez');
      done();
    });
  });
});

describe('promise style usage', () => {
  it('click, getText, change value, click and check getText', done => {
    let click = promisedActions.click;
    let getText = promisedActions.getText;
    let inputText = promisedActions.inputText;

    click('input#forPromiseChainTest')
    .then(() => getText('div#promiseChainSecondDiv'))
    .then(text => inputText('input#promiseChainSecondInput', text))
    .then(() => click('input#promiseChainSecondButton'))
    .then(() => getText('div#promiseChainThirdDiv'))
    .then(text => {
      assert.equal(text, 'promiseChainTextResult1 is given');
      done();
    }).catch(err => {
      if (err) {
        throw err;
      }
    });
  });
});

// attention: nested describes is not synchronized!
describe('can write step-based integration tests', () => {
  let click = smokeActions.click;
  let getText = smokeActions.getText;

  it('step1', done => {
    click('input#forStepsExample', err => {
      if (err) throw err;
      done();
    });
  });

  it('step2', done => {
    click('input#stepsExampleSecondButton', err => {
      if (err) throw err;
      done();
    });
  });

  it('step3', done => {
    click('input#stepsExampleThirdButton', err => {
      if (err) throw err;
      done();
    });
  });

  it('final assert', done => {
    getText('div#stepsExampleLastDiv', (err, text) => {
      if (err) throw err;
      assert.equal(text, 'stepsExampleFinalText');
      done();
    });
  });
});

// todo: add test for focusOn method

// todo: add test for "click" method, that button is not double-clicked

// todo: add tests for check that "click" method handle "a href" link jump + ng-click event
