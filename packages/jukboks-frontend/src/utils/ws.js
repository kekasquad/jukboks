import { io } from 'socket.io-client';

const WS_BASE = 'ws://localhost:8080';

const EVENTS = {
  STREAM_JOIN: 'stream:join',
};

const socket = io(WS_BASE, { transports: ['websocket'], autoConnect: false });

socket.on('connect', () => {
  console.log('conected, socket id: ' + socket.id);
});

socket.on('disconnect', () => {
  console.log('disconnected from socket');
});

socket.prependAny((event, ...args) => {
    console.log(`${event}: ${JSON.stringify(args)}`);
})

function connect() {
  return new Promise((resolve, reject) => {
    const connectHandler = socket.on('connect', () => {
      socket.off('connect', connectHandler);
      resolve();
    });
    const connectErrorhandler = socket.on('connect_error', (error) => {
      socket.off('connect_error', connectErrorhandler);
      reject("Can't connect to WS endpoint\n" + error.message);
    });
    socket.connect();
  });
}

async function join(uuid) {
  if (!socket.connected) {
    throw new Error('Socket is not connected');
  }
  socket.emit(EVENTS.STREAM_JOIN, uuid);
}

export { connect, join };
