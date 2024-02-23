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

<div class="flex flex-col pb-10">
    <div class="bg-cover bg-center" style="background-image:url({course.public_url})">
        <div class="flex flex-col bg-gradient-to-b from-transparent to-black">
            <div class="flex flex-col gap-2 p-5 lg:flex-row mx-auto w-full">
                <iframe class="md:w-1/2 sm:w-2/3 w-full mx-auto aspect-video rounded-lg" src="https://www.youtube.com/embed/KhCeUKdNrl0?autoplay=1" title="YouTube Video Player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <div class="md:w-1/2 w-full text-lg font-semibold text-center my-auto mx-auto">
                    <p class="text-white font-semibold text-2xl">{course.title}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-3xl mx-auto p-5 flex flex-col gap-5">
        <div class="text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus porro deleniti, unde, numquam voluptates reprehenderit excepturi doloremque architecto voluptatum, quisquam reiciendis possimus eveniet. Exercitationem quibusdam quisquam voluptatibus soluta voluptates totam.
        </div>
        <div class="font-medium text-sm flex gap-2">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
                </svg>
            </span>
            <span>200,212 students</span>
        </div>

        <div class="border-white border-2 p-4">
            <div class="text-2xl font-semibold">What You Will Learn</div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    Build a cube-based geometric world like that generated in Minecraft.
                </div>
            </div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    Navigate and manipulate discrete values in 3d space.
                </div>
            </div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    Build and skin meshes from scratch using C#.
                </div>
            </div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    Save and Retrieve Serialised Data.
                </div>
            </div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    Build and manage a voxel data structure.
                </div>
            </div>
        </div>
        <div>
            <div class="text-2xl font-semibold">Thrive In Your Career</div>
            <div class="p-2">
                Access a collection of top-rated courses curated for in-demand roles with a Personal Plan subscription.
            </div>
        </div>
        <div class="border-white border-2 p-4">
            <div class="text-2xl font-semibold">This Course Includes</div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                    </svg>
                </div>
                <div>
                    5 hours on-demand video
                </div>
            </div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                    </svg>
                </div>
                <div>
                    12 sections
                </div>
            </div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                    </svg>
                </div>
                <div>
                    6 downloadable resources
                </div>
            </div>
            <div class="flex gap-2 p-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                    </svg>
                </div>
                <div>
                    Certificate of completion
                </div>
            </div>
        </div>
        <div>
            <div class="text-2xl font-semibold">Requirements</div>
            <ul class="p-2 list-disc list-inside space-y-1">
                <li>You need to be comfortable with Unity 3D</li>
                <li>No prior Svelte or SvelteKit knowledge needed!</li>
                <li>Students should know some basic Javascript.</li>
            </ul>
        </div>
        <div>
            <div class="text-2xl font-semibold">Description</div>
            <div class="flex flex-col gap-2">
                <strong><p>Welcome to Master Svelte Framework - The Complete Course</p></strong>
                <p>In this 2023 course you'll master Svelte and SvelteKit AND learn how to build a fully-functional website as you do! It's a major website build that you can populate with users and user posts, profiles, voting and more - and it's a brilliant way to practice as you learn! As well as the main project, this 13 hour course is filled with dozens of mini-exercises that challenge you to use what you've just learnt and apply it. This is a hands-on coding course! </p>
            </div>
        </div>
    </div>
</div>