'use strict';

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var smokeActions = require('../../smokeActions');

describe('smoke actions', () => {
  describe('runPredicate method', () => {
    let runPredicate = smokeActions.runPredicate;

    it('returns true after predicate returns true', done => {
      let result = runPredicate(() => {return true;});
      expect(result).to.equal(true);
      done();
    });

    it('returns false after predicate returns false', done => {
      let result = runPredicate(() => {return false;});
      expect(result).to.equal(false);
      done();
    });

    it('returns false after predicate returns nothing', done => {
      let result = runPredicate(() => {return;});
      expect(result).to.equal(false);
      done();
    });

    it('returns false after predicate throws error', done => {
      let result = runPredicate(() => {throw new Error('lol');});
      expect(result).to.equal(false);
      done();
    });

    it('throws error, if predicate is not function', done => {
      expect(() => {
        return runPredicate(5);
      }).to.throw(Error, 'Argument is not predicate function!');
      done();
    });

    // todo: don't know, what need to be returned if predicate returns
    // object or array ?
  });

  describe('waitState method', () => {
    let waitState = smokeActions.waitState;

    it('throws error without predicate', done => {
      expect(() => {
        waitState();
      }).to.throw(Error, 'First argument of waitState is not predicate!');
      done();
    });

    it('throws error without callback', done => {
      expect(() => {
        waitState(() => {return true;});
      }).to.throw(Error, 'Second argument of waitState is not function!');
      done();
    });

    it('runs callback immediately, when predicate is immediately true', done => {
      let startTime = process.hrtime()[1];
      waitState(() => true, () => {
        let resultTime = process.hrtime()[1] - startTime;
        expect(resultTime).to.be.below(400000);
        done();
      });
    });

    it('runs callback with null-first argument, when predicate immediately true', done => {
      waitState(() => true, err => {
        expect(err).to.equal(null);
        done();
      });
    });

    it('runs callback with null-first argument, when predicate is false, then true', done => {
      let results = [false, true];
      let resultIndex = -1;
      let predicate = () => {
        resultIndex++;
        return results[resultIndex];
      };

      waitState(predicate, err => {
        expect(err).to.equal(null);
        done();
      }, 5, 2);
    });

    it('runs callback with timeout error, when predicate is always false', done => {
      waitState(() => false, err => {
        expect(err).to.be.an('error');
        expect(err.message).to.equal('Timeout in waitState occurred!');
        done();
      }, 5, 2);
    });

    it('writes warning, if timeout less then refresh predicate time', done => {
      let consoleWarnSpy = sinon.spy(console, 'warn');
      waitState(() => {}, () => {}, 2, 4);
      let isCalled = consoleWarnSpy.calledWith('Warning: Timeout argument less then refreshTime argument!');
      assert.isTrue(isCalled);
      consoleWarnSpy.restore();
      done();
    });

    // todo: add tests on callback with arguments
  });

  describe('findElement method', () => {
    let findElement = smokeActions.findElement;

    it('throws error without arguments', done => {
      expect(findElement)
          .to.throw(Error, 'first argument of findElement() undefined, it must be css selector!');
      done();
    });

    it('throws error with selector argument only', done => {
      expect(() => {
        findElement('my selector');
      }).to.throw(Error, 'second argument of findElement() must be timeout number or a callback function!');
      done();
    });

    it('runs cb with null-first argument and element in second argument with good selector and callback', done => {
      global.document = {querySelector: () => 'stubElement'};
      let callbackFn = function (err, element) {
        assert.isNull(err);
        assert.equal(element, 'stubElement');
        done();
      };
      findElement('goodSelector', callbackFn);
      global.document = null;
    });

    /*
    it('runs cb with null-first argument with good selector, timeout and callback', done => {
      // todo ...
    });
    */

    // todo: add tests for wrong selector passed. need check error
  });

  describe('click method', () => {
    let click = smokeActions.click;

    // todo: if u know how to stub jquery with sinon,
    // please send pull-request or message to me,
    // i will really appreciate that help
    it('can be called without callback', done => {
      let stubElementWasReturned;
      let eventWasTriggerred;

      // stub document for findElement method
      global.document = {querySelector: () => 'stubElement'};

      // stub jquery
      let fakeJquery = fakeElement => {
        assert.equal(fakeElement, 'stubElement');
        stubElementWasReturned = true;
        return {
          trigger: eventForProduce => {
            assert.equal(eventForProduce, 'click');
            eventWasTriggerred = true;
          }
        };
      };

      smokeActions.___jquerySetter(fakeJquery);

      click('fakeSelector');

      // asserts
      assert.isTrue(stubElementWasReturned);
      assert.isTrue(eventWasTriggerred);
      done();

      // restore stubs
      smokeActions.___jqueryRestore();
      global.document = null;
    });
  });

  describe('inputText method', () => {
    it('can be called without callback', done => {
      // todo 9 ...
      done();
    });
  });

  describe('focusOn method', () => {
    it('can be called without callback', done => {
      // todo 9 ...
      done();
    });
  });

  describe('blur method', () => {
    it('can be called without callback', done => {
      // todo 9 ...
      done();
    });
  });

  describe('selectInSelect method', () => {
    it('can be called without callback', done => {
      // todo 9 ...
      done();
    });
  });
});
