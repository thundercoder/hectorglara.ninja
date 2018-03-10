'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _api = require('./server/routes/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// Parsers for POST data


// Get our API routes
// Get dependencies
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// Point static path to dist
app.use(_express2.default.static('dist'));

// Set our api routes
app.use('/api', _api2.default);

// Catch all other routes and return the index file
app.get('/*', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, 'index.html'));
});

/**
 * Get port from environment and store in Express.
 */
var port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = _http2.default.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function () {
  return console.log('API running on localhost: ' + port);
});