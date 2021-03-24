<script>
  import io from 'socket.io-client';
  import { usernameStore, loggedStore } from '@/routes/chat/store.js';
  import { encodeHTML } from '@/helpers/sanitize.js';
  import { isEmpty } from '@/helpers/validation.js';

  const socket = io();
  let username = "";
  $: usernameValid = !isEmpty(username);
  $: formIsValid = usernameValid;

  // Sets the client's username
  function setUsername(event) {
    username = encodeHTML(username);

    // If the username is valid
    if (!username) return;
    // Tell the server your username
    socket.emit('add user', username);
    // Add username to the store
    usernameStore.setUsername(username);
  }

  // Whenever the server emits 'login', log the login message
	socket.on('login', function (data) {
    loggedStore.setLogged(true);
    // Display the welcome message
    // ...
	})
</script>

<div class="login-container">
  <form on:submit|preventDefault={setUsername}>
    <h2>Login to chat</h2>
    <input
      label="Username"
      type="text"
      placeholder="Username"
      maxlength="14"
      valid={usernameValid}
      validityMessage="Please enter a valid username."
      value={username}
      on:input={event => (username = event.target.value)} />
    <input
      value="Send"
      type="submit"
      on:click|preventDefault={setUsername}
      disabled={!formIsValid} />
  </form>
</div>