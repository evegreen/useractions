'use strict';

var HtmlElementStub = require('./stubs').HtmlElementStub;

describe('HtmlElementStub', () => {
  it('instance matches', done => {
    let fakeMatchesElement = new HtmlElementStub();
    if (fakeMatchesElement instanceof HtmlElementStub) {
      done();
    } else {
      throw new Error('not matches =(');
    }
  });

  it('string not matches', done => {
    let string = 'abc';
    if (string instanceof HtmlElementStub) {
      throw new Error('why matches ? =(');
    } else {
      done();
    }
  });
});
