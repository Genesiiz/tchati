<script>
  import io from 'socket.io-client';
  import { loggedStore, messagesListStore } from '@/routes/chat/store.js';
  import { scale } from "svelte/transition";
  import { encodeHTML } from '@/helpers/sanitize.js';
  import { isEmpty } from '@/helpers/validation.js';

  const socket = io();
  let message = "";
  $: messageValid = !isEmpty(message);
  $: formIsValid = messageValid;

  // Sends a chat message
	function sendMessage () {
		// Prevent markup from being injected into the message
    message = encodeHTML(message);

		// if there is a non-empty message and a socket connection
		if (message && $loggedStore) {
      messagesListStore.updateMessagesList(message);
			// tell server to execute 'new message' and send along one parameter
			socket.emit('new message', message);
      message = "";
		}
  }

  // Whenever the server emits 'new message', update the chat body
	socket.on('new message', function (data) {
		messagesListStore.updateMessagesList(data.message);
	});
</script>

<div class="chat-container">
  <div class="chat-area">
    <ul class="messages">
      {#each $messagesListStore as message}
        <li transition:scale>{message}</li>
      {:else}
        <li>Oups no message</li>
      {/each}
    </ul>
  </div>
  <form class="chat-form" on:submit|preventDefault={sendMessage}>
    <input
      label="Message"
      type="text"
      placeholder="Type here..."
      valid={messageValid}
      validityMessage="Please enter a valid message."
      value={message}
      on:input={event => (message = event.target.value)} />
    <input
      value="Send"
      type="submit"
      on:click|preventDefault={sendMessage}
      disabled={!formIsValid} />
  </form>
</div>