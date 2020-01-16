"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _socket = _interopRequireDefault(require("socket.io"));

var _index = _interopRequireDefault(require("./routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var port = process.env.PORT || 4001;
var app = (0, _express["default"])();
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*'); // Request methods you wish to allow

  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request headers you wish to allow

  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)

  res.setHeader('Access-Control-Allow-Credentials', false); // Pass to next layer of middleware

  next();
});
app.use(_index["default"]);

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server); // < Interesting!

io.origins('*.*');
io.on('connection', function (socket) {
  var room;
  console.log('New client connected');
  socket.emit('hello world', 'this is working!');
  socket.on('prepare', function (data) {
    socket.broadcast.to(room).emit('prepare', data);
  });
  socket.on('disconnect', function () {
    return console.log('Client disconnected');
  });
});
server.listen(port, function () {
  return console.log("Listening on port ".concat(port));
});