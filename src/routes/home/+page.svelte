<script lang="ts">
    import Course from '$lib/components/Course/CourseCard.svelte';
	import CourseList from '$lib/components/CourseList.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
    export let data
    let { supabase, session, createdCourses, recommendedCourses } = data
    $: ({ supabase, session, createdCourses, recommendedCourses } = data) // listen to changes
</script>

<svelte:head>
    <title>Sparker - Home</title>
</svelte:head>

<Navbar bind:supabase={supabase} bind:session={session}></Navbar>

<div class="pb-5 pt-16">
    <div class="mr-5 mb-5 transition-all">
        {#if session}
        <div
            class="text-white h-96 lg:max-w-100% p-4 rounded-2xl">
            <h1>Welcome {session?.user.user_metadata.name}</h1>
        </div>
        {:else}
        <div
            class="text-white h-96 lg:max-w-100% p-4 rounded-2xl text-2xl">
            <h1>The Best Learning Experience,</h1>
            <h1>Amplified</h1>
        </div>
        {/if}
    </div>

    <div class="flex flex-col gap-10">
        {#if session}
        <div class="">
            <div class="flex mb-2 px-5">
                <div class="font-semibold text-lg ml-1 text-white">Recently Viewed</div>
                <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-[--dark-700] p-[0.2rem] rounded-full px-2">
                    <span>View All</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="grid px-5 grid-flow-col auto-cols-[10rem] lg:auto-cols-[15rem] transition-all gap-5 overflow-x-scroll">
                <Course></Course>
                <Course></Course>
                <Course></Course>
                <Course></Course>
                <Course></Course>
                <Course></Course>
            </div>
        </div>
    
        <CourseList href="#" name="Recommended Courses" courses={recommendedCourses}></CourseList>
        <CourseList href="#" name="Created by You" courses={createdCourses}></CourseList>
        {/if}
        <CourseList href="#" name="Most Popular Courses" courses={recommendedCourses}></CourseList>
    </div>
</div>