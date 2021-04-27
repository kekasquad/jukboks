import { writable } from 'svelte/store';

export const token = writable(localStorage.getItem('token'));
token.subscribe((value) => {
  console.log(`Setting token to ${value}`);
  localStorage.setItem('token', value ?? '');
});

export const song = writable();
song.subscribe((value) => {
  console.log(`Setting somg to ${value}`);
});
