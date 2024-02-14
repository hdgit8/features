<script lang="ts">
	import { page } from "$app/stores";

	import type { SupabaseClient } from "@supabase/supabase-js";
	import MarkdownEdit from "./MarkdownEdit.svelte";
	import ImagesEdit from "./ImagesEdit.svelte";
	import MediaEdit from "./MediaEdit.svelte";
    export let supabase: SupabaseClient;

    export let section: any;
    export let showStudioView: Boolean;
</script>

<div class="fixed z-50 top-0 left-0 right-0 bottom-0 bg-[--dark-800] p-3 overflow-y-scroll">
    <div class="flex">
        <div class="p-2 text-white flex items-center justify-center gap-2">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M9.58 1.077a.75.75 0 0 1 .405.82L9.165 6h4.085a.75.75 0 0 1 .567 1.241l-6.5 7.5a.75.75 0 0 1-1.302-.638L6.835 10H2.75a.75.75 0 0 1-.567-1.241l6.5-7.5a.75.75 0 0 1 .897-.182Z" clip-rule="evenodd" />
                </svg>
            </div>
            <div>
                {section?.name}
            </div>
        </div>
        <button on:click={()=>{showStudioView = false}} class="ml-auto opacity-50 hover:opacity-100 p-2 px-3 rounded-full text-white bg-black border-black hover:border-white border-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
    <div class="flex flex-col gap-2">
        <MediaEdit {supabase} section_embeds={section.section_embeds} sectionId={section.id}></MediaEdit>
        <ImagesEdit></ImagesEdit>
        <MarkdownEdit markdownValue={section.markdown} {supabase} sectionId={section.id}></MarkdownEdit>
    </div>
</div>