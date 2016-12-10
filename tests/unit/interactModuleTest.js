'use strict';

var assert = require('chai').assert;

const INTERACT_MODULE_PATH = '../../src/interactModule';
var JQUERY_DEFAULT_STUB = {};

describe('directClick method', () => {
  let directClick = require(INTERACT_MODULE_PATH)(JQUERY_DEFAULT_STUB).directClick;
  it('execute .click() function on element directly once', done => {
    let directlyClickedCount = 0;
    let doneCallback = function (err) {
      if (err) throw err;

      assert.equal(directlyClickedCount, 1);
      done();
    };

    let fakeElement = {
      nodeType: 1,
      click: () => { directlyClickedCount++; }
    };

    directClick(fakeElement, doneCallback);
  });
});

describe('triggerEvent method', () => {
  it('can be called without callback', done => {
    // stubs
    let jqueryStub = function (fakeElement) {
      return {
        trigger: function (eventType) {
          fakeElement['on' + eventType]();
        }
      };
    };
    let triggerEvent = require(INTERACT_MODULE_PATH)(jqueryStub).triggerEvent;

    let fakeElement = {
      nodeType: 1,
      onclick: () => {
        setTimeout(done, 5);
      }
    };

    triggerEvent(fakeElement, 'click');
  });
});

describe('click method', () => {
  it('can be called without callback', done => {
    let stubElementWasReturned;
    let eventWasTriggerred;

    // stub document for findElement method
    global.document = {querySelector: () => 'stubElement'};

    let jqueryStub = fakeElement => {
      assert.equal(fakeElement, 'stubElement');
      stubElementWasReturned = true;
      return {
        trigger: eventForProduce => {
          assert.equal(eventForProduce, 'click');
          eventWasTriggerred = true;
        }
      };
    };

    let click = require(INTERACT_MODULE_PATH)(jqueryStub).click;
    click('fakeSelector');

    // asserts
    assert.isTrue(stubElementWasReturned);
    assert.isTrue(eventWasTriggerred);

    // restore stubs
    global.document = null;
    done();
  });
});
