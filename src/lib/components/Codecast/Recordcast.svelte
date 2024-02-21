<script lang="ts">
	import Livecode from './Livecode.svelte';
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// references
	let livecode: Livecode;
	let cursor;
	let code;
	let audio;
	let mp4Source;

	// state
	let playing = false;
	let previousCode = null;
	let isRecording = false;
	let finishedRecording = false;

	// recording data
	let audioStream = null;
	let audioStreamActive = false;
	let mediaRecorder = null;
	let audioChunks = [];

	// playback data
	let recordingLengthSeconds = 0.0;
	let currentTime = 0.0;

	// exportable data
	let mp4Blob:Blob;
	let changes = {
		time: [],
		text: [],
		selection: { anchor: [], head: [] },
	};

	// timer for estimating duration of recording
	let start;

	export let ready = false;
	export let edited = false;

	// get exportable data
	export function getData() {
		return {
			audio: {
				mp4Blob,
			},
			changes,
			duration: recordingLengthSeconds,
			finalCode: changes.text[changes.text.length - 1]
		};
	}

	// load existing
	export async function loadData(_audioURL = "", _changes = {}, _duration, thumbnail_code = "") {
		livecode.set(thumbnail_code);

		changes = _changes;
		recordingLengthSeconds = _duration;

		mp4Source.src = _audioURL;

		audio.load();

		audio.ondurationchange = (e) => {
			if (audio.duration != Infinity) {
				console.log('recordingLengthSeconds from database', recordingLengthSeconds);
				recordingLengthSeconds = audio.duration;
				console.log('recordingLengthSeconds', recordingLengthSeconds);
			}
		};

		audio.onseeked = () => {
			onSeeked();
		};

		audio.onended = () => {
			playing = false;
		};

		finishedRecording = true;
		ready = true;
	}

	/* RECORDING */
	onMount(() => {
		if (browser) {
			requestAnimationFrame(onLivecodeChange);
		}
	});

	function onLivecodeChange() {
		if ((isRecording && code !== previousCode) || cursor.anchor !== cursor.head) {
			recordLivecodeChange();
			previousCode = code;
		}
		requestAnimationFrame(onLivecodeChange);
	}

	function recordLivecodeChange() {
		const currentTimeCentisecond = (Date.now() - start) / 10;

		changes.time.push(currentTimeCentisecond);
		changes.text.push(code);
		changes.selection.anchor.push(cursor.anchor);
		changes.selection.head.push(cursor.head);
	}

	async function startAudioStream() {
		try {
			audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioStreamActive = audioStream.active;
		} catch (err) {
			console.error(err);
			audioStreamActive = false;
		}
	}

	function stopAudioStream() {
		if (audioStream) {
			audioStream.getTracks().forEach(function (track) {
				track.stop();
			});
		}
		audioStreamActive = false;
	}

	async function toggleAudioStream() {
		if (isRecording) return;

		if (audioStreamActive) {
			stopAudioStream();
		} else {
			await startAudioStream();
		}
	}

	function toggleRecording() {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	}

	function startRecording() {
		if (!audioStreamActive) {
			alert('No audio input active');
			return;
		}
		mediaRecorder = new MediaRecorder(audioStream);

		// estimate recordingLengthSeconds until audio.ondurationchange fires with valid data
		start = Date.now();
		const interval = setInterval(() => {
			const recordingLengthMilliseconds = Date.now() - start;
			recordingLengthSeconds = Math.round(recordingLengthMilliseconds / 1000);
		}, 1000);

		mediaRecorder.start();

		onLivecodeChange();

		isRecording = true;

		mediaRecorder.ondataavailable = (e) => {
			audioChunks.push(e.data);
		};

		mediaRecorder.onstop = async (e) => {
			// stop timer
			clearInterval(interval);

			mp4Blob = new Blob(audioChunks, { type: 'audio/mp4' });

			mp4Source.src = window.URL.createObjectURL(mp4Blob);

			audio.load();

			// estimate the recording duration using timer
			// we have to do this until ondurationchange fires with a valid duration
			const recordingLengthMilliseconds = Date.now() - start;
			recordingLengthSeconds = recordingLengthMilliseconds / 1000;

			audio.ondurationchange = (e) => {
				if (audio.duration != Infinity) {
					console.log('estimated recordingLengthSeconds', recordingLengthSeconds);
					recordingLengthSeconds = audio.duration;
					console.log('recordingLengthSeconds', recordingLengthSeconds);
				}
			};

			audio.onended = () => {
				playing = false;
			};

			previousCode = null;
			finishedRecording = true;
			ready = true;

			dispatch("ready");
		};
	}

	function stopRecording() {
		mediaRecorder.stop();
		edited = true;
		isRecording = false;
		stopAudioStream();
	}

	function clear() {
		edited = true;

		audio.pause();

		playing = false;
		previousCode = null;
		finishedRecording = false;
		isRecording = false;
		finishedRecording = false;

		recordingLengthSeconds = 0.0;
		currentTime = 0.0;

		audioStream = null;
		audioStreamActive = false;
		mediaRecorder = null;
		audioChunks = [];

		mp4Blob = null;
		changes = {
			time: [],
			text: [],
			selection: { anchor: [], head: [] }
		};

		ready = false;

		livecode.allowEditing();
	}

	/* PLAYBACK / PREVIEW */
	function play() {
		if (!audio) return;

		previousCode = null;

		onSeeked();

		function onAnimationFrame() {
			if (!audio) return;

			currentTime = audio.currentTime;

			onSeeked();

			if (audio.paused) {
				playing = false;
			} else {
				requestAnimationFrame(onAnimationFrame);
			}
		}

		if (audio.paused) {
			requestAnimationFrame(onAnimationFrame);
			audio.play();
			playing = true;
		} else {
			audio.pause();
			playing = false;
		}
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

<Livecode bind:this={livecode} bind:cursor bind:code />

{#if finishedRecording}
	<div class="p-2 flex gap-2">
		<button
			on:click={play}
			class="bg-animate-red p-2 rounded-full bg-gray-500 w-min bg-animate-red-500 hover:bg-red-500"
		>
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
			<div class="p-2 w-full bg-gray-500 relative rounded-full h-10">
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
		<div class="ml-auto">
			<button on:click={clear} class="p-2 px-3 rounded-full bg-gray-500">
				<!-- redo icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6"
				>
					<path
						fill-rule="evenodd"
						d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 013.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 00-4.392-4.392 49.422 49.422 0 00-7.436 0A4.756 4.756 0 003.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 101.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 013.01-3.01c1.19-.09 2.392-.135 3.605-.135zm-6.97 6.22a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 004.392 4.392 49.413 49.413 0 007.436 0 4.756 4.756 0 004.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 00-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 01-3.01 3.01 47.953 47.953 0 01-7.21 0 3.256 3.256 0 01-3.01-3.01 47.759 47.759 0 01-.1-1.759L6.97 15.53a.75.75 0 001.06-1.06l-3-3z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</div>
{:else}
	<div class="p-2 flex gap-2">
		{#if !isRecording}
			<button
				on:click={toggleAudioStream}
				class:bg-animate-red={audioStreamActive}
				class="p-2 rounded-full bg-gray-500 w-min bg-animate-red-500 hover:bg-red-500"
			>
				<!-- mic icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6"
				>
					<path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
					<path
						d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z"
					/>
				</svg>
			</button>
		{/if}
		<div class="p-2 rounded-full w-full bg-gray-500 flex items-center justify-center">
			<div>{recordingLengthSeconds}s</div>
		</div>
		{#if audioStreamActive}
			<div class="ml-auto">
				<button
					on:click={toggleRecording}
					class:bg-red-500={isRecording}
					class="p-2 rounded-full bg-gray-500 hover:bg-red-500"
				>
					{#if isRecording}
						<!-- stop icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								fill-rule="evenodd"
								d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
								clip-rule="evenodd"
							/>
						</svg>
					{:else}
						<!-- record icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								fill-rule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 01-1.313-1.313V9.564z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/if}

<audio bind:this={audio}>
	<source bind:this={mp4Source} type="audio/mp4" />
	<p>Your browser does not support HTML5 audio.</p>
</audio>

<style>
	.bg-animate-red {
		background-color: rgb(239 68 68);
		animation: animate-red 1s;
		animation-iteration-count: 3;
	}

	@keyframes animate-red {
		from {
			background-color: rgb(239 68 68);
		}
		50% {
			background-color: black;
		}
		90% {
			background-color: rgb(239 68 68);
		}
		to {
			background-color: rgb(239 68 68);
		}
	}

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
