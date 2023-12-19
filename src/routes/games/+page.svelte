<script>
    import navStore from '$lib/stores/nav.store'
    import Course from '$lib/components/Course.svelte';
    
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

    navStore.title("Games")
</script>

<div 
class:ml-5={!$navStore.isOpen}
class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 mr-5 mb-5 transition-all gap-5">
    
    <!-- large course card
        - default to last active course
        - fallback to "start-here" course if no last_active_course_id
    -->

    <div
        class:shadow={!$navStore.isOpen}
        class="text-white bg-black overflow-hidden lg:col-span-2 xl:col-span-3 h-96 lg:h-full lg:max-w-100% rounded-2xl">
        <div 
        class="w-full h-full bg-cover bg-left border-collapse rounded-2xl"
        style="background-image:url('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x28HCmU-vNbUj5RJkrWAMw.jpeg')"
        >
            
            <div class="h-full w-full bg-gradient-to-r from-black via-70% via-transparent to-transparent p-4 flex flex-col">
                <h1 class="text-3xl font-medium md:text-4xl p-3 w-2/3">Sandbox Game made with Sparker</h1>
                <div class="mt-auto flex">
                    <button class="bg-red-500 p-2 rounded-lg px-5">
                        See Courses
                    </button>
                </div>
            </div>
            
        </div>

    </div>
    <div class="rounded-2xl">
        <div class="flex mb-5">
            <div class="font-semibold text-lg ml-1 dark:text-white">New</div>
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
        <div class="font-semibold text-lg ml-1 dark:text-white">Top Courses</div>
        <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-white dark:bg-[--dark-700] p-[0.2rem] rounded-full px-2">
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all gap-5">
        <Course></Course>
        <Course></Course>
        <Course></Course>
    </div>
</div>