/* eslint-env mocha */

let runnerState = null;
mocha.setup('bdd');
mocha.reporter('json');

// for start tests, just run this function from browser console, or right in test script
// tests must started after test definitions
export function runTests() {
  let mochaBlock = document.createElement('div');
  mochaBlock.id = 'mocha';
  let mainBlock = document.querySelector('#main');
  document.body.insertBefore(mochaBlock, mainBlock);

  runnerState = mocha.run();
}

after(() => {
  let color;
  if (runnerState.stats.failures) {
    color = '#cc0000';
  } else {
    color = '#009900';
  }

  document.querySelector('div#mocha').style.backgroundColor = color;
});
