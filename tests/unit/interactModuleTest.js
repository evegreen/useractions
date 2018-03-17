import {assert} from 'chai';
import {click, directClick, event} from '../../src/interactModule';

// stub Event constructor
global.Event = function(eventName, {bubbles, cancelable}) {
  this.type = eventName;
  this.bubbles = bubbles;
  this.cancelable = cancelable;
};

describe('directClick method', () => {
  it('execute .click() function on element directly once', done => {
    let directlyClickedCount = 0;
    let doneCallback = function(err) {
      if (err) throw err;

      assert.equal(directlyClickedCount, 1);
      done();
    };

    let fakeElement = {
      nodeType: 1,
      click: () => {
        directlyClickedCount++;
      }
    };

    directClick(fakeElement, doneCallback);
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

    // act
    event({type: 'myEvent', target: 'fakeSelector'});
  });
});
