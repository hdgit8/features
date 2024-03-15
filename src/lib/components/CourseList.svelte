<script lang="ts">
	import Course from "./Course/CourseCard.svelte";
    export let courses:Array<Map<any, any>>;
    export let name:string;
    export let href:string;
</script>

<div class="">
    <div class="flex mb-2 px-5">
        <div class="font-semibold text-lg ml-1 text-white">{name}</div>
        <a href={href} class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-[--dark-700] p-[0.2rem] rounded-full px-2">
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
            </svg>
        </a>
    </div>
    <div class="grid px-5 grid-flow-col overflow-x-scroll auto-cols-[15rem] lg:auto-cols-[20rem] transition-all gap-5">
        {#if courses}
            {#each courses as course}
                <Course id={course.id} image={course.public_url} text={course.title}></Course>
            {/each}
        {:else}
        <Course></Course>
        <Course></Course>
        <Course></Course>
        <Course></Course>
        <Course></Course>
        <Course></Course>
        {/if}
    </div>
</div>