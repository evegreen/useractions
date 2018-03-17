'use strict';

/* eslint strict:0 */

import actions from '../../src/actions';
import {assert} from 'chai';
import sinon from 'sinon';

// stub window
global.window = {};

describe('actions', () => {
  describe('runPredicate method', () => {
    let runPredicate = actions.runPredicate;

    it('returns true after predicate returns true', done => {
      let result = runPredicate(() => {
        return true;
      });
      assert.isTrue(result);
      done();
    });

    it('returns false after predicate returns false', done => {
      let result = runPredicate(() => {
        return false;
      });
      assert.isFalse(result);
      done();
    });

    it('returns false after predicate returns nothing', done => {
      let result = runPredicate(() => {
        return;
      });
      assert.isFalse(result);
      done();
    });

    it('returns false after predicate throws error', done => {
      let result = runPredicate(() => {
        throw new Error('lol');
      });
      assert.isFalse(result);
      done();
    });

    it('throws error, if predicate is not function', done => {
      assert.throws(
        () => {
          return runPredicate(5);
        },
        Error,
        'Argument is not predicate function!'
      );
      done();
    });

    // TODO: don't know, what need to be returned if predicate returns
    // object or array ?
  });

  describe('waitState method', () => {
    let waitState = actions.waitState;

    it('throws error without predicate', done => {
      assert.throws(
        () => {
          waitState();
        },
        Error,
        'First argument of waitState is not predicate!'
      );
      done();
    });

    it('throws error without callback', done => {
      assert.throws(
        () => {
          waitState(() => {
            return true;
          });
        },
        Error,
        'Second argument of waitState is not function!'
      );
      done();
    });

    it('runs callback immediately, when predicate is immediately true', done => {
      let startTime = process.hrtime()[1];
      waitState(
        () => true,
        () => {
          let resultTime = process.hrtime()[1] - startTime;
          assert(resultTime < 400000);
          done();
        }
      );
    });

    it('runs callback with null-first argument, when predicate immediately true', done => {
      waitState(
        () => true,
        err => {
          assert.isNull(err);
          done();
        }
      );
    });

    it('runs callback with null-first argument, when predicate is false, then true', done => {
      let results = [false, true];
      let resultIndex = -1;
      let predicate = () => {
        resultIndex++;
        return results[resultIndex];
      };

      waitState(
        predicate,
        err => {
          assert.isNull(err);
          done();
        },
        5,
        2
      );
    });

    it('runs callback with timeout error, when predicate is always false', done => {
      waitState(
        () => false,
        err => {
          assert.typeOf(err, 'error');
          assert.equal(err.message, 'Timeout in waitState occurred!');
          done();
        },
        5,
        2
      );
    });

    it('writes warning, if timeout less then refresh predicate time', done => {
      let consoleWarnSpy = sinon.spy(console, 'warn');
      waitState(() => {}, () => {}, 2, 4);
      let isCalled = consoleWarnSpy.calledWith(
        'Warning: Timeout argument less then refreshTime argument!'
      );
      assert.isTrue(isCalled);
      consoleWarnSpy.restore();
      done();
    });
  });

  describe('findElement method', () => {
    let findElement = actions.findElement;

    it('throws error without arguments', done => {
      assert.throws(
        findElement,
        Error,
        'first argument of findElement() undefined, it must be css selector!'
      );
      done();
    });

    it('throws error with selector argument only', done => {
      assert.throws(
        () => {
          findElement('my selector');
        },
        Error,
        'second argument of findElement() must be timeout number or a callback function!'
      );
      done();
    });

    it('calls cb with null-first(err) argument and found element when called with good selector and callback', done => {
      global.document = {querySelector: () => 'stubElement'};
      let callbackFn = function(err, element) {
        assert.isNull(err);
        assert.equal(element, 'stubElement');
        done();
      };
      findElement('goodSelector', callbackFn);
      global.document = null;
    });
  });

  describe('changeValue method', () => {
    let changeValue = actions.changeValue;
    it('can be called without callback', done => {
      // stub document for findElement method
      let stubInputElement = {value: 'oldValue'};
      global.document = {querySelector: () => stubInputElement};

      changeValue('fakeSelector', 'myNewValue');
      assert.equal(stubInputElement.value, 'myNewValue');

      // restore stubs
      global.document = null;

      done();
    });
  });

  describe('pickInSelect method', () => {
    let pickInSelect = actions.pickInSelect;
    it('can be called without callback', done => {
      // stubs
      let stubSelectElement = {
        value: 'oldValue',
        options: [
          {value: 'toyota'},
          {value: 'nissan'},
          {value: 'mercedez'},
          {value: 'bmw'}
        ]
      };
      global.document = {querySelector: () => stubSelectElement};

      pickInSelect('fakeSelector', 2);
      assert.equal(stubSelectElement.value, 'mercedez');

      // unstub
      global.document = null;

      done();
    });
  });
});
