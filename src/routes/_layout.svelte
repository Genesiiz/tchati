<script>
	import Header from '@partials/header/Header.svelte';
	import Footer from '@partials/footer/Footer.svelte';
</script>

<Header />
<hr>

<main>
	<slot></slot>
</main>

<hr>
<Footer />