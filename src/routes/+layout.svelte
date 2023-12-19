<script lang="ts">
    import "../app.css"

    import Sidebar from "$lib/components/Sidebar.svelte"
    import Message from "$lib/components/Message.svelte"
    import Button from "$lib/components/Button.svelte";
    import Auth from "$lib/components/Auth.svelte";

	import { onMount } from "svelte";

	import navStore from '$lib/stores/nav.store'
	import messageStore from "$lib/stores/message.store"
	import policyStore from "$lib/stores/policy.store"
	import { goto, invalidate } from "$app/navigation";
	import { page } from "$app/stores";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

	let scroll: Element;
	let ready = false;

	function open() {
		scroll?.scrollTo({ left: 0, behavior: 'smooth' });
	}

	function close() {
		scroll?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
	}

    function toggle() {
        if ($navStore.back) {
            goto($navStore.back);
            return;
        }

        if ($navStore.isOpen) {
            close();
        } else {
            open();
        }
    }

	onMount(() => {
        scroll?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
		scroll.addEventListener("scroll", () => {
			let isOpen = scroll.scrollLeft < 2;

            if (isOpen) {
                navStore.open();
            } else {
                navStore.close();
            }

            scroll.setAttribute("style", `padding:0; margin:0; --scroll-left:${scroll.scrollLeft}px`);
		});

		if (!$policyStore.accepted) {
			messageStore.showAlert(
				'By continuing, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.'
			);
		}

        ready = true;

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            }
        });

        return () => subscription.unsubscribe();
	});
</script>

<!-- site navigation sidebar -->
<Sidebar>
    <div 
    class:px-5={$navStore.isOpen}
    class="flex px-2 transition-all">
        <div 
            class:h-20={$navStore.isOpen}
            class:opacity-90={!$navStore.isOpen}
            class="flex h-14 transition-all pl-3">
            <img
                class:h-7={!$navStore.isOpen}
                class="h-8 m-auto dark:block hidden"
                src="/sparker_white.png" alt="logo">
            <img
                class:h-7={!$navStore.isOpen}
                class="h-8 m-auto dark:hidden"
                src="/sparker_black.png" alt="logo">
        </div>
        <div
        class:h-20={$navStore.isOpen}
        class:opacity-0={!$navStore.isOpen}
        class:opacity-100={$navStore.isOpen}
        class="flex h-14 pl-3 transition-all">
            <span class="m-auto font-medium text-lg cursor-default dark:text-white">
                Sparker3D.com
            </span>
        </div>
    </div>
    <div
    class:opacity-0={!$navStore.isOpen}
    class="flex flex-col gap-3 bg-white dark:bg-[--dark-800] transition-all mx-5 rounded-2xl p-3">
        <a href="/games">
            <Button align="left" active={$page.url.pathname === "/games"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z" clip-rule="evenodd" />
                </svg>
                <span>Games</span>
            </Button>
        </a>
        <a href="/explore">
            <Button align="left" active={$page.url.pathname === "/explore"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path d="M2.879 7.121A3 3 0 007.5 6.66a2.997 2.997 0 002.5 1.34 2.997 2.997 0 002.5-1.34 3 3 0 104.622-3.78l-.293-.293A2 2 0 0015.415 2H4.585a2 2 0 00-1.414.586l-.292.292a3 3 0 000 4.243zM3 9.032a4.507 4.507 0 004.5-.29A4.48 4.48 0 0010 9.5a4.48 4.48 0 002.5-.758 4.507 4.507 0 004.5.29V16.5h.25a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-3.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v3.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5H3V9.032z" />
                </svg>
                <span>Explore</span>
            </Button>
        </a>
        <Button align="left" disabled={true}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 01-5.183.501.78.78 0 00-.528.224l-3.579 3.58A.75.75 0 016 17.25v-3.443a41.033 41.033 0 01-2.57-.33C1.993 13.244 1 11.986 1 10.573V5.426c0-1.413.993-2.67 2.43-2.902z" clip-rule="evenodd" />
            </svg>
            <span>Messages</span>
            <span>(in progress)</span>
        </Button>
        <a href="/dash">
            <Button align="left" active={$page.url.pathname === "/dash"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
                    <path d="M14.5 11.5c.173 0 .345-.007.514-.022l3.754 3.754a2.5 2.5 0 01-3.536 3.536l-4.41-4.41 2.172-2.607c.052-.063.147-.138.342-.196.202-.06.469-.087.777-.067.128.008.257.012.387.012zM6 4.586l2.33 2.33a.452.452 0 01-.08.09L6.8 8.214 4.586 6H3.309a.5.5 0 01-.447-.276l-1.7-3.402a.5.5 0 01.093-.577l.49-.49a.5.5 0 01.577-.094l3.402 1.7A.5.5 0 016 3.31v1.277z" />
                </svg>
                <span>Dashboard</span>
            </Button>
        </a>
    </div>

    <div
    class:opacity-0={!$navStore.isOpen}
    class="flex flex-col gap-3 bg-white dark:bg-[--dark-800] transition-all mx-5 rounded-2xl p-3 mt-5">
        <!-- Login and Signup -->
        <Auth {supabase} {session}></Auth>
    </div>

    <div
    class:opacity-0={!$navStore.isOpen}
    class="flex flex-col gap-3 bg-white dark:bg-[--dark-800] transition-all mx-5 rounded-2xl p-3 mt-5">
        <!-- course title -->
        <div class="text-gray-900 dark:text-white dark:hover:text-gray-200 p-1 px-2 rounded-lg flex gap-2">  
            <span class="text-lg font-semibold">Voxels in Unity</span>
        </div>
        <div class="flex w-full items-center">
            <Button active={true}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 01-1.084 3.45 26.503 26.503 0 00-1.281-.78A5.487 5.487 0 006 12v-.54z" clip-rule="evenodd" />
                  </svg>               
                <span>Sections</span>
            </Button>
            <Button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 01-5.183.501.78.78 0 00-.528.224l-3.579 3.58A.75.75 0 016 17.25v-3.443a41.033 41.033 0 01-2.57-.33C1.993 13.244 1 11.986 1 10.573V5.426c0-1.413.993-2.67 2.43-2.902z" clip-rule="evenodd" />
                </svg>            
                <span>Channels</span>
            </Button>
        </div>
        <Button align="left">
            <span class="w-5 h-5">#</span>
            <span>Welcome</span>
        </Button>
        <Button align="left">
            <span class="w-5 h-5">#</span>
            <span>Setup</span>
        </Button>
    </div>
</Sidebar>

<!-- main page content -->
<div 
    bind:this={scroll}
	class="fixed pointer-events-none z-10 bg-none top-0 left-0 right-0 bottom-0 flex w-screen snap-mandatory snap-x overflow-scroll"
>
	<!-- sidebar gap (transparent see through area) -->
	<div class="nav-width h-screen shrink-0 snap-start bg-none pointer-events-none" />

	<!-- app  -->
	<div class="w-[100vw] min-h-screen shrink-0 snap-start pointer-events-auto">
        <div class="max-content-width">

            <!-- homepage navigation -->
            <div class="flex gap-2 h-14">
                <button 
                class:ml-16={!$navStore.isOpen}
                class="flex w-12 transition-all" on:click={toggle}>
                    <!-- back arrow -->
                    <svg class="w-10 h-10 rounded-full m-auto dark:text-white hover:bg-white dark:hover:bg-[--dark-800]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z" clip-rule="evenodd" />
                    </svg>
                </button>

                <h3 class="font-semibold text-lg mr-auto my-auto">
                    {$navStore.title}
                </h3>
            </div>

            <!-- homepage content -->
            <div style="height:calc(100vh - 3.5rem);" class="overflow-y-scroll rounded-tl-xl">
                <slot></slot>
            </div>
        
        </div>
	</div>
</div>

<!-- global message -->
<Message
    onAccept={() => {
        policyStore.accept();
    }} 
/>

<style>
	.nav-width {
		width: var(--sidebar-width);
	}

    .max-content-width {
        max-width: 100%;
    }

    @media screen and (min-width: 769px) {
        .max-content-width {
            max-width: calc(100vw - calc(22rem - var(--scroll-left)))
        }
    }

    :root {
        --bg-base-900: #16181b;
        --bg-base-800: #202327;

        --dark-500: rgb(53, 54, 58);
        --dark-600: rgb(41, 42, 45);
        --dark-700: rgb(32, 33, 36);
        --dark-800: rgb(25, 26, 29);
        --dark-900: rgb(18, 19, 21);
        --dark-950: rgb(12, 13, 15);

        /* core app layout */
        --sidebar-width: calc(100vw - 3.5rem);
    }

    @media screen and (min-width: 769px) {
        :root {
            /* core app layout */
            --sidebar-width: 22rem;
        }
    }
</style>
