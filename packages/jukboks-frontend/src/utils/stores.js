import { writable } from 'svelte/store';
import { me } from './api';

export const token = writable(localStorage.getItem('token'));
export const username = writable(localStorage.getItem('username'));
export const userName = writable(localStorage.getItem('userName'));

export async function saveUser() {
    let json = await me();
    localStorage.setItem('username', json.username);
    localStorage.setItem('userName', json.name);
    username.set(localStorage.getItem('username'));
    userName.set(localStorage.getItem('userName'));
}
