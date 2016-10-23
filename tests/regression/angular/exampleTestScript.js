'use strict';

var assert = smokeTest.chai.assert;

var smokeActions = smokeTest.actions;

describe('click method', () => {

  let click = smokeActions.click;

  it('can enable checkbox', done => {
    let checkbox = document.querySelector('#forClickOnCheckbox');
    assert.isFalse(checkbox.checked);
    assert.isFalse(angular.element(checkbox).scope().forClickOnCheckbox);
    assert.isFalse(angular.element(checkbox).scope().checkboxPostScriptExecuted);
    click('#forClickOnCheckbox', err => {
      assert.isNull(err);
      assert.isTrue(checkbox.checked);
      assert.isTrue(angular.element(checkbox).scope().forClickOnCheckbox);
      assert.isTrue(angular.element(checkbox).scope().checkboxPostScriptExecuted);
      done();
    });
  });

  it('can click on button once', done => {
    let button = document.querySelector('#buttonForClick');
    assert.equal(angular.element(button).scope().buttonWasClickedCount, 0);
    click('#buttonForClick', err => {
      assert.isNull(err);
      assert.equal(angular.element(button).scope().buttonWasClickedCount, 1);
      done();
    });
  });
});
