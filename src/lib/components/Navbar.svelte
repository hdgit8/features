<script lang="ts">
    import {goto} from "$app/navigation"
    import type {Session, SupabaseClient} from "@supabase/supabase-js"
    export let supabase: SupabaseClient;
    export let session: Session|null;
    import { clickOutside } from "$lib/utils/clickOutside.js";

    async function logout() {
        await supabase.auth.signOut();
        goto("/")
    }

    let open = false;
    function toggle() {
        open = !open;
    }
</script>

<div class="flex pt-3 pb-2 fixed top-0 left-0 right-0 z-20 px-4 w-full backdrop-blur-sm backdrop-brightness-100 bg-black/25">
    <a href="/" class="flex hover:opacity-80">
        <img alt="sparker" src="/sparker_white.png" class="h-9 p-1">
        <div class="text-white text-xl font-medium p-1 hidden md:block">Sparker3D.com</div>
    </a>
    {#if session}
    <div class="ml-auto text-white">
        <button class="p-0 m-0 bg-white/20 rounded-full" on:click={toggle} use:clickOutside on:click_outside={() => {open = false}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-9 h-9 p-0 m-0">
                <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clip-rule="evenodd" />
            </svg>
        </button>

        <div 
        class:hidden={!open}
        class:menu={open}
        class="transition-all left-4 md:left-auto md:w-64 absolute z-50 top-3 right-4 h-64 bg-[--dark-900] rounded-2xl">
            <div class="flex w-full">
                <div class="p-2">{session.user.user_metadata?.name}</div>
                <div class="ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-9 h-9">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="px-2 underline">
                <a href="/user/{session.user.id}">view profile</a>
            </div>
            <button class="p-2" on:click={logout}>Logout</button>
        </div>
    </div>
   
    {:else}
    <a href="/auth" class="ml-auto transition-all hover:bg-white/25 rounded-full mx-5 flex px-4 p-2 font-bold text-sm">
        <span>Sign In</span>
    </a>
    <a href="/home" class="transition-all hover:opacity-80 flex bg-white px-4 p-2 rounded-full text-sm">
        <span class="text-black font-medium">Get Started</span>
        <svg xmlns="http://www.w3.org/2000/svg" style="padding-top:.25rem;" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-gray-800">
            <path fill-rule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
    </a>
    {/if}
</div>

<style>
    .menu {
        @apply flex flex-col items-start justify-start;
    }
</style>
