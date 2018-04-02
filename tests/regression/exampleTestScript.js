/*
 * TODO:
 * - review eslint disabling comments
 * - build testing page (e.g. target resource)
 * - run node server with socket.io receiver
 * - server must "opn" testing page
 * - try to use two reporters (html, json) / json only
 * - send json-result to node server via socket.io
 * - can i close browser page with javascript only ?
 * - optional: can i run many browser pages with "opn" in differrent browser windows ?
 * - get result in node server and print in in console with error codes?
 *   - need use mocha package or mocha standart reporter only?
 *
 */

/* eslint-env mocha */

import {assert} from 'chai';

let actions = userActions; // eslint-disable-line no-undef
let promisedActions = actions.promised;

let runnerState = null;
mocha.setup('bdd');

after(() => {
  let color;
  if (runnerState.stats.failures) {
    color = 'red';
  } else {
    color = 'green';
  }

  document.querySelector('div#mocha').style.backgroundColor = color;
});

describe('click method', () => {
  let click = actions.click;

  it('works when check immediate result after click', done => {
    let resultSelector = 'div#immediateResult';

    // check element doesn't exist before click
    let emptyImmediateResult = document.querySelector(resultSelector);
    assert.isNull(emptyImmediateResult);

    click('input#immediateResultButton', err => {
      assert.isNull(err);

      // check exists after click
      let immediateResult = document.querySelector(resultSelector);
      assert.equal(immediateResult.id, 'immediateResult');
      assert.equal(immediateResult.innerHTML, 'immediateResult');
      done();
    });
  });

  it('can click on button once', done => {
    // than variable has raght in application, no need to declare it
    assert.equal(window.onceButtonWasClickedCount, 0);
    click('#forClickOnButtonOnce', err => {
      assert.isNull(err);
      assert.equal(window.onceButtonWasClickedCount, 1);
      done();
    });
  });
});

describe('directClick method', () => {
  let directClick = actions.directClick;
  it('can enable simple checkbox', done => {
    let checkbox = document.querySelector('#forDirectClickOnCheckbox');
    assert.isFalse(checkbox.checked);
    directClick(checkbox, err => {
      assert.isNull(err);
      assert.isTrue(checkbox.checked);
      done();
    });
  });
});

describe('focusOn method', () => {
  let focusOn = actions.focusOn;
  it('can focus on text input', done => {
    let textInput = document.querySelector('#forFocusOn');
    assert.notEqual(document.activeElement.id, textInput.id);
    focusOn(textInput, err => {
      assert.isNull(err);
      assert.equal(document.activeElement.id, textInput.id);
      done();
    });
  });
});

describe('blur method', () => {
  let blur = actions.blur;
  let focusOn = actions.focusOn;
  it('can focus off text input', done => {
    let textInput = document.querySelector('#forBlur');
    assert.notEqual(document.activeElement.id, textInput.id);
    focusOn(textInput, err => {
      assert.isNull(err);
      assert.equal(document.activeElement.id, textInput.id);
      blur(textInput, err => {
        assert.isNull(err);
        assert.notEqual(document.activeElement.id, textInput.id);
        done();
      });
    });
  });
});

describe('changeValue method', () => {
  let changeValue = actions.changeValue;

  it('works when simple change input value', done => {
    let testInputSelector = 'input#forChangeValue';

    let initialValue = document.querySelector(testInputSelector).value;
    assert.equal(initialValue, 'forChangeValueInitial');

    changeValue(testInputSelector, 'value changed!', err => {
      if (err) throw err;

      let newValue = document.querySelector(testInputSelector).value;
      assert.equal(newValue, 'value changed!');
      done();
    });
  });
});

describe('getValue method', () => {
  let getValue = actions.getValue;

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
  let getText = actions.getText;

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
  let findElement = actions.findElement;
  it('can be called with element selector', done => {
    findElement('#forFindElementBySelector', (err, element) => {
      assert.isNull(err);
      assert.equal(element.innerHTML, 'expected result one');
      done();
    });
  });

  it('can be called with already found element', done => {
    let foundElement = document.querySelector(
      '#forFindElementByAlreadyFoundElement'
    );
    findElement(foundElement, (err, element) => {
      assert.isNull(err);
      assert.equal(element.innerHTML, 'expected result two');
      done();
    });
  });
});

describe('pickInSelect method', () => {
  let pickInSelect = actions.pickInSelect;

  it('pick by option number', done => {
    pickInSelect('select#forPickInSelectByOptionNumber', 1, err => {
      assert.isNull(err);
      let actualValue = document.querySelector(
        'select#forPickInSelectByOptionNumber'
      ).value;
      assert.equal(actualValue, 'mercedez');
      done();
    });
  });

  it('pick by option value', done => {
    pickInSelect('select#forPickInSelectByValue', 'bmw', err => {
      assert.isNull(err);
      let actualValue = document.querySelector('select#forPickInSelectByValue')
        .value;
      assert.equal(actualValue, 'bmw');
      done();
    });
  });

  it('pick by option innerHtml', done => {
    pickInSelect('select#forPickInSelectByInnerHtml', 'Mercedez Benz', err => {
      assert.isNull(err);
      let actualValue = document.querySelector(
        'select#forPickInSelectByInnerHtml'
      ).value;
      assert.equal(actualValue, 'mercedez');
      done();
    });
  });
});

describe('promise style usage', () => {
  it('click, getText, change value, click and check getText', done => {
    let click = promisedActions.click;
    let getText = promisedActions.getText;
    let changeValue = promisedActions.changeValue;

    click('input#forPromiseChainTest')
      .then(() => getText('div#promiseChainSecondDiv'))
      .then(text => changeValue('input#promiseChainSecondInput', text))
      .then(() => click('input#promiseChainSecondButton'))
      .then(() => getText('div#promiseChainThirdDiv'))
      .then(text => {
        assert.equal(text, 'promiseChainTextResult1 is given');
        done();
      })
      .catch(err => {
        if (err) {
          throw err;
        }
      });
  });
});

// WARNING: nested describes is not synchronized!
describe('can write step-based integration tests', () => {
  let click = actions.click;
  let getText = actions.getText;

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

// for start tests, just run this function from browser console, or right in test script
function runTests() {
  let mochaBlock = document.createElement('div');
  mochaBlock.id = 'mocha';
  let mainBlock = document.querySelector('#main');
  document.body.insertBefore(mochaBlock, mainBlock);

  runnerState = mocha.run();
}

// in this example, we will run tests automatically
runTests();
