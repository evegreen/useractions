'use strict';

var assert = require('chai').assert;

var directClick = require('../../src/actions').directClick;

describe('directClick method', () => {
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
