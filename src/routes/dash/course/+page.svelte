<script lang="ts">
	import { goto } from "$app/navigation";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

    let title: string = "";
    let loading = false;

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
<div class="w-full h-full flex flex-col pr-5 mt-[5vh]">
    <div class="bg-[--dark-800] w-full max-w-xl rounded-xl p-5 flex flex-col gap-3 mx-auto">
        <label class="mx-auto">
            <div class="uppercase text-xs font-bold py-2">Title</div>
            <input required bind:value={title} id="name" name="name" autocomplete="off" type="text" placeholder="e.g Pixel Gun Multiplayer FPS" class="md:w-96 w-full text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded bg-[--dark-700]">
        </label>

        <button on:click={createNewCourse} type="submit" disabled={title === "" || loading} class="disabled:opacity-50 bg-[--dark-700] mx-auto md:w-96 w-full p-2 rounded-lg mt-5 hover:text-white">
            Create Course
        </button>
    </div>
</div>
{:else}
You must be logged in
{/if}