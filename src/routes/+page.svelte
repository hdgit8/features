<script>
    import Course from '$lib/components/Course/CourseCard.svelte';
	import { onMount } from 'svelte';
    export let data
    let { supabase, session, courses } = data
    $: ({ supabase, session } = data) // listen to changes
</script>

<div class="ml-5 md:ml-0 mt-5">
    <div class="min-h-[100vh] max-h-[100vh]">
        <div class="absolute top-0 right-0 left-0 z-0">
            <div
                style="background-image:url('/relaxing.png');"
                class="min-h-[100vh] fade-in max-h-[100vh] min-w-full bg-cover bg-bottom lg:bg-"
            >
            </div>
            <div
                class="absolute top-0 left-0 right-0 h-[100vh]"
                style="background: linear-gradient(to bottom, rgb(0, 0, 0, 0) 70%, #000 100%);"
            />
        </div>
        <!-- TEXT -->
        <div class="pt-14 z-20 absolute top-0 right-0 left-0 md:left-16 px-20 h-[100vh] mb-10 flex flex-col">
            <div class="font-effect-hero font-rubik text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-800 text-5xl md:text-6xl lg:text-8xl text-white mt-[5vh]">
                Learn to Code
            </div>
            <div class="text-xl py-5 font-light text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-800">
                <p>The best place to learn to code at the speed of light.</p>
                <p>No more random tutorials.</p>
            </div>
            <div class="mt-auto mb-28">
                <button class="flex bg-white text-black p-2 pl-4 rounded-full">
                    <div class="text-lg font-semibold">
                        Get Started
                    </div>
                    <div class="py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    </div>
    <!--
    <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 mr-5 mb-5 transition-all gap-5">

        <div class="text-white bg-black overflow-hidden lg:col-span-2 xl:col-span-3 h-96 lg:h-full lg:max-w-100% rounded-2xl">
            <div 
            class="w-full h-full bg-cover bg-center border-collapse rounded-2xl"
            style="background-image:url('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x28HCmU-vNbUj5RJkrWAMw.jpeg')">
                <div class="h-full w-full bg-gradient-to-t from-black via-70% via-transparent to-transparent p-4 flex flex-col">
                    <div class="mt-auto flex">
                        <h1 class="text-4xl font-medium md:text-4xl p-3 w-2/3">Sandbox Builder Game in Unity</h1>
                        <div class="ml-auto flex">
                            <button class="bg-red-500 p-2 rounded-lg px-5 mt-auto">
                                Lets Go!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
     -->
    <div class="rounded-2xl mr-5 transition-all">
        <div class="flex mb-2">
            <div class="font-semibold text-lg ml-1 text-white">Courses</div>
            <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-[--dark-700] p-[0.2rem] rounded-full px-2">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all gap-5">
            {#each courses as course}
                <Course id={course.id} text={course.title} image={course.public_url}></Course>
            {/each}
        </div>
    </div>

    <div class="rounded-2xl mt-5 mr-5 transition-all">
        <div class="flex mb-2">
            <div class="font-semibold text-lg ml-1 text-white">Founders Blog</div>
            <a 
            target="_blank"
            href="https://medium.com/@paperwolf"
            class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-[--dark-700] p-[0.2rem] rounded-full px-2">
                <span>View Blog</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
                </svg>
            </a>
        </div>
    </div>

    <div
    class="grid grid-cols-1 lg:grid-cols-2 mr-5 gap-5">
        <a 
        target="_blank"
        href="https://medium.com/@paperwolf/sandbox-games-the-escape-from-our-boring-reality-59661c2bcb27"
        class="bg-[--dark-800] rounded-2xl lg:my-0 p-5 transition-all flex flex-col">
            <div class="flex mb-5">
                <div class="font-semibold ml-1 text-white text-lg">Sandbox Games — The Escape from our boring Reality</div>
                <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-[--dark-700] p-[0.2rem] rounded-full px-2">
                    <span>View</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="h-56 w-full overflow-hidden rounded-lg bg-center bg-cover mt-auto" style="background-image:url('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x28HCmU-vNbUj5RJkrWAMw.jpeg');">
            </div>
        </a>
        
        <a 
        target="_blank"
        href="https://medium.com/@paperwolf/real-time-strategy-games-gameplay-for-sprawling-empires-of-an-alternate-reality-8d7e8774a9c9"
        class="bg-[--dark-800] rounded-2xl lg:my-0 p-5 transition-all flex flex-col">
            <div class="flex mb-5">
                <div class="font-semibold ml-1 text-white text-lg">Real Time Strategy — The Gameplay to drive Sprawling Empires in Sandbox Games</div>
                <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-[--dark-700] p-[0.2rem] rounded-full px-2">
                    <span>View</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="h-56 w-full overflow-hidden rounded-lg bg-center bg-cover mt-auto" style="background-image:url('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JGxTps-S8nb9iw2BORciyQ.jpeg');">
            </div>
        </a>
    </div>    
</div>


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

    .font-effect-hero {
        -webkit-text-stroke: 0.4px #ffffff80;
        -webkit-text-fill-color: transparent;
        text-shadow: -1px -1px 0 hsla(0,0%,100%,.2), 1px 1px 0 rgba(0,0,0,.1);
    }
</style>