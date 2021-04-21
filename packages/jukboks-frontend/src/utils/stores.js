import { writable } from 'svelte/store';
import { me } from './api';

export const username = writable(localStorage.getItem('username'));
export const userName = writable(localStorage.getItem('userName'));

export const token = writable(localStorage.getItem('token'));
token.subscribe((value) => localStorage.setItem('token', value));

export const user = writable({});
export const isAuthenticated = writable(false);

export async function saveUser() {
  let json = await me();
  localStorage.setItem('username', json.username);
  localStorage.setItem('userName', json.name);
  username.set(localStorage.getItem('username'));
  userName.set(localStorage.getItem('userName'));
}
