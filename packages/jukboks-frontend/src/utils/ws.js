import { io } from 'socket.io-client';
import { plays, song } from './stores';

const WS_BASE = 'ws://localhost:8080';

const EVENTS = {
  STREAM_JOIN: 'stream:join',
  STREAM_STARTED: 'stream:started',
  SONG_STARTED: 'song:started',
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
});



socket.on(EVENTS.STREAM_STARTED, (...args) => {
  plays.set(true);
});

socket.on(EVENTS.SONG_STARTED, (newSong) => {
  song.set(newSong);
});

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
