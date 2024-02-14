<script lang="ts">
	import { page } from "$app/stores";
	import Studio from "$lib/components/Studio/Studio.svelte";
	import { json } from "@sveltejs/kit";
	import { onMount } from "svelte";
    import marked from "$lib/markdown/markdown.js";
	import messageStore from "$lib/stores/message.store";

    export let data;
    let { supabase, session, section, markdown } = data
    $: ({ supabase, session, section, markdown } = data) // listen to changes

    let showStudioView = false;
    $: if (showStudioView === false) {
        loadSection($page.params.sectionId)
    }

    let embedId = "";
    $: loadSection($page.params.sectionId);
    async function loadSection(sectionID:String) {
        const{data} = await supabase.from("sections").select("*, section_embeds(*)").eq("id", sectionID)
        if (data)
        {
            section = data[0];
            if (section.markdown) {
                markdown = await marked.parse(section.markdown)
            }

            if (section.section_embeds.length > 0) {
                const url = new URL(section.section_embeds[0].url);
                if (url.hostname.includes("youtu")) {
                    const v = url.searchParams.get("v")
                    if (v) {
                        embedId = v;
                    } else {
                        messageStore.showError("Url missing video id.")
                    }
                }
            }
        }
    }
</script>

<div class="p-2 flex min-w-max">
    <button on:click={() => {showStudioView = true}} class="ml-auto hover:opacity-100 opacity-70 text-gray-200 p-1 px-2 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
            <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
        </svg>
    </button>
</div>

<div class="overflow-scroll">
    {#if section.section_embeds.length > 0}
        <iframe style="width:100%;" 
        class="aspect-video" 
        src="https://www.youtube.com/embed/{embedId}?si=Jtz7-tzqf7Z8JU9M&showinfo=0&modestbranding=1&autoplay=1" 
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen></iframe>
    {/if}

    <div class="mx-auto p-3 markdown-body">
        {@html markdown}
    </div>
</div>

{#if showStudioView}
    <Studio {supabase} bind:section={section} bind:showStudioView={showStudioView}></Studio>
{/if}

<style scoped>
    .max-h-video {
        max-height: calc(90vh);
    }

    .markdown-body {
        box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
        background-color: transparent;
    }

    @media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>