<script>
    import navStore from '$lib/stores/nav.store'

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

    navStore.title("Welcome to Sparker")
</script>

<a
target="_blank"
href="https://medium.com/@paperwolf"
class:ml-5={!$navStore.isOpen}
class="font-semibold p-2 text-gray-400 flex mr-5">
    <div>Founders Blog</div>
    <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-gray-100 dark:bg-[--dark-700] p-[0.2rem] rounded-full px-2">
        <span>View Blog</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
        </svg>
    </div>
</a>

<div
class:ml-5={!$navStore.isOpen}
class="grid grid-cols-1 lg:grid-cols-2 mr-5 gap-5">

    <a 
    target="_blank"
    href="https://medium.com/@paperwolf/sandbox-games-the-escape-from-our-boring-reality-59661c2bcb27"
    class="bg-white dark:bg-[--dark-800] rounded-2xl lg:my-0 p-5 transition-all flex flex-col">
        <div class="flex mb-5">
            <div class="font-semibold ml-1 dark:text-white text-lg">Sandbox Games — The Escape from our boring Reality</div>
            <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-gray-100 dark:bg-[--dark-700] p-[0.2rem] rounded-full px-2">
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
    class="bg-white dark:bg-[--dark-800] rounded-2xl lg:my-0 p-5 transition-all flex flex-col">
        <div class="flex mb-5">
            <div class="font-semibold ml-1 dark:text-white text-lg">Real Time Strategy — The Gameplay to drive Sprawling Empires in Sandbox Games</div>
            <div class="font-semibold ml-auto h-min text-gray-500 text-xs flex bg-gray-100 dark:bg-[--dark-700] p-[0.2rem] rounded-full px-2">
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
