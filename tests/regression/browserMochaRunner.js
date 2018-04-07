/* eslint-env mocha */
import io from 'socket.io-client';

let runnerState = null;
mocha.setup('bdd');

// for start tests, just run this function from browser console, or right in test script
// tests must started after test definitions
export function runTests() {
  let mochaBlock = document.createElement('div');
  mochaBlock.id = 'mocha';
  let mainBlock = document.querySelector('#main');
  document.body.insertBefore(mochaBlock, mainBlock);

  let reportServer = io('ws://localhost:4567');
  reportServer.on('connect', () => {
    console.log('connected to report server');
    runnerState = mocha.run();
    let emitOriginal = runnerState.emit;
    let emitWrapper = function (eventName) {
      reportServer.emit('mocha-event', eventName);
      return emitOriginal(...arguments);
    }
  });
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
