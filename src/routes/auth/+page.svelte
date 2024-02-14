<script lang="ts">
	import { invalidate } from '$app/navigation';
    import Auth from '$lib/components/Auth.svelte';
	import Button from '$lib/components/Button.svelte';
    import Course from '$lib/components/CourseCard.svelte';
	import { onMount } from 'svelte';
    export let data
    let { supabase, session, courses } = data
    $: ({ supabase, session, courses } = data) // listen to changes

    function logout() {
        supabase.auth.signOut()
    }
</script>

<svelte:head>
    <title>Sparker - Profile</title>
</svelte:head>

<!-- Login and Signup -->
<Auth bind:supabase bind:session></Auth>

<div class="ml-5 lg:ml-0 mt-5">
    <div class="mr-5 mb-5 transition-all">
        <div
            class="text-white h-96 lg:max-w-100% p-4 bg-[--dark-800] rounded-2xl">
            <h1>{session?.user.user_metadata.name}</h1>
        </div>
    </div>

    <div class="mr-5 mb-5">
        <Button on:click={logout} className="bg-red-500">
            <span>
                Logout
            </span>
        </Button>
    </div>

    <div class="rounded-2xl mr-5 transition-all">
        <div class="flex mb-2">
            <div class="font-semibold text-lg ml-1 text-white">Created by You</div>
            <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-[--dark-700] p-[0.2rem] rounded-full px-2">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all gap-5">
            {#if courses}
                {#each courses as course}
                    <Course id={course.id} image={course.public_url} text={course.title}></Course>
                {/each}
            {:else}
            <Course></Course>
            <Course></Course>
            <Course></Course>
            {/if}
        </div>
    </div>
</div>