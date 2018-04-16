'use strict';
/* eslint strict:0 */

let http = require('http');
let express = require('express');

class ExampleHttpServer {
  constructor({port}) {
    this._port = port;
    
    this._app = express();
    this._httpServer = http.createServer(this._app);

    // TODO: LAST: bind methods if needed
    [
      'start',
      'stop'
    ].forEach(fn => this[fn] = this[fn].bind(this));
  }

  getServer() {
    return this._httpServer;
  }

  start() {
    this._app.use(express.static('./'));

    this._httpServer.listen(
      this._port,
      () => console.log(`ExampleHttpServer listening on port ${this._port}`)
    );
  }

  stop() {
    // TODO: stop express server
  }
}

module.exports = ExampleHttpServer;
