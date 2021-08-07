const utils = require('./utils/utils.js');
const botName = 'ChatBot';
let roomsList = [{ name: 'Lobby', length: 0 }];
let userList = [];

module.exports = function IO(io) {
  io.on('connection', async socket => {
    //Add to the socket a property called << username >> that for further usage
    socket.username = utils.cookieFormater(
      socket.handshake.headers.cookie
    ).username;
    userList.push(socket.username);
    socket.join('Lobby');
    socket.currentRoom = 'Lobby';

    //Emits Welcome message to te new conneted socket
    socket.emit(
      'message',
      utils.formatMessage(botName, 'Welcome to the chat.')
    );

    //Emits to the new user all the existing Rooms and the User Connected
    socket.emit('update-rooms', roomsList);
    io.emit('update-users', userList);

    //Broadcast to all connected socket the new connected user
    socket
      .to(socket.currentRoom)
      .broadcast.emit(
        'message',
        utils.formatMessage(botName, `${socket.username} Joined the Chat`)
      );

    //Handles the client message sent to the chat
    socket.on('chat-msg', msg => {
      io.to(socket.currentRoom).emit(
        'message',
        utils.formatMessage(
          utils.cookieFormater(socket.handshake.headers.cookie).username,
          msg
        )
      );
    });

    //Creates Rooms
    socket.on('create-room', async roomName => {
      await roomsList.push({ name: roomName, length: 0 });
      io.emit('update-rooms', roomsList);
      await socket.leave(socket.currentRoom);
      roomsList.map(e => {
        if (e.name == socket.currentRoom) {
          e.length -= 1;
        }
      });

      await socket.join(roomName);
      socket.currentRoom = roomName;
      roomsList.map(e => {
        if (e.name == socket.currentRoom) {
          e.length += 1;
        }
      });
    });

    //Join Rooms
    socket.on('join-room', async roomName => {
      await socket.leave(socket.currentRoom);
      roomsList.map(e => {
        if (e.name == socket.currentRoom) {
          e.length -= 1;
        }
      });
      await socket.join(roomName);
      io.to(roomName).emit(
        'message',
        utils.formatMessage(botName, `${socket.username} Joined the Room`)
      );
      socket.currentRoom = roomName;
      roomsList.map(e => {
        if (e.name == socket.currentRoom) {
          e.length += 1;
        }
      });
    });

    //Handles when a socket disconnect and broadcast it to the connected Sockets
    socket.on('disconnect', () => {
      io.to(socket.currentRoom).emit(
        'message',
        utils.formatMessage(botName, `${socket.username} Left the Chat`)
      );
      userList = userList.filter(u => {
        return u != socket.username;
      });
      io.emit('update-users', userList);
    });
  });
};
