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
	import { goto } from "$app/navigation";

    let open = false;
    export let data;
    let { supabase, session, course } = data
    $: ({ supabase, session, course } = data) // listen to changes

    let firstLoad = true;
    let section;
    let module;
    $: (async function () {
        if (!$page.params.moduleId && !$page.params.sectionId) {
            if (!firstLoad) {
                isFocused = true;
                firstLoad = false;
            }
            isShowingMobileSection = true;
        }

        if (!$page.params.moduleId) return
        const{data:dat1} = await supabase.from("modules").select().eq("id", $page.params.moduleId)
        if (dat1)
        {
            module = dat1[0];
        }

        if (!$page.params.sectionId) return
        const{data} = await supabase.from("sections").select().eq("id", $page.params.sectionId)
        if (data)
        {
            section = data[0];
        }
    })()

    onMount(async () => {
        await loadModules($page.params.id);
    });

    let isFocused = false;
    let isShowingMobileSection = false;

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
    class="fixed top-0 left-0 right-0 bottom-16 md:bottom-0 md:relative md:flex md:flex-col md:w-80 bg-black">
        <div class="flex pt-3 pb-2 px-4 w-full backdrop-blur-sm backdrop-brightness-100">
            <a href="/" class="flex hover:opacity-80">
                <img alt="sparker" src="/sparker_white.png" class="h-9 p-1">
            </a>
            <div>
                
            </div>
        </div>
        <a href="/{course.id}">
            {#if course?.public_url}
                <div class="bg-cover" style="background-image:url({course.public_url})">
                    <div class="md:w-80 flex flex-col bg-top h-52 bg-gradient-to-b from-black">
                        <div class="flex p-2">
                            <h1 class="px-2 text-white text-ellipsis text-lg font-semibold">
                                {course?.title} 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 inline-block">
                                    <path fill-rule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" />
                                </svg>
                            </h1>
                        </div>
                    </div>
                </div>
            {/if}
        </a>
        <div class="w-full flex flex-col overflow-scroll p-2 gap-3">
            {#each modules as module(module.id)}
            <Module on:update={sortModules} bind:supabase sections={module.sections} courseId={course.id} bind:num={module.num} moduleId={module.id} bind:name={module.name}></Module>
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
                {#if $page.params.sectionId}
                    {section?.name}
                {:else if $page.params.moduleId}
                    {module?.name}
                {/if}
            </div>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .menu {
        @apply flex flex-col items-start justify-start;
    }
</style>