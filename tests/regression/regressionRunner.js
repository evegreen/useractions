'use strict';
/* eslint strict:0 */

let path = require('path');
let opn = require('opn');
let ReportSocketServer = require('./ReportServer');
let ExampleHttpServer = require('./ExampleHttpServer');

const SERVER_PORT = 27000;

let browserProcess;

let exampleHttpServer = new ExampleHttpServer({
  port: SERVER_PORT
});
let httpServer = exampleHttpServer.getServer();
new ReportSocketServer({
  httpServer: httpServer,
  handleConnection: runnerWorker => {
    runnerWorker.on('mocha-event', eventName => {
      console.log(eventName);
      // TODO: event matching ?
      // TODO: create fake mochaRunner or modify exists runner ?
    });

    runnerWorker.on('browser-done', closeBrowserAndServer);
  },
  handleDisconnect: closeBrowserAndServer
});

opn('http://localhost:27000/tests/regression/exampleApp.html').then(browserChildProcess => {
  browserProcess = browserChildProcess;
});

// TODO: try import and run spec reporter (from mocha) with proxy-runner (need implement it)


function closeBrowserAndServer() {
  if (!browserProcess) {
    throw new Error('Cannot close empty browser process');
  }

  if (!httpServer) {
    throw new Error('Cannot stop empty http server');
  }

  browserProcess.kill('SIGINT'); // TODO: cons ?  
  httpServer.close();
}
