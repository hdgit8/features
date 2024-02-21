<script lang="ts">
	import Livecode from '$lib/components/Codecast/Livecode.svelte';
	import { onMount } from 'svelte';

	export let audioURL:string;
	export let changes: {
		time: [],
		text: [],
		selection: { head: [], anchor: [] }
	};
	export let recordingLengthSeconds:number;
	export let scrollIntoView = true;

	let livecode;

	let playing = false;
	let previousCode = null;

	let audio;

	let currentTime = 0.0;

	onMount(() => {		
		audio.ondurationchange = (e) => {
			if (audio.duration != Infinity) {
				recordingLengthSeconds = audio.duration;
			}
		};

		audio.onended = () => {
			playing = false;
			livecode.allowEditing();
		};
	});

	/* PLAYBACK / PREVIEW */
	function play() {
		if (!audio) return;

		previousCode = null;

		onSeeked();

		function onAnimationFrame() {
			currentTime = audio.currentTime;

			onSeeked();

			if (audio.paused) {
				playing = false;
			} else {
				requestAnimationFrame(onAnimationFrame);
			}
		}

		if (audio.paused) {
			try {
				audio.play();
				requestAnimationFrame(onAnimationFrame);
				playing = true;
			} catch (e) {}
		} else {
			livecode.allowEditing();
			audio.pause();
			playing = false;
		}
	}

	function stop() {
		if (!audio) return;

		previousCode = null;

		onSeeked();

		livecode.allowEditing();
		audio.pause();
		playing = false;
	}

	// use for setting text based on audio.currentTime
	// (executed in audio.onseeked event, and when the user clicks play)
	function onSeeked() {
		// centisecond is 100th of a second (millisecond is 1000th)
		const currentTimeCentisecond = audio.currentTime * 100;

		// currentTimeCentisecond is greater than time stamp ahead of us
		let index = 0;
		let lastValidIndex = 0;
		while (index < changes.time.length && changes.time[index] < currentTimeCentisecond) {
			index++;
			if (changes.text[index] !== undefined && changes.time[index] < currentTimeCentisecond) {
				lastValidIndex = index;
			}
		}

		index = lastValidIndex;

		// only apply change if text is different than previousCode
		if (
			changes.text[index] !== previousCode ||
			changes.selection.head[index] !== changes.selection.anchor[index]
		) {

            // ensure no undefined values make it through
            const text = changes.text[index] ? changes.text[index] : changes.text[changes.text.length - 1];
            const head = changes.selection.head[index] ? changes.selection.head[index] : changes.selection.head[changes.text.length - 1];
            const anchor = changes.selection.anchor[index] ? changes.selection.anchor[index] : changes.selection.anchor[changes.text.length - 1];

            // set the changes
			livecode.set(text, {
				head: head,
				anchor: anchor
			});
			previousCode = changes.text[index];
		}
	}
</script>

<Livecode bind:this={livecode} {scrollIntoView} on:click={stop} />

<div class="p-2 flex gap-2">
	<button on:click={play} class="p-2 rounded-full w-min bg-animate-red-500 hover:bg-red-500">
		<!-- play icon -->
		{#if playing}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6"
			>
				<path
					fill-rule="evenodd"
					d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6"
			>
				<path
					fill-rule="evenodd"
					d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</button>
	{#if recordingLengthSeconds}
		<div class="p-2 w-full hover:bg-gray-500 relative rounded-full h-10">
			<div class="absolute left-2 right-2">
				<input
					on:mousedown={() => {
						audio.pause();
					}}

					on:mouseup={() => {
						if (audio.currentTime !== currentTime) {
							audio.currentTime = currentTime;
							onSeeked();
						}
					}}

					class="slider p-0 m-0 absolute left-0 right-0"
					type="range"
					step="0.01"
					min="0.0"
					max={recordingLengthSeconds}
					bind:value={currentTime}
				/>
			</div>
		</div>
	{/if}
</div>

<audio bind:this={audio} src="{audioURL}">
	<p>Your browser does not support HTML5 audio.</p>
</audio>

<style>
	.slider {
		-webkit-appearance: none;
		width: 100%;
		height: 25px;
		outline: none;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
		background: none;
	}

	.slider:hover {
		opacity: 1;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		background: #ef4444;
		cursor: pointer;
		border-radius: 100%;
	}

	.slider::-moz-range-thumb {
		width: 25px;
		height: 25px;
		background: #ef4444;
		cursor: pointer;
		border-radius: 100%;
	}
</style>
