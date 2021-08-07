//Imports
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const utils = require('./utils/utils.js');

const authenticationRoutes = require('./routes/authenticationRoutes.js');

const socketHandler = require('./socketHandler');

//Initialization
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Connect to DB
require('./db');

//Settings
app.set('port', 4000);

//Static Files
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

//Routes
app.use(authenticationRoutes);

//Handles a Socket Connection
socketHandler(io);

//Starts Server
server.listen(app.get('port'), () =>
  console.log('WS server online in port', app.get('port'))
);
