import { writable } from 'svelte/store';

export const token = writable(localStorage.getItem('token'));
export const username = writable(localStorage.getItem('username'));
export const userName = writable(localStorage.getItem('userName'));
