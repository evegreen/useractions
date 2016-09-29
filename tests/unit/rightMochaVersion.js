'use strict';

var chai = require('chai');
var assert = chai.assert;
var AssertionError = chai.AssertionError;

describe('Mocha framework', () => {
  let fs = require('fs');
  let path = require('path');

  let smokeCoreFile = fs.readFileSync('smokeCore.js', 'utf8');
  let specifiedMochaPath = simpleParse(smokeCoreFile, 'var mocha = require(\'', '/browser-entry\').mocha;');

  it('Checkouted from repository, not from npm or bower', done => {
    try {
      // if mocha installed from bower, than read package.json will failed
      let mochaPackageJsonFilePath = path.join(specifiedMochaPath, 'package.json');

      // if "_id" present, that mocha downloaded from npm
      let mochaPackageJson = JSON.parse(fs.readFileSync(mochaPackageJsonFilePath, 'utf8'));
      assert.isUndefined(mochaPackageJson._id, undefined);
    } catch (err) {
      if (err instanceof AssertionError || err.message.includes('ENOENT')) {
        throw new Error('Need checkout mocha framework from repository, not from npm or bower');
      }

      throw err;
    }

    done();
  });

  it('Checkouted checked and successfully tested version', done => {
    let getLastCommitCmd = `cd ${specifiedMochaPath};
    git log --pretty=format:"{\"hash\": \"%h\", \"author\": \"%an\", \"msg\": \"%s\"}" -1`;

    let execCmd = require('child_process').exec;
    execCmd(getLastCommitCmd, (err, stdout, stderr) => {
      assert.isNull(err);
      assert.equal(stderr, '');
      assert.equal(stdout, '{hash: 9915dfb, author: Christopher Hiller, msg: Release v3.1.0}');
      done();
    });
  });

  it('"npm install" was executed on checkouted mocha', function (done) {
    this.timeout(8000);
    let mochaNodeModulesDirectoryPath = path.join(specifiedMochaPath, 'node_modules');
    // if (fs.existsSync(mochaNodeModulesDirectoryPath)) {
      // done();
    // } else {
      // throw new Error('Maybe you forget execute "npm install" in mocha repo');
    // }

    let nodeModulesExists = fs.existsSync(mochaNodeModulesDirectoryPath);
    if (!nodeModulesExists) {
      throw new Error('Maybe you forget execute "npm install" in mocha repo');
    }

    let checkInstalledMochaDependencies = `cd ${specifiedMochaPath};
    npm list --depth=0`;

    let execCmd = require('child_process').exec;
    execCmd(checkInstalledMochaDependencies, err => {
      if (err) {
        let errString = err.toString();
        if (errString.includes('UNMET DEPENDENCY') || errString.includes('extraneous') ||
        errString.includes('invalid')) {
          throw new Error('Mocha installed dependencies is deprecated, delete node_modules and rerun "npm install" in mocha repo again');
        }
      } else {
        done();
      }
    });
  });
});

function simpleParse (srcText, beginText, endText) {
  let result = srcText.substring(srcText.indexOf(beginText) + beginText.length);
  return result.substring(0, result.indexOf(endText));
}
