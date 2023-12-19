<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "$lib/components/Button.svelte";
	import navStore from "$lib/stores/nav.store";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

    let title: string = "";
    let loading = false;

    navStore.title("Dashboard / New", "/dash")

    async function createNewCourse() {
        if (loading) return;

        loading = true;

        const {data} = await supabase.from("courses").insert({
            user_id: session?.user.id,
            title
        }).select()
        
        if (!data) {
            return;
        }

        goto(`/dash/course/${data[0].id}`)
    }
</script>

<svelte:head>
    <title>Dashboard / New</title>
</svelte:head>

{#if session}
<div
class:pl-5={!$navStore.isOpen}
class="w-full h-full flex flex-col pr-5 mt-[5vh]">
    <div class="bg-white dark:bg-[--dark-800] w-full max-w-xl rounded-xl p-5 flex flex-col gap-3 mx-auto">
        <label class="mx-auto">
            <div class="uppercase text-xs font-bold py-2">Title</div>
            <input required bind:value={title} id="name" name="name" autocomplete="off" type="text" placeholder="e.g Pixel Gun Multiplayer FPS" class="text-black  md:w-96 w-full  dark:text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded bg-gray-100 dark:bg-[--dark-700]">
        </label>

        <button on:click={createNewCourse} type="submit" disabled={title === "" || loading} class="bg-gray-100 disabled:opacity-50 dark:bg-[--dark-700] mx-auto md:w-96 w-full p-2 rounded-lg mt-5 hover:text-black dark:hover:text-white">
            Create Course
        </button>
    </div>
</div>
{:else}
You must be logged in
{/if}