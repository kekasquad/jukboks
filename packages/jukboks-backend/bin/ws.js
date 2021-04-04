const io = require('socket.io-client');

const socket = io('ws://127.0.0.1:8080');

socket.on('connect', () => {
  console.log(socket.id);
  socket.emit('stream:join', 'abc');
});
