'use strict';

var assert = require('chai').assert;

describe('version method', () => {
  let smokeCore = require('./smokeCore');
  it('outputs full info about bundled libraries', done => {
    // stub
    let standartConsoleLog = console.log;
    let stubLog;
    console.log = (arg) => {stubLog = arg};

    smokeCore.version();

    assert.isTrue(stubLog.includes(`SmokeTest: ${packageJson.version}`));
    assert.isTrue(stubLog.includes(`Mocha: ???`)); // TODO
    assert.isTrue(stubLog.includes(`JQuery: ${packageJson.devDependencies.jquery}`));
    assert.isTrue(stubLog.includes(`Chai: ${packageJson.devDependencies.chai}`));
    assert.isTrue(stubLog.includes(`Alertify: ${packageJson.devDependencies['alertify.js']}`));

    // unstub
    console.log = standartConsoleLog;
    done();
  });
});
