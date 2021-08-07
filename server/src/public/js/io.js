//Initialize SocketIO
const socket = io();

//DOM Selections
const chatForm = document.querySelector('#chat-form');
const chat = document.querySelector('.chat');
const createRoomBtn = document.querySelector('#create-room');
const body = document.querySelector('body');

let Rooms = [];
let Users = [];
let currentRoom = [];

//Handles messages sent by the server
socket.on('message', message => {
  outputMessage(message);

  //Scroll to Down
  chat.scrollTop = chat.scrollHeight;
});

socket.on('update-rooms', roomsList => {
  Rooms = roomsList;
  console.log(roomsList);
  const RoomsList = document.querySelector('.Rooms-List');
  RoomsList.innerHTML = '';
  Rooms.map(room => {
    const roomItem = document.createElement('div');
    roomItem.classList.add('room-item');
    console.log(room);
    roomItem.innerHTML = `<a href="#" ondblclick=joinRoom('${room.name.toString()}') class="room-item-link"><div>${
      room.name
    }</div></a>`;
    RoomsList.appendChild(roomItem);
  });
});

socket.on('update-users', userList => {
  Users = userList;
  console.log(userList);
  const UserList = document.querySelector('.Users-List');
  UserList.innerHTML = '';
  Users.forEach(user => {
    const userItem = document.createElement('div');
    userItem.classList.add('room-item');
    userItem.innerHTML = `<a href="#" ondblclick=joinRoom('"${user.toString()}"') class="room-item-link"><div>${user}</div></a>`;
    UserList.appendChild(userItem);
  });
});

function joinRoom(room) {
  socket.emit('join-room', room);
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const msg = e.srcElement[0].value;

  if (msg === '') return;

  console.log(msg);
  socket.emit('chat-msg', msg);

  e.srcElement[0].value = '';
  e.srcElement[0].focus();
});

createRoomBtn.addEventListener('click', e => {
  e.preventDefault();

  const createRoomModal = document.createElement('div');
  createRoomModal.classList.add('create-room-modal-container');
  createRoomModal.innerHTML = `<div class="create-room-modal-content">
        <div class="modal-header">
        <h1 class="title">Create Room</h1>
        </div> 
        <div class="field">
        <input placeholder="" type="text" id="roomName" autocomplete="off" class="input" maxlength="20">
        <label for="roomName" class="label">Room Name... </label>
        </div>
        <div class="field">
        <input placeholder="" type="password" id="roomPassword" autocomplete="off" class="input" style="font-family:arial">
        <label for="roomPassword" class="label">Room Password... </label>
        </div>
        <div class="modal-options">
        <button onclick="closeModal()" class="btn btn-danger" > Cancel </button>
        <button onclick="createRoom()" class="btn btn-succes" type="submit"> Create </button>
        </div>
        </div>`;

  body.firstChild.before(createRoomModal);
});

function createRoom() {
  let roomName = document.getElementById('roomName').value;
  roomName = String(roomName).trim();
  console.log(Rooms, 'Inside Crateroom');
  let exist = false;
  for (i in Rooms) {
    if (Rooms[i].name == roomName) {
      exist = true;
    }
  }
  if (exist) return console.log('Already Exist a Room with that name');

  if (roomName === '') return console.log('No channel name given');

  socket.emit('create-room', roomName);

  closeModal();
}

function closeModal() {
  body.firstChild.remove();
}

function outputMessage(message) {
  const { user, text, time } = message;

  const msgContainer = document.createElement('div');
  msgContainer.classList.add('message-container');
  msgContainer.innerHTML = ` <span class="message-user">${user}</span> -
    <span class="message-time">${time}</span>
    <hr>
    <p class="message-text">${text}</p>`;

  chat.appendChild(msgContainer);
}
