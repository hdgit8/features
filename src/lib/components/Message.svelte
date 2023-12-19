<script>
	import messageStore from '$lib/stores/message.store';

	export let onAccept;

	function closeMessage() {
		messageStore.hide();
	}

	function acceptMessage() {
		messageStore.hide();
		onAccept();
	}
</script>

{#if $messageStore.show}
	<div class="fixed bottom-0 left-0 right-0" style=" z-index:100;">
		<div
			class="bg-white dark:bg-[--dark-800] flex border-2"
			class:text-red-500={$messageStore.type === 'error'}
			class:border-red-500={$messageStore.type === 'error'}
			class:font-bold={$messageStore.type === 'error'}
		>
			<div class="p-5">
				{$messageStore.message}
			</div>
			<div class="ml-auto">
				{#if $messageStore.type === 'alert'}
					<!-- ACCEPT -->
					<button class="p-5" on:click={acceptMessage}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
						</svg>
					</button>
				{:else if $messageStore.type === 'loading'}
					<!-- LOADING -->
					<div class="p-5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 animate-spin"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					</div>
				{/if}

				{#if $messageStore.type !== 'alert' && $messageStore.type !== 'loading'}
					<!-- CLOSE -->
					<button class="p-5" on:click={closeMessage}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
