<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

    export let data;
    let { supabase, session, course } = data
    $: ({ supabase, session } = data) // listen to changes
</script>

<div class="w-full pt-10">
    <iframe class="w-full aspect-video max-h-video" src="https://www.youtube.com/embed/NxAZaXIn8mc?si=AOMX_5ub0nIwsiz3&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

    <!-- 
    <div class="bg-cover bg-center" style="background-image:url('{course?.public_url}')">
        <div class="p-2 pt-72 bg-gradient-to-b from-transparent to-black">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum, assumenda incidunt quae magnam, quos magni in tempora expedita temporibus sit quibusdam corrupti rem voluptas quia? Iusto itaque distinctio reprehenderit doloribus.
        </div>
    </div> -->
</div>