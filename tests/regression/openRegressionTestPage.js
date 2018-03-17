'use strict';

/* eslint strict:0 */

let path = require('path');
let opn = require('opn');

let filePath = path.join('file://', __dirname, 'exampleApp.html');
opn(filePath);
