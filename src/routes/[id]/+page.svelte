<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
    import Settings from '$lib/components/Course/Settings.svelte';

    export let data;
    let { supabase, session, course } = data
    $: ({ supabase, session } = data) // listen to changes

    let showSettings:boolean = false;
</script>

{#if showSettings}
    <Settings bind:supabase={supabase} bind:course={course} bind:showSettings={showSettings}></Settings>
{/if}

<div class="p-2 flex min-w-max">
    <button on:click={() => {showSettings = true}} class="ml-auto hover:opacity-100 opacity-70 text-gray-200 p-1 px-2 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
            <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
        </svg>
    </button>
</div>

<div class="flex flex-col">
    <div class="flex flex-col gap-2 p-5 md:flex-row mx-auto w-full">
        <div class="md:w-1/2 w-full text-lg font-semibold text-center my-auto">
            <p>
                Are You Ready to Code Minecraft?
            </p>
            <p>Can You Code it?...</p>
            <p>Yes, Yes You Can.</p>
        </div>
        <iframe class="md:w-1/2 sm:w-2/3 w-full mx-auto aspect-video" src="https://www.youtube.com/embed/KhCeUKdNrl0?autoplay=1" title="YouTube Video Player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    <div>
        <div class="max-w-3xl mx-auto p-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus porro deleniti, unde, numquam voluptates reprehenderit excepturi doloremque architecto voluptatum, quisquam reiciendis possimus eveniet. Exercitationem quibusdam quisquam voluptatibus soluta voluptates totam.
        </div>
    </div>
</div>