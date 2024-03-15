<script lang="ts">
    import "../app.css"

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

<slot />

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
