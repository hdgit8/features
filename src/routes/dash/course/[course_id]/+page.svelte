<script lang="ts">
	import messageStore from "$lib/stores/message.store.js";
	import navStore from "$lib/stores/nav.store";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

    let bannerInput;
    let bannerImage;

    let loading = false;

    navStore.title(`Dashboard / ${data.title}`, "/dash")

    async function onChangeBanner(event) {
        if (!event.target.files) return;

        const file = event.target.files[0]

        if (!file.type.includes("image")) return;

        loading = true;
        console.log("uploading image")

        const reader = new FileReader();
        reader.addEventListener("load", function() {
            bannerImage.setAttribute("src", reader.result)
        });

        messageStore.showLoading("Uploading...", () => loading)

        const bannerPath = `${data.course.id}/banner.${file.type.split('/')[1]}`;
        const result = await supabase
        .storage
        .from("courses")
        .upload(bannerPath, file)

        // once uploaded show preview
        reader.readAsDataURL(file);

        loading = false;
    }
</script>

<svelte:head>
    <title>{`Dashboard / ${data.title}`}</title>
</svelte:head>

{#if session}
<div
class:ml-5={!$navStore.isOpen}
class="mr-5 bg-white dark:bg-[--dark-800] rounded-lg transition-all">
    <div class="p-5 flex flex-col gap-3">
        <label for="banner" class="max-w-xl">
            <div class="uppercase text-xs font-bold py-2">Banner</div>
            {#if data.banner_public_url}
                <div
                    bind:this={bannerImage}
                    style="background-image:url({data.banner_public_url})"
                    class="bg-cover bg-left max-h-52 rounded-lg aspect-video overflow-hidden flex flex-col gap-3 border border-dashed border-black dark:border-gray-200 w-full bg-gray-100 dark:bg-[--dark-700]"
                >
                    <div class="h-full w-full bg-gradient-to-r from-black via-70% via-transparent to-transparent p-4 flex flex-col">
                        <h3 class="text-3xl font-medium md:text-4xl p-3 w-2/3">{data.course.title}</h3>
                    </div>
                </div>
            {:else}
                <div
                    bind:this={bannerImage}
                    style="background-image:url({data.banner_public_url})"
                    class="bg-cover bg-left md:max-h-52 rounded-lg aspect-video overflow-hidden flex flex-col gap-3 border border-dashed border-black dark:border-gray-200 w-full bg-gray-100 dark:bg-[--dark-700]"
                >
                    <div class="h-full w-full bg-gradient-to-r from-black via-70% via-transparent to-transparent p-4 flex md:flex-row flex-col">
                        <h3 class="text-3xl font-medium md:text-4xl p-3 w-2/3">{data.title}</h3>
                        <div class="flex flex-col content-center justify-center text-center">
                            <div class="mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                            <div>click to upload image</div>
                        </div>
                    </div>
                </div>
            {/if}
            <input
                name="banner"
                bind:this={bannerInput}
                on:change={onChangeBanner}
                id="banner"
                type="file"
                accept=".jpg, .jpeg, .png, .webp"
                class="hidden"
                required
            />
        </label>
        <label>
            <div class="uppercase text-xs font-bold py-2">Course Name</div>
            <input class="p-3 w-full bg-[--dark-600] rounded-md" type="text" value={data.title}>
        </label>
    </div>
</div>
{:else}
You must be logged in
{/if}