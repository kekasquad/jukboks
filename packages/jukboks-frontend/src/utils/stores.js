import { writable } from 'svelte/store';

export const token = writable(localStorage.getItem('token'));
token.subscribe((value) => {
  console.log(`Setting token to ${value}`);
  localStorage.setItem('token', value ?? '');
});

export const username = writable(localStorage.getItem('username'));
username.subscribe((value) => {
  console.log(`Setting username to ${value}`);
  localStorage.setItem('username', value ?? '');
});

export const song = writable();
song.subscribe((value) => {
  console.log(`Setting song to ${JSON.stringify(value)}`);
});

export const plays = writable();
plays.subscribe((value) => {
  console.log(`Setting plays to ${value}`);
});

export const message = writable();
message.subscribe((value) => {
  console.log(`Setting message to ${value}`);
});

export const reaction = writable();
reaction.subscribe((value) => {
  console.log(`Setting reaction to ${value}`);
});

export const listeners = writable();
listeners.subscribe((value) => {
  console.log(`Setting listeners to ${value}`);
});