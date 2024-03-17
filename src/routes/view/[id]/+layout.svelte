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

    let modules = course?.modules;
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

    let open = true;
    function toggle() {
        open = !open;
        console.log("closing")
    }

    let showSettings = false;

</script>

{#if showSettings}
    <Settings bind:showSettings={showSettings} bind:supabase={supabase} bind:course={course}></Settings>
{/if}

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

<!-- SIDEBAR -->
<div class="sm:w-80 w-[calc(100vw-4rem)] bg-white/5 h-screen overflow-y-scroll md:overflow-x-hidden fixed top-0 left-0 bottom-0">
    <div class="flex px-2 py-1 w-full">
        <a href="/" class="flex hover:opacity-80">
            <img alt="sparker" src="/sparker_white.png" class="h-9 p-1">
        </a>

        <button class="ml-auto p-2" on:click={() => {
            showSettings = true;
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 m-auto">
                <path fill-rule="evenodd" d="M6.455 1.45A.5.5 0 0 1 6.952 1h2.096a.5.5 0 0 1 .497.45l.186 1.858a4.996 4.996 0 0 1 1.466.848l1.703-.769a.5.5 0 0 1 .639.206l1.047 1.814a.5.5 0 0 1-.14.656l-1.517 1.09a5.026 5.026 0 0 1 0 1.694l1.516 1.09a.5.5 0 0 1 .141.656l-1.047 1.814a.5.5 0 0 1-.639.206l-1.703-.768c-.433.36-.928.649-1.466.847l-.186 1.858a.5.5 0 0 1-.497.45H6.952a.5.5 0 0 1-.497-.45l-.186-1.858a4.993 4.993 0 0 1-1.466-.848l-1.703.769a.5.5 0 0 1-.639-.206l-1.047-1.814a.5.5 0 0 1 .14-.656l1.517-1.09a5.033 5.033 0 0 1 0-1.694l-1.516-1.09a.5.5 0 0 1-.141-.656L2.46 3.593a.5.5 0 0 1 .639-.206l1.703.769c.433-.36.928-.65 1.466-.848l.186-1.858Zm-.177 7.567-.022-.037a2 2 0 0 1 3.466-1.997l.022.037a2 2 0 0 1-3.466 1.997Z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
    <a href="/{course.id}" target="_blank">
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

<!-- CONTENT (MODULE and SECTION) -->
<div 
    class:sm:left-80={open}
    class:left-[calc(100vw-4rem)]={open}
    class:lg:w-[calc(100vw-20rem)]={open}
    class="overflow-x-hidden w-screen bg-black overflow-y-scroll fixed z-10 top-0 right-0 bottom-0 h-screen m-0 p-0">
    <div class="flex absolute left-0 right-0 top-0">
        <button class="p-3" on:click={toggle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
            </svg>
        </button>
        <div class="p-2 text-white/95">
            {#if $page.params.sectionId}
                {section?.name}
            {:else if $page.params.moduleId}
                {module?.name}
            {/if}
        </div>
    </div>
    <div class="pt-11 h-full w-full">
        <slot></slot>
    </div>
</div>