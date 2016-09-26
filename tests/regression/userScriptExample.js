// ==UserScript==
// @name         Integration smoketest example
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to test over the world!
// @author       evegreen
// @match        http://yourdomainorip.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // add smoketest framework to DOM
  var smoketestFrameworkScript = document.createElement('script');

  // use rawgit.com, cause MIME type of github raw file is incompatible
  // PS: instead of master branch - better to use concrete commit hash or tag
  smoketestFrameworkScript.src = 'https://cdn.rawgit.com/evegreen/smoketest/master/dist/smoketestBundle.js';
  smoketestFrameworkScript.type = 'text/javascript';
  document.body.appendChild(smoketestFrameworkScript);
  document.body.addEventListener('smoketestloaded', () => {

    // our tests
    describe('test group 1', () => {
      it('test 1', done => {
        // expectations
        done();
      });
    });

    describe('test group 2', () => {
      it('test 2', done => {
        // expectations
        done();
      });
    });

  });

})();
