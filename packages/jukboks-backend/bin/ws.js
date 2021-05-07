const io = require('socket.io-client');

const socket = io('ws://127.0.0.1:8080', {
  autoConnect: false,
  transports: ['websocket'],
  auth: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImEiLCJpYXQiOjE2MTkzNTg0NzAsImV4cCI6MTY4MjQ3MzY3MH0.adt4B75AADI_OdmyTRMqFXnIMCFzG6OKFKv8v86n0Ag',
  },
});

socket.prependAny((event, ...args) => {
  console.log(`${event}: ${JSON.stringify(args)}`);
});

socket.on('connect', async () => {
  console.log(socket.id);
  socket.emit('stream:join', 'daI0YrdlydJUCz2z1dAfX');
  setInterval(() => socket.emit('stream:listeners', console.log), 1000);
});

socket.on('connect_error', (err) => {
  console.log(err.message); // not authorized
});

socket.on('disconnect', (reason) => {
  console.log(reason);
});

socket.connect();
