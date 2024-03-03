<script lang="ts">
	import Room from '../components/Room.svelte';
	let ready: boolean = false;
	let roomId: string = '';

	function showCanvas() {
		if (roomId) {
			ready = true;
		}
	}
</script>

<main>
	{#if !ready}
		<div>
			<input bind:value={roomId} placeholder="Room ID">
			<button on:click={showCanvas}>Connect</button>
		</div>
	{:else}
		<Room roomId={roomId}/>
	{/if}
</main>

<style>

	main {
		text-align: center;
		margin-top: 15px;
	}

	button, input {
		height: 34px;
	}

</style>