<script lang="ts">
    import navStore from '$lib/stores/nav.store'
    import Course from '$lib/components/Course.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
    
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

    let recentCourses = [];
    let courses = [];

    onMount(async () => {
        const {data} = await supabase.from("courses").select().eq("user_id", session?.user.id)
        courses = data;
    });

    navStore.title("Dashboard")
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<div
class:ml-5={!$navStore.isOpen}
class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 mr-5 mb-5 transition-all gap-5 ">
    <div
        class:shadow={!$navStore.isOpen}
        class="dark:text-white lg:col-span-2 xl:col-span-3 h-96 lg:h-full lg:max-w-100% text-gray-900 p-4 bg-white dark:bg-[--dark-800] rounded-2xl">
        <h1>Statistics</h1>
    </div>
    <div class="rounded-2xl">
        <a
        href="/dash/course"
        class="w-full mb-5 bg-red-500 hover:text-white p-2 rounded-lg flex text-gray-100 justify-center gap-2">
            <span>New Course</span>
            <svg class="w-5 h-5 my-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
            </svg>
        </a>
        <div class="flex mb-5">
            <div class="font-semibold text-lg ml-1 dark:text-white">Recent</div>
            <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-white dark:bg-[--dark-700] p-[0.2rem] rounded-full px-2">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-1 transition-all gap-5">
            <Course></Course>
            <Course></Course>
        </div>
    </div>
</div>

<div
class:ml-5={!$navStore.isOpen}
class="rounded-2xl mr-5 transition-all">
    <div class="flex mb-5">
        <div class="font-semibold text-lg ml-1 dark:text-white">Created by You</div>
        <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-white dark:bg-[--dark-700] p-[0.2rem] rounded-full px-2">
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all gap-5">
        {#if courses}
            {#each courses as course}
                <a href="/dash/course/{course.id}">
                    <Course image={course.thumbnail_public_url} text={course.title}></Course>
                </a>
            {/each}
        {:else}
        <Course></Course>
        <Course></Course>
        <Course></Course>
        {/if}
    </div>
</div>