<script lang="ts">
	import { onMount } from 'svelte';
	import Canvas from './Canvas';

	export let roomId: string;

	const socket: WebSocket = new WebSocket(`ws://127.0.0.1:4000/${roomId}`);
	let isSocketReady: boolean = false;
	let canvasEl: HTMLCanvasElement;
	let canvas: Canvas;
	let mounted: boolean = false;

	socket.onopen = function() {
		isSocketReady = true;
	};

	socket.onmessage = async (event) => {
		canvas.renderLinesData(event.data);
	};

	function mouseDown(evt: MouseEvent) {
		canvas.startLine(evt)
	}

	function mouseMove(evt: MouseEvent) {
		canvas.drawLine(evt)
	}

	function mouseUp() {
		canvas.finishLine();
		if (isSocketReady) {
			socket.send(JSON.stringify(canvas.getLinesData()));
			canvas.flushLinesData();
		}
	}

	onMount(() => {
		canvas = new Canvas(canvasEl);
		mounted = true;
	});

</script>

{#if mounted}
<form>
	<label>
		Color:
		<input type='color' bind:value={canvas.brushSettings.color}>
	</label>
	<label>
		Size:
		<input type='number' min='1' bind:value={canvas.brushSettings.size}>
	</label>
	<label>
		Brush:
		<select bind:value={canvas.brushSettings.lineCap}>
			{#each canvas.getLineTypes() as brush}
				<option value={brush}>
					{brush}
				</option>
			{/each}
		</select>
	</label>
</form>
{/if}
<canvas 
	bind:this={canvasEl}
	on:mousedown={mouseDown}
	on:mousemove={mouseMove}
	on:mouseup={mouseUp}
	width={1024}
	height={480}
></canvas>
<div>
	Room ID: {roomId}
</div>


<style>

	canvas {
		cursor: crosshair;
		border: 1px solid #ccc;
    border-radius: 2px;
		margin-top: 10px;
	}

	input {
		width: 50px;
	}

	input, select {
		height: 26px;
		margin-right: 10px;
	}

</style>