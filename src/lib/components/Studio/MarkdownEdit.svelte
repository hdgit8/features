<script lang="ts">
	import { browser } from "$app/environment";
	import { debounce } from "$lib/utils/debounce";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import { onMount } from "svelte";
    export let supabase: SupabaseClient;
    export let sectionId: String;
    export let markdownValue: String;

    async function save() {
        const {data} = await supabase.from("sections").update({
            markdown: markdownValue,
        }).eq("id", sectionId).select("markdown");
    }

    onMount(() => {
        if (browser) {
            document.getElementById('textbox').addEventListener('keydown', function(e) {
                if (e.key == 'Tab') {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    // set textarea value to: text before caret + tab + text after caret
                    this.value = this.value.substring(0, start) +
                    "\t" + this.value.substring(end);

                    // put caret at right position again
                    this.selectionStart =
                    this.selectionEnd = start + 1;
                }
            });
        }
    })
</script>

<textarea id="textbox" bind:value={markdownValue} on:keyup={debounce(save)} placeholder="Write your tutorial..." style="min-height:20rem" class="text-gray-700 min-w-full max-w-full p-2 rounded" />