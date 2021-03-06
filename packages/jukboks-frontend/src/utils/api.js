import ky from 'ky';
import { token as tokenStore, username } from './stores';

const API_BASE = process.env.API_BASE;

let tokenValue;

async function initStores() {
  tokenStore.subscribe((value) => {
    tokenValue = value;
  });
  await me();
}

const setAuthorizationHook = (request) => {
  if (tokenValue) {
    request.headers.set('Authorization', `Bearer ${tokenValue}`);
  }
};

const resetTokenHook = async (_request, _options, response) => {
  if (response.status === 401) {
    tokenStore.set('');
  }
};

const client = ky.extend({
  prefixUrl: API_BASE,
  hooks: {
    beforeRequest: [setAuthorizationHook],
    afterResponse: [resetTokenHook],
  },
});

async function login(username, password) {
  const { token } = await client.post('auth/login', { json: { username, password } }).json();
  tokenStore.set(token);
}

async function signup(username, name, password) {
  const { token } = await client.post('auth/signup', { json: { username, name, password } }).json();
  tokenStore.set(token);
}

async function me() {
  const user = await client.get('me').json();
  username.set(user.username);
  return user;
}

async function getStream(uuid) {
  const stream = await client.get(`stream/${uuid}`).json();
  return stream;
}

/**
 *
 * @param {Object} stream
 * @param {Song[]} stream.songs
 * @param {Number} stream.dt_start - unix timestamp, milliseconds
 */
async function createStream(stream) {
  const created = await client.post('stream', { json: stream }).json();
  return created;
}

async function getStreamInfo(uuid) {
  const streamInfo = await client.get(`stream/${uuid}/info`).json();
  return streamInfo;
}

async function sendMessage(uuid, message) {
  await client.post(`stream/${uuid}/message`, { json: { message } });
}

async function sendReaction(uuid, reaction) {
  await client.post(`stream/${uuid}/reaction`, { json: { reaction } });
}

async function getSong(url) {
  const song = await client.post('song', { json: { url } }).json();
  return song;
}

export { initStores, login, signup, me, getStream, createStream, getStreamInfo, sendMessage, sendReaction, getSong };
