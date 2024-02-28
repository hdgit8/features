<script lang="ts">
    import Button from "./Button.svelte";
    import messageStore from "$lib/stores/message.store";
    import { clickOutside } from "$lib/utils/clickOutside.js";

    import type {SupabaseClient} from "@supabase/supabase-js"
	import { createEventDispatcher } from "svelte";
	import Section from "./Section.svelte";
    export let supabase: SupabaseClient;
    export let num: number;
    export let name: string;
    export let moduleId: string;
    export let courseId: string;
    export let sections: Array<Map<string, any>>;

    const dispatch = createEventDispatcher();

    async function loadSections() {
        const{data} = await supabase.from("sections").select().eq("course_id", courseId).eq("module_id", moduleId)
        if (data)
        {
            sections = data;
        }
    }

    let showNewSectionPopup = false;
    let sectionName = "";
    async function createNewSection() {
        if (sectionName === "") return;

        showNewSectionPopup = false

        try {
            await supabase.from("sections").insert({
                name: sectionName,
                course_id: courseId,
                module_id: moduleId
            });
        } catch (e) {
            console.error(e)
            messageStore.showError(e.message);
        }
        loadSections();
    }

    let showSettings = false;
    let nameValue = name;
    let numValue = num;
    async function saveChanges() {
        name = nameValue;
        num = numValue;
        
        await supabase.from('modules').update({
            name: nameValue,
            num: numValue
        }).eq("id", moduleId)

        showSettings = false;

        dispatch("update");
    }

    function sortSections() {
        if (!sections) {
            console.log('did not sort sections')
            return;
        }

        sections = sections.sort((a, b) => {
            if (a.num > b.num) return 1;
            return -1;
        })
    }
</script>

<button class="module bg-[--dark-800]">
    <a href="/{courseId}/{moduleId}" class="flex p-3 font-semibold text-lg">
        <div class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M9.58 1.077a.75.75 0 0 1 .405.82L9.165 6h4.085a.75.75 0 0 1 .567 1.241l-6.5 7.5a.75.75 0 0 1-1.302-.638L6.835 10H2.75a.75.75 0 0 1-.567-1.241l6.5-7.5a.75.75 0 0 1 .897-.182Z" clip-rule="evenodd" />
            </svg>
        </div>
        <div class="text-center w-6 font-mono">
            {num}
        </div>
        <div>
            {name}
        </div>
        <button on:click={()=> {showNewSectionPopup=true}} class="ml-auto module-hovered px-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
        </button>
        <button on:click={()=> {showSettings = true}} class="module-hovered px-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M6.455 1.45A.5.5 0 0 1 6.952 1h2.096a.5.5 0 0 1 .497.45l.186 1.858a4.996 4.996 0 0 1 1.466.848l1.703-.769a.5.5 0 0 1 .639.206l1.047 1.814a.5.5 0 0 1-.14.656l-1.517 1.09a5.026 5.026 0 0 1 0 1.694l1.516 1.09a.5.5 0 0 1 .141.656l-1.047 1.814a.5.5 0 0 1-.639.206l-1.703-.768c-.433.36-.928.649-1.466.847l-.186 1.858a.5.5 0 0 1-.497.45H6.952a.5.5 0 0 1-.497-.45l-.186-1.858a4.993 4.993 0 0 1-1.466-.848l-1.703.769a.5.5 0 0 1-.639-.206l-1.047-1.814a.5.5 0 0 1 .14-.656l1.517-1.09a5.033 5.033 0 0 1 0-1.694l-1.516-1.09a.5.5 0 0 1-.141-.656L2.46 3.593a.5.5 0 0 1 .639-.206l1.703.769c.433-.36.928-.65 1.466-.848l.186-1.858Zm-.177 7.567-.022-.037a2 2 0 0 1 3.466-1.997l.022.037a2 2 0 0 1-3.466 1.997Z" clip-rule="evenodd" />
              </svg>                      
        </button>
    </a>
    {#if sections.length}
        <div class="p-3 bg-[--dark-900] flex flex-col gap-2">
            {#each sections as section(section.id)}
                <Section on:update={sortSections} {supabase} moduleId={moduleId} courseId={courseId} bind:moduleNum={num} sectionId={section.id} bind:name={section.name} bind:num={section.num}></Section>
            {/each}
        </div>
    {/if}
</button>

{#if showNewSectionPopup}
<div class="fixed z-50 top-0 left-0 right-0 bottom-0 flex" style="background-color:rgba(0, 0, 0, 0.5);">
    <div class="m-auto bg-[--dark-800] p-5 rounded-lg flex flex-col gap-3" use:clickOutside on:click_outside={() => {showNewSectionPopup = false}}>
        <div>
            <div>Section</div>
            <input bind:value={sectionName} type="text" class="rounded p-2" placeholder="Section...">
        </div>
        <div>
            <Button disabled={sectionName === ""} on:click={createNewSection}>Create Section</Button>
        </div>
    </div>
</div>
{/if}

{#if showSettings}
<div class="fixed z-50 top-0 left-0 right-0 bottom-0 bg-[--dark-800]">
    <div class="flex flex-col w-full">
        <button on:click={()=>{showSettings = false}} class="ml-auto p-3">Close</button>
        <div class="flex flex-col p-3 font-semibold text-lg gap-2">
            <div>
                <div>Module Number</div>
                <input type="number" class="p-2 rounded" bind:value={numValue} />
            </div>
            <div>
                <div>Module Name</div>
                <input class="p-2 rounded" bind:value={nameValue} />
            </div>
        </div>
        {#if name !== nameValue || num !== numValue}
            <button on:click={saveChanges} class="ml-auto p-3 rounded">Save</button>
        {/if}
    </div>
</div>
{/if}

<style>
    .module-hovered {
        @apply opacity-0;
    }

    .module:hover .module-hovered {
        @apply opacity-100;
    }
</style>