<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import messageStore from "$lib/stores/message.store";
	import { debounce } from "$lib/utils/debounce";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import { onMount } from "svelte";
	import Livecode from "../Codecast/Livecode.svelte";
	import Recordcast from "../Codecast/Recordcast.svelte";
	import { readable } from "svelte/store";
	import { decode, encode } from "@msgpack/msgpack";
	import { compressByteArray, decompressByteArray } from "$lib/utils/compress";

    export let supabase: SupabaseClient;
    export let sectionId: String;
    export let section_embeds: Array<any>;
    export let section_codecasts: Array<any>;

    const path = `courses/${sectionId}`;
    const changesPath = `${path}/codecast.mpack.gz`
    const audioPath = `${path}/codecast.mp4`

    onMount(async () => {
        if (section_codecasts.length > 0)
        {
            const duration = section_codecasts[0].duration;
            const { data:audioData } = supabase.storage.from('codecasts').getPublicUrl(audioPath)
            const { data:changesData, error } = await supabase.storage.from('codecasts').download(changesPath)
            if (error) {
                console.error(error);
                messageStore.showError(error.message);
            }

            if (audioData && changesData) {
                const mpack = await decompressByteArray(new Uint8Array(await changesData.arrayBuffer()), "gzip");
                const changes = decode(mpack);
			    await recordcast.loadData(audioData.publicUrl, changes, duration);
            }
        }

        if (section_embeds.length > 0) {
            embedURL = section_embeds[0].url;
            sectionEmbedId = section_embeds[0].id;

            const url = new URL(section_embeds[0].url);
            if (url.hostname.includes("youtu")) {
                embedType = "yt";

                const v = url.searchParams.get("v")
                if (!v) {
                    messageStore.showError("Url missing video id.")
                    return;
                }

                embedId = v;
                return;
            } else {
                messageStore.showError("Url not a Youtube link.")
            }
        }
    });
    
    let embedType = "yt"; // yt, or vim
    let embedId = "";
    let embedURL = "";
    async function saveEmbed() {
        const {error, data} = await supabase.from("section_embeds").update({
            url: embedURL,
        }).eq("id", sectionEmbedId).eq("section_id", sectionId).select();

        if (data) {
            section_embeds = data;

            embedURL = section_embeds[0].url;
            const url = new URL(section_embeds[0].url);
            if (url.hostname.includes("youtu")) {
                embedType = "yt";

                const v = url.searchParams.get("v")
                if (v) {
                    embedId = v;
                } else {
                    messageStore.showError("Url missing video id.")
                }
            }
        }

        if (error) console.error(error);

        console.log('saved embed')
    }
    async function addEmbed() {
        const {error, data} = await supabase.from("section_embeds").insert({
            section_id: sectionId,
            url: embedURL,
        }).select();

        if (data) {
            section_embeds = data;
        }

        if (error) console.error(error);
    }

    let recordcast: Recordcast;
    async function saveCodecast() {
        const {changes, duration, audio} = recordcast.getData();

        if (!sectionId) {
            console.log("no section id exiting save")
            return;
        };

        const {error, data} = await supabase.from("section_codecasts").update({
            path,
            duration,
            thumbnail_code: changes.text[changes.text.length - 1]
        }).eq("section_id", sectionId).select();

        if (!data?.length) {
            console.log("data returned has no length! returning");
            return;
        };

        console.log("data", data)

        if (data && !error) {
            section_codecasts = data;

            const mpack = encode(changes);
            const gz = await compressByteArray(mpack, 'gzip');

            const {error: er1} = await supabase.storage.from("codecasts").upload(changesPath, gz, {upsert:true})
            if (er1) {messageStore.showError(er1.message); console.error(er1)}
            const {error: er2} = await supabase.storage.from("codecasts").upload(audioPath, audio.mp4Blob, {upsert:true})
            if (er2) {messageStore.showError(er2.message); console.error(er2)}
        }

        if (error) console.error(error);

        console.log('saved codecast')
    }

    async function addCodecast() {
        const {error, data} = await supabase.from("section_codecasts").insert({
            section_id: sectionId,
        }).select();

        if (data) {
            section_codecasts = data;
        }

        if (error) console.error(error);
    }

</script>

{#if section_embeds.length > 0}
    <div class="flex-col items-center pt-2 gap-2 flex">
        <div class="w-full">
            <input on:keyup={debounce(saveEmbed)} class="w-full p-1 rounded text-gray-500" type="text" placeholder="Youtube or Vimeo link" bind:value={embedURL}>
        </div>
        <div class="w-full max-h-96">
            {#if embedType == "yt"}
                <iframe style="width:100%;"
                class="aspect-video rounded max-h-96" 
                src="https://www.youtube.com/embed/{embedId}?si=Jtz7-tzqf7Z8JU9M&showinfo=0&modestbranding=1" 
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen></iframe>
            {:else}
                <div class="w-full h-80 flex items-center justify-center bg-black rounded">
                    <svg class="w-6 h-6 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                    </svg>
                </div>
            {/if}
        </div>
    </div>
{:else if section_codecasts.length > 0}
    <div>
        <Recordcast bind:this={recordcast} on:ready={saveCodecast}></Recordcast>
    </div>
{:else}
    <div class="h-96 flex items-center">
        <button on:click={addCodecast} class="mx-auto bg-gray-300 hover:opacity-100 opacity-70 p-2 rounded text-gray-700">Add Codecast</button>
        <button on:click={addEmbed} class="mx-auto bg-gray-300 hover:opacity-100 opacity-70 p-2 rounded text-gray-700">Add Youtube Embed</button>
    </div>
{/if}