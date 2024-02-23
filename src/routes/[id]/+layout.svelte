<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/Button.svelte";
	import { onMount } from "svelte";
	import messageStore from "$lib/stores/message.store"
    import Module from "$lib/components/Module.svelte";
    import { clickOutside } from "$lib/utils/clickOutside.js";
    import 'highlight.js/styles/github-dark.min.css';
    import 'github-markdown-css/github-markdown-dark.css'

    import Settings from "$lib/components/Course/Settings.svelte";

    export let data;
    let { supabase, session, course } = data
    $: ({ supabase, session } = data) // listen to changes

    let section;
    $: (async function () {
        if (!$page.params.section) {
            isFocused = true;
            isShowingMobileSection = true;
            return;
        }

        const{data} = await supabase.from("sections").select().eq("id", $page.params.section)
        if (data)
        {
            section = data[0];
        }
    })()

    onMount(async () => {
        await loadModules($page.params.id);
    });

    let isFocused = true;
    let isShowingMobileSection = true;

    let modules = [];
    async function loadModules(courseID) {
        const{data} = await supabase.from("modules")
            .select("id, num, name, sections (id, name, num)")
            .order("num")
            .order("num", { referencedTable: "sections"})
            .eq("course_id", courseID)
        if (data)
        {
            modules = data;
        }
    }

    let showNewModulePopup = false;
    let moduleName = "";
    async function createNewModule() {
        if (moduleName === "") return;

        showNewModulePopup = false

        try {
            const {error} = await supabase.from("modules").insert({
                name: moduleName,
                course_id: course.id,
                num: modules.length,
            });

            if (!error) {
                loadModules($page.params.id)
            }
        } catch (e) {
            console.error(e)
        }
    }

    function sortModules() {
        if (!modules) {
            console.log('did not sort modules')
            return;
        }

        modules = modules.sort((a, b) => {
            if (a.num > b.num) return 1;
            return -1;
        })
    }
</script>

{#if showNewModulePopup}
<div class="fixed z-50 top-0 left-0 right-0 bottom-0 flex" style="background-color:rgba(0, 0, 0, 0.5);">
    <div class="m-auto bg-[--dark-800] p-5 rounded-lg flex flex-col gap-3" use:clickOutside on:click_outside={() => {showNewModulePopup = false}}>
        <div>
            <div>Name</div>
            <input bind:value={moduleName} type="text" class="rounded p-2" placeholder="Section...">
        </div>
        <div>
            <Button disabled={moduleName === ""} on:click={createNewModule}>Create Module</Button>
        </div>
    </div>
</div>
{/if}

<div class="flex overflow-y-hidden max-h-screen min-h-screen">
    <div 
    class:hidden={isShowingMobileSection}
    class:md:hidden={isFocused}
    class:z-40={!isShowingMobileSection}
    class="fixed top-0 left-0 right-0 bottom-16 md:bottom-0 md:relative md:flex md:flex-col bg-[--dark-800] md:w-80">
        <a href="/{course.id}">
            {#if course?.public_url}
                <div class="bg-cover" style="background-image:url({course.public_url})">
                    <div class="md:w-80 flex flex-col bg-top h-52 bg-gradient-to-b from-black">
                        <div class="flex p-2">
                            <h1 class="px-2 text-white text-ellipsis overflow-hidden whitespace-nowrap text-lg font-semibold">{course?.title}</h1>
                        </div>
                    </div>
                </div>
            {/if}
        </a>
        <div class="w-full flex flex-col overflow-scroll">
            {#each modules as module(module.id)}
            <Module on:click={() => isShowingMobileSection = true} on:update={sortModules} bind:supabase sections={module.sections} courseId={course.id} bind:num={module.num} id={module.id} bind:name={module.name}></Module>
            {/each}
            <button class="items-center mx-auto p-2" on:click={() => {showNewModulePopup = true}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
        </div>
    </div>

    <div
    class:z-30={isShowingMobileSection || isFocused}
    class:fixed={isFocused}
     class="top-0 md:block bg-black left-0 right-0 bottom-16 md:bottom-0 overflow-y-scroll overflow-x-hidden w-full">
        <div class="absolute z-10 flex from-black to-transparent bg-gradient-to-r">
            <!-- MOBILE -->
            <button
            class="block md:hidden px-3 p-2" on:click={() => {isShowingMobileSection = !isShowingMobileSection}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
            </button>
            <!-- DESKTOP -->
            <button
            class="hidden md:block px-3 p-2" on:click={() => {isFocused = !isFocused;}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
            </button>
            <div class="py-2">
                {#if $page.params.section}
                    {section?.name}
                {/if}
            </div>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</div>