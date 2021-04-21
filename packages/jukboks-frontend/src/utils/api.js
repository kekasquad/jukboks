import { navigate } from 'svelte-navigator';
import ky from 'ky';
import { token as tokenStore, user } from './stores.js';

const API_BASE = 'http://localhost:8080';

let tokenValue;

function subscribe() {
  tokenStore.subscribe((value) => {
    tokenValue = value;
  });
}

const authHook = (request) => {
  if (tokenValue) {
    request.headers.set('Authorization', `Bearer ${tokenValue}`);
  }
};

const client = ky.extend({
  prefixUrl: API_BASE,
  hooks: {
    beforeRequest: [authHook],
  },
});

async function login2(login, password) {
  const { token } = await client.post('/auth/login', { json: { login, password } }).json();
  tokenStore.set(token);
  // ???? naviagte
}

async function signup2(login, name, password) {
  const { token } = await client.post('/auth/signup');
}

async function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  if (username.length > 0 && password.length > 0) {
    let json = JSON.stringify({
      username,
      password,
    });

    try {
      const res = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
      });

      json = await res.json();

      if (!res.ok) {
        throw new Error(json.message);
      }

      localStorage.setItem('token', json.token);
      token.set(localStorage.getItem('token'));
      navigate('/profile', { replace: true });
    } catch (e) {
      alert(e);
    }
  } else {
    alert('Fill all fields to login');
  }
}

async function signUp() {
  let username = document.getElementById('username').value;
  let name = document.getElementById('name').value;
  let password = document.getElementById('password').value;

  if (username.length > 0 && name.length > 0 && password.length > 0) {
    let json = JSON.stringify({
      username,
      password,
      name,
    });

    try {
      const res = await fetch(API_BASE + '/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
      });

      json = await res.json();

      if (!res.ok) {
        throw new Error(json.message);
      }

      localStorage.setItem('token', json.token);
      token.set(localStorage.getItem('token'));
      navigate('/profile', { replace: true });
    } catch (e) {
      alert(e);
    }
  } else {
    alert('Fill all fields to join');
  }
}

async function me() {
  try {
    const res = await fetch(API_BASE + '/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + tokenValue,
      },
    });

    let json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    return json;
  } catch (e) {
    alert(e);
  }
}

async function getStream(id) {
  try {
    const res = await fetch(API_BASE + '/stream/' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + tokenValue,
      },
    });

    let json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    console.log(json);
    return json;
  } catch (e) {
    alert(e);
  }
}

async function getSong(url) {
  try {
    let sentJson = JSON.stringify({
      url,
    });

    const res = await fetch(API_BASE + '/song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + tokenValue,
      },
      body: sentJson,
    });

    let json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    return json;
  } catch (e) {
    alert(e);
  }
}

export { subscribe, login, signUp, me, getStream, getSong };
