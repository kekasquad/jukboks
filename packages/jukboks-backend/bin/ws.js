const io = require('socket.io-client');

const socket = io('ws://127.0.0.1:8080');

socket.prependAny((event, ...args) => {
  console.log(`${event}: ${JSON.stringify(args)}`);
});

socket.on('connect', async () => {
  console.log(socket.id);
  socket.emit('stream:join', 'daI0YrdlydJUCz2z1dAfX');
  setInterval(() => socket.emit('stream:listeners', console.log), 1000);
});
