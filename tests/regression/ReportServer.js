let Server = require('socket.io');

class ReportServer {
  constructor({port, handleConnection, handleDisconnect}) {
    let io = Server(port);
    io.on('connection', runnerWorker => {
      console.log('runnerWorker connected');
      handleConnection(runnerWorker);

      // TODO: browser closed? network fail? test it
      runnerWorker.on('disconnect', () => {
        console.log('runnerWorker disconnected');
        handleDisconnect(runnerWorker);
      });
    });
  }
}

module.exports = ReportServer;
