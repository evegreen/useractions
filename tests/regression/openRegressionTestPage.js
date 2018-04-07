'use strict';
/* eslint strict:0 */

let path = require('path');
let opn = require('opn');
let ReportServer = require('./ReportServer');

let browserProcess;

new ReportServer({
  port: 4567,
  handleConnection: runnerWorker => {
    // TODO: shure need eventPayload ?
    runnerWorker.on('mocha-event', ({eventName, eventPayload}) => {
      // TODO: event matching ?
    });

    runnerWorker.on('browser-done', () => {
      closeBrowser();
    });
  },
  handleDisconnect: runnerWorker => {
    closeBrowser();
  }
});

function closeBrowser() {
  if (browserProcess) {
    browserProcess.kill('SIGINT'); // TODO: cons ?
  } else {
    throw new Error('Cannot close empty browser process');
  }
}

let filePath = path.join('file://', __dirname, 'exampleApp.html');
opn(filePath).then(browserChildProcess => {
  browserProcess = browserChildProcess;
});

// TODO: try import and run spec reporter (from mocha) with proxy-runner (need implement it)
