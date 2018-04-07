'use strict';
/* eslint strict:0 */

let path = require('path');
let opn = require('opn');
let ReportServer = require('./ReportServer');

let browserProcess;

new ReportServer({
  port: 4567,
  handleConnection: runnerWorker => {
    runnerWorker.on('mocha-event', eventName => {
      console.log(eventName);
      // TODO: event matching ?
      // TODO: create fake mochaRunner or modify exists runner ?
    });

    runnerWorker.on('browser-done', () => {
      closeBrowser();
    });
  },
  handleDisconnect: () => {
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
