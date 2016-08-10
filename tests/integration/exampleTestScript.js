'use strict';

var expect = smokeTest.chai.expect;

var smokeActions = smokeTest.actions;
var promisedActions = smokeActions.promised;

describe('click method', () => {

  let click = smokeActions.click;

  it('works when check immediate result after click', done => {
    let immediateResultButtonSelector = 'input#immediateResultButton';
    let resultSelector = 'div#immediateResult';

    // check element doesn't exist before click
    let emptyImmediateResult = document.querySelector(resultSelector);
    expect(emptyImmediateResult).to.equal(null);

    click(immediateResultButtonSelector, err => {
      if (err) throw err;

      // check exists after click
      let immediateResult = document.querySelector(resultSelector);

      expect(immediateResult.id).to.equal('immediateResult');
      expect(immediateResult.innerHTML).to.equal('immediateResult');
      done();
    });
  });
});

describe('changeValue method', () => {
  let inputText = smokeActions.inputText;

  it('works when simple change input value', done => {
    let testInputSelector = 'input#forChangeValue';

    let initialValue = document.querySelector(testInputSelector).value;
    expect(initialValue).to.equal('forChangeValueInitial');

    inputText(testInputSelector, 'value changed!', err => {
      if (err) throw err;

      let newValue = document.querySelector(testInputSelector).value;
      expect(newValue).to.equal('value changed!');
      done();
    });
  });
});

describe('getValue method', () => {

  let getValue = smokeActions.getValue;

  it('works with simple input', done => {
    let testInputSelector = 'input#forGetValue';
    getValue(testInputSelector, (err, value) => {
      expect(err).to.equal(null);
      expect(value).to.equal('forGetValue');
      done();
    });
  });
});

describe('getText method', () => {

  let getText = smokeActions.getText;

  it('works with simple div element with inner text', done => {
    let testDivSelector = 'div#forGetText';
    getText(testDivSelector, (err, text) => {
      expect(err).to.equal(null);
      expect(text).to.equal('forGetText');
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
      expect(text).to.equal('promiseChainTextResult1 is given');
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
      expect(text).to.equal('stepsExampleFinalText');
      done();
    });
  });
});

// todo: add test for focusOn method
