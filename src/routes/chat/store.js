import { writable } from 'svelte/store';

// Chat global
const messagesList = writable(["Welcome to Tchati chat room"]);

export const messagesListStore = {
  subscribe: messagesList.subscribe,
  updateMessagesList: message => {
    messagesList.update(item => {
      item.push(message);
      return item;
    });
  },
}

// User
const logged = writable(false);

export const loggedStore = {
  subscribe: logged.subscribe,
  setLogged: val => {
    logged.set(val);
  },
}

const username = writable('');

export const usernameStore = {
  subscribe: username.subscribe,
  setUsername: val => {
    username.set(val);
  }
}
