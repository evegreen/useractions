'use strict';

var assert = require('chai').assert;

var directClick = require('../../src/actions').directClick;

var HtmlElementStub = require('./stubs').HtmlElementStub;

describe('directClick method', () => {
  it('execute .click() function on element directly once', done => {
    // stubs
    global.HTMLElement = HtmlElementStub;  // will match

    let directlyClickedCount = 0;
    let doneCallback = function (err) {
      if (err) throw err;

      assert.equal(directlyClickedCount, 1);

      // restore stubs
      global.HTMLElement = null;
      done();
    };

    let fakeElement = new HtmlElementStub();
    fakeElement.click = function () {
      directlyClickedCount++;
    };

    directClick(fakeElement, doneCallback);
  });
});
