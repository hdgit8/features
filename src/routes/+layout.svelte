<script lang="ts">
    import "../app.css"

    import Navigator from "$lib/components/Navigator.svelte"
    import Message from "$lib/components/Message.svelte"
    import Button from "$lib/components/Button.svelte";

	import { onMount } from "svelte";

	import messageStore from "$lib/stores/message.store"
	import policyStore from "$lib/stores/policy.store"
	import { invalidate, invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

	let ready = false;

	onMount(() => {
		if (!$policyStore.accepted) {
			messageStore.showAlert(
				'By continuing, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.'
			);
		}

        ready = true;

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
                invalidateAll()
            }
        });

        return () => subscription.unsubscribe();
	});
</script>

<svelte:head> 
 	<title>Sparker - Learn To Code</title>
</svelte:head>

<!-- navigation -->
<Navigator>
    <a href="/" class="hidden md:flex pt-1 mx-auto transition-all">
        <div 
            class="flex h-14 transition-all opacity-90 hover:opacity-100">
            <img
                class="h-8 m-auto"
                src="/sparker_white.png" alt="logo">
        </div>
    </a>
    
    <div class="flex w-full md:w-auto justify-between md:flex-col gap-3 transition-all mx-4 rounded-2xl py-3">
        <a href="/" title="Explore">
            <Button align="left" active={$page.url.pathname === "/"}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm4.03 6.28a.75.75 0 0 0-1.06-1.06L4.97 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06L6.56 10l1.72-1.72Zm4.5-1.06a.75.75 0 1 0-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </Button>
        </a>
        <a href="/dm" title="Messages">
            <Button align="left" active={$page.url.pathname === "/dm"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 01-5.183.501.78.78 0 00-.528.224l-3.579 3.58A.75.75 0 016 17.25v-3.443a41.033 41.033 0 01-2.57-.33C1.993 13.244 1 11.986 1 10.573V5.426c0-1.413.993-2.67 2.43-2.902z" clip-rule="evenodd" />
                </svg>
            </Button>
        </a>
        <a href="/auth" title="Profile">
            <Button align="left" active={$page.url.pathname === "/auth"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clip-rule="evenodd" />
                </svg>
            </Button>
        </a>
        <a href="/dash" title="Dashboard">
            <Button align="left" active={$page.url.pathname === "/dash"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
                </svg>
            </Button>
        </a>
    </div>

</Navigator>

<!-- app  -->
<div class="md:pl-16 w-[100vw] h-screen">
    <!-- homepage content -->
    <div class="overflow-y-scroll pb-16 md:pb-0">
        <slot></slot>
    </div>
</div>

<!-- global message -->
<Message
    onAccept={() => {
        policyStore.accept();
    }} 
/>

<style>
    :root {
        --bg-base-900: #16181b;
        --bg-base-800: #202327;

        --dark-500: rgb(53, 54, 58);
        --dark-600: rgb(41, 42, 45);
        --dark-700: rgb(32, 33, 36);
        --dark-800: rgb(25, 26, 29);
        --dark-900: rgb(18, 19, 21);
        --dark-950: rgb(12, 13, 15);
    }
</style>
