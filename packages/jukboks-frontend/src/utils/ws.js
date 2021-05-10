import { io } from 'socket.io-client';
import { plays, song, message, reaction, listeners, token as tokenStore } from './stores';

const WS_BASE = 'ws://localhost:8080';

const EVENTS = {
  STREAM_JOIN: 'stream:join',
  STREAM_STARTED: 'stream:started',
  STREAM_LISTENERS: 'stream:listeners',
  STREAM_ENDED: 'stream:ended',
  STREAM_MESSAGE: 'stream:message',
  STREAM_REACTION: 'stream:reaction',
  SONG_STARTED: 'song:started',
};

let tokenValue;

tokenStore.subscribe((value) => {
  tokenValue = value;
});

const socket = io(WS_BASE, {
  transports: ['websocket'],
  autoConnect: false,
  auth: {
    token: tokenValue,
  },
});

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

socket.on(EVENTS.STREAM_ENDED, (...args) => {
  plays.set(false);
});

socket.on(EVENTS.SONG_STARTED, (newSong) => {
  song.set(newSong);
  if (newSong.offset) {
    plays.set(true);
  }
});

socket.on(EVENTS.STREAM_MESSAGE, (newMessage) => {
  message.set(newMessage);
});

socket.on(EVENTS.STREAM_REACTION, (newReaction) => {
  reaction.set(newReaction);
});

socket.on(EVENTS.STREAM_LISTENERS, (newListeners) => {
  listeners.set(newListeners);
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

function join(uuid) {
  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      reject('Socket is not connected');
    }
    socket.emit(EVENTS.STREAM_JOIN, uuid, resolve);
    socket.io.on('reconnect', () => {
      socket.emit(EVENTS.STREAM_JOIN, uuid, () => {});
    });
  });
}

function getListeners() {
  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      reject('Socket is not connected');
    }
    socket.emit(EVENTS.STREAM_LISTENERS, resolve);
  });
}

export { connect, join, getListeners };
