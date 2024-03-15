<script lang="ts">
	import messageStore from "$lib/stores/message.store";
	import { onMount } from "svelte";
    import Button from "$lib/components/Button.svelte";
	import { goto } from "$app/navigation";
	import { debounce } from "$lib/utils/debounce";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

    let name:string = "";
    let username:string = "";
    let profileImageUrl:string = "";
    let profileBio:string = "";
    let validUsername:string = "loading";

    let randomPositiveMessage = [
        "schweet, looks like you are good to go.",
        "mom. looks I'm gonna be grinding for awhile.",
        "thats... an affirmative.",
        "dev here ;D we got you bro.",
        "huh, thats interesting.",
    ];
    let positiveMessage = randomPositiveMessage[0];

    async function checkIfUsernameValid() {
        validUsername = "loading";

        const {data, error} = await supabase.from("profiles").select().eq("username", username)
        if (data && data.length) {
            validUsername = "nope!";
            return;
        }

        validUsername = "thats_an_affirmative_sir"
        positiveMessage = randomPositiveMessage[Math.floor(Math.random() * randomPositiveMessage.length)]
    }

    async function createProfile() {
        if (!session) return;
        if (!session.user) return;

        if (!validUsername) {
            messageStore.showError("Username already taken.")
            return;
        }

        if (!name) {
            messageStore.showError("Must input a name.")
            return;
        }

        if (!username) {
            messageStore.showError("Must input a username.")
            return;
        }

        const { data, error } = await supabase.from("profile").upsert({
            user_id: session.user.id,
            username,
            name,
            image_path:profileImageUrl,
            bio:profileBio,
        })

        if (error) {
            console.log(error)
            messageStore.showError("There was an error. '" + error.message + "'");
            return;
        }

        goto("/home")
    }
</script>

<div class="flex p-3 px-4 absolute top-0 w-full">
    <a href="/" class="flex hover:opacity-80">
        <img alt="sparker" src="/sparker_white.png" class="h-9 p-1">
        <div class="text-white text-xl font-medium p-1">Sparker3D.com</div>
    </a>
</div>

<div class="flex w-full h-[100vh]">
    <div class="w-full lg:w-1/3 pt-10 flex flex-col text-white px-5">
        <!-- FORM -->
        <div class="flex flex-col gap-3 mx-auto w-full max-w-sm mt-10">
            <div class="mb-2 mt-5">
                <h3 class="text-2xl">Build Your Profile</h3>
            </div>
            <input bind:value={name} type="text" required placeholder="Your Name" class="text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded-lg bg-[--dark-700]">
            <div class="w-full">
                <input bind:value={username} on:input={debounce(checkIfUsernameValid)} type="text" required placeholder="@ username" class="text-gray-200 placeholder:text-gray-400 w-full p-2 px-3 text-base rounded-lg bg-[--dark-700]">
                {#if username}
                    {#if validUsername === "thats_an_affirmative_sir"}
                    <div class="text-green-500">
                        {positiveMessage} your username will be @{username}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 inline-block">
                            <path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    {:else if validUsername === "loading"}
                    <div>
                        <span>checking</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 animate-spin inline-block">
                            <path fill-rule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    {:else}
                    <div class="text-red-500">
                        heh, looks like they got that one.
                    </div>
                    {/if}
                {/if}
            </div>
            <input bind:value={profileImageUrl} type="text" required placeholder="Profile Image URL" class="text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded-lg bg-[--dark-700]" />
            <textarea bind:value={profileBio} required placeholder="Profile Bio" class="text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded-lg bg-[--dark-700]"></textarea>

            {#if name && username && validUsername === "thats_an_affirmative_sir"}
                <Button on:click={createProfile}>
                    <span>Create Profile</span>
                </Button>
            {/if}
        </div>
        <div class="mx-auto max-w-sm w-full text-sm text-gray-500 mt-auto p-5 pb-10">
            By continuing, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.
        </div>
    </div>
    <div class="h-[100vh] hidden lg:block lg:w-2/3 bg-cover bg-center" style="background-image:url('/relaxing.png');"></div>
</div>