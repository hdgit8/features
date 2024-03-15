<!-- ProfilePage.svelte -->
<script>
	import Navbar from "$lib/components/Navbar.svelte";

    export let subscribers;
    export let videos;

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes
</script>

<Navbar bind:session={session} bind:supabase={supabase}></Navbar>

<main class="profile-page">
<header>
    <div class="profile-header pt-16">
    <img src="{data?.user?.image_path}" alt="{data?.user?.name}" class="profile-pic">
    <div class="profile-info">
        <h1>{data?.user?.name}'s Profile</h1>
        <p>{data?.user?.bio}</p>
        <div class="stats">
        <span>@{data?.user?.username}</span>
        </div>
    </div>
    </div>
</header>
<!-- Additional content goes here -->
</main>

<style>
.profile-page {
    color: #fff;
    padding: 20px;
}

.profile-header {
    display: flex;
    align-items: center;
}

.profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
}

.profile-info {
    flex-grow: 1;
}

header {
    text-align: left;
}

h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

p {
    font-size: 16px;
    margin-bottom: 20px;
}

.stats {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
}

.stats span {
    margin-right: 20px;
    font-size: 14px;
}
</style>
