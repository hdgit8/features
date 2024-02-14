<script>
    import Auth from '$lib/components/Auth.svelte';
    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes
</script>

<svelte:head>
    <title>Sparker - Messages</title>
</svelte:head>

<!-- Login and Signup -->
<Auth {supabase} {session}></Auth>

Direct Messages