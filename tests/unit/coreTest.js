'use strict';

var assert = require('chai').assert;

var packageJson = require('../../package.json');

describe('version method', () => {
  let smokeCore = require('../../smokeCore');
  it('outputs full info about bundled libraries', done => {
    let actualVerion = smokeCore.version();
    assert.isTrue(actualVerion.includes(`SmokeTest: ${packageJson.version}`));
    assert.isTrue(actualVerion.includes('Mocha: ???')); // TODO
    assert.isTrue(actualVerion.includes(`JQuery: ${packageJson.devDependencies.jquery}`));
    assert.isTrue(actualVerion.includes(`Chai: ${packageJson.devDependencies.chai}`));
    assert.isTrue(actualVerion.includes(`Alertify: ${packageJson.devDependencies['alertify.js']}`));
    done();
  });
});
