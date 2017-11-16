'use strict';

var assert = require('chai').assert;

const INTERACT_MODULE_PATH = '../../src/interactModule';

// stub Event constructor
global.Event = function(eventName, {bubbles, cancelable}) {
  this.type = eventName;
  this.bubbles = bubbles;
  this.cancelable = cancelable;
};

describe('directClick method', () => {
  let directClick = require(INTERACT_MODULE_PATH)().directClick;
  it('execute .click() function on element directly once', done => {
    let directlyClickedCount = 0;
    let doneCallback = function(err) {
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
    let jqueryStub = function(fakeElement) {
      return {
        trigger: function(eventType) {
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
    // arrange
    let fakeElement = {
      dispatchEvent: event => {
        // assert
        assert.equal(event.type, 'click');
        assert.equal(event.bubbles, true);
        assert.equal(event.cancelable, true);
        done();
      }
    };
    global.document = {querySelector: () => fakeElement};
    let click = require(INTERACT_MODULE_PATH)().click;

    // act
    click('fakeSelector');

    // restore stubs
    global.document = null;
  });
});

describe('event method', () => {
  it('dispatches on element', done => {
    // arrange
    let fakeElement = {
      dispatchEvent: event => {
        // assert
        assert.equal(event.type, 'myEvent');
        assert.equal(event.bubbles, true);
        assert.equal(event.cancelable, true);
        done();
      }
    };
    global.document = {querySelector: () => fakeElement};
    let event = require(INTERACT_MODULE_PATH)().event;

    // act
    event({type: 'myEvent', target: 'fakeSelector'});
  });
});
