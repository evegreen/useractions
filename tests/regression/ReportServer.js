let socketIoServer = require('socket.io');

/*
  TODO: is javascript freezes in inactive tab, when socket.io works through:
  - http (must do?)
  - websockets (must not do?)
*/

class ReportServer {
  constructor({httpServer, handleConnection, handleDisconnect}) {
    let io = socketIoServer(httpServer);
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
