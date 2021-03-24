<script>
  import Login from './chat/components/login.svelte';
  import Chat from './chat/components/chat.svelte';
  import { usernameStore, loggedStore } from '@/routes/chat/store.js';
</script>

<svelte:head>
	<title>Tchati</title>
</svelte:head>

{#if !$loggedStore}
	<h1>Welcome to the Tchati</h1>
	<Login />
{:else}
	<h1>Welcome, {$usernameStore}</h1>
	<Chat />
{/if}