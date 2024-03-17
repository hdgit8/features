<script lang="ts">
    import Course from '$lib/components/Course/CourseCard.svelte';
	import CourseList from '$lib/components/CourseList.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	import { onMount } from 'svelte';
    export let data;
    let { supabase, session } = data;

    let courses:Array<any> = [];
    onMount(async () => {
        let {data} = await supabase.from("courses").select()
        courses = data;
        if (courses) {
            for (let i = 0; i < data.length; i++) {
                if (courses[i].banner_path)
                {
                    const result = supabase.storage.from("courses").getPublicUrl(courses[i].banner_path)
                    courses[i]["public_url"] = result.data.publicUrl
                }
            }
        }
        console.log(courses)
    })
</script>

<Navbar bind:supabase={supabase} bind:session={session}></Navbar>

<div class="min-h-[100vh] max-h-[100vh]">
    <div class="absolute top-0 right-0 left-0 z-0">
        <div
            style="background-image:url('/relaxing.png');"
            class="min-h-[100vh] fade-in max-h-[100vh] min-w-full bg-cover bg-top xl:bg-left"
        >
        </div>
        <div
            class="absolute top-0 left-0 right-0 h-[100vh]"
            style="background: linear-gradient(to bottom, rgb(0, 0, 0, 0) 70%, #000 100%);"
        />
    </div>
</div>

<!-- TEXT -->
<div class="absolute top-0 left-0 right-0 z-10 px-10 h-[100vh] mb-10 flex flex-col">
    <div class="container max-w-7xl mx-auto">
        <div class="text-6xl lg:text-8xl pt-16 text-white font-effect-hero font-rubik text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mt-[5vh]">
            404 Not Found
        </div>
        <div class="md:text-lg lg:text-xl py-5 font-light text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600">
            <p>It looks like something went wrong.</p>
        </div>
        <div class="mt-auto mb-24">
            <a href="/" class="mr-auto w-fit transition-all hover:opacity-80 flex bg-white px-5 p-3 rounded-full font-bold text-sm">
                <span class="text-black">Back to Home Page</span>
                <svg xmlns="http://www.w3.org/2000/svg" style="padding-top:.25rem;" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-gray-800">
                    <path fill-rule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
            </a>
        </div>
    </div>
</div>

{#if courses}
<div class="container max-w-7xl mx-auto pb-10">
    <!-- COURSES -->
    <CourseList href="#" name="Most Popular Courses" bind:courses={courses}></CourseList>
</div>
{/if}

<style>
     .fade-in {
        opacity: 1;
        animation: fade-in-anim 3s;
    }

    @keyframes fade-in-anim {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>