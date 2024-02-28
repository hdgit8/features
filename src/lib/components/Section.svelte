<script lang="ts">
    import type { SupabaseClient } from "@supabase/supabase-js"
	import { createEventDispatcher } from "svelte";
    export let supabase: SupabaseClient;
    export let name:string;
    export let num:number;
    export let sectionId:string;
    export let moduleNum: number;
    export let courseId: string;
    export let moduleId: string;
    let showSettings = false;

    let nameValue = name;
    let numValue = num;

    const dispatch = createEventDispatcher();

    async function saveChanges() {
        num = numValue
        name = nameValue;

        await supabase.from("sections").update({
            name: nameValue,
            num: numValue,
        }).eq("id", sectionId)

        showSettings = false;

        dispatch("update");
    }
</script>

<div class="flex section">
    <a href="/{courseId}/{moduleId}/{sectionId}">{moduleNum}.{num} - {name}</a>
    <button class="ml-auto section-hovered" on:click={() => {showSettings = true}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M6.455 1.45A.5.5 0 0 1 6.952 1h2.096a.5.5 0 0 1 .497.45l.186 1.858a4.996 4.996 0 0 1 1.466.848l1.703-.769a.5.5 0 0 1 .639.206l1.047 1.814a.5.5 0 0 1-.14.656l-1.517 1.09a5.026 5.026 0 0 1 0 1.694l1.516 1.09a.5.5 0 0 1 .141.656l-1.047 1.814a.5.5 0 0 1-.639.206l-1.703-.768c-.433.36-.928.649-1.466.847l-.186 1.858a.5.5 0 0 1-.497.45H6.952a.5.5 0 0 1-.497-.45l-.186-1.858a4.993 4.993 0 0 1-1.466-.848l-1.703.769a.5.5 0 0 1-.639-.206l-1.047-1.814a.5.5 0 0 1 .14-.656l1.517-1.09a5.033 5.033 0 0 1 0-1.694l-1.516-1.09a.5.5 0 0 1-.141-.656L2.46 3.593a.5.5 0 0 1 .639-.206l1.703.769c.433-.36.928-.65 1.466-.848l.186-1.858Zm-.177 7.567-.022-.037a2 2 0 0 1 3.466-1.997l.022.037a2 2 0 0 1-3.466 1.997Z" clip-rule="evenodd" />
        </svg>
    </button>
</div>

{#if showSettings}
<div class="fixed z-50 top-0 left-0 right-0 bottom-0 bg-[--dark-800]">
    <div class="flex flex-col w-full">
        <button on:click={()=>{showSettings = false}} class="ml-auto p-3">Close</button>
        <div class="flex flex-col p-3 font-semibold text-lg gap-2">
            <div>
                <div>Section Number</div>
                <input type="number" class="p-2 rounded" bind:value={numValue} />
            </div>
            <div>
                <div>Section Name</div>
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
    .section-hovered {
        @apply opacity-0;
    }

    .section:hover .section-hovered {
        @apply opacity-100;
    }
</style>