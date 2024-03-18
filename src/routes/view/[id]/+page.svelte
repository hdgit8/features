<script lang="ts">
    import { page } from "$app/stores";
    import Studio from "$lib/components/Studio/Studio.svelte";
    import { json } from "@sveltejs/kit";
    import { onMount } from "svelte";
    import marked from "$lib/markdown/markdown.js";
    import messageStore from "$lib/stores/message.store";
    import { decompressByteArray } from "$lib/utils/compress.js";
    import { decode } from "@msgpack/msgpack";
    import Codecast from "$lib/components/Codecast/Codecast.svelte";
    import { draw } from "svelte/transition";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation"

    export let data;
    let { supabase, session, course } = data
    $: ({ supabase, session, course } = data) // listen to changes

    function loadFirstModule() {
        goto(`/view/${course.id}/${course?.modules[0].id}/${course?.modules[0].sections[0].id}`)
    }
</script>

<div class="bg-cover bg-center h-full w-full flex">
    <div class="m-auto">
        This course is empty :(
    </div>
</div>