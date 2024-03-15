<script lang="ts">
	import { browser } from "$app/environment";

    let scrollable:HTMLElement;

    function toggle() {
        if (browser) {
            scrollable?.scrollTo({
                left: 1000,
                behavior: "smooth",
            })
        }
    }
</script>

<div class="sm:w-80 w-[calc(100vw-4rem)] bg-red-500 h-screen md:overflow-hidden fixed top-0 left-0 bottom-0">

</div>

<div class="overflow-x-scroll fixed z-10 top-0 left-0 right-0 bottom-0 snap-x h-screen m-0 p-0">
    <div
    bind:this={scrollable}
    class="ml-[calc(100vw-4rem)] sm:ml-80 lg:w-[calc(100vw-20rem)] w-screen bg-green-500 snap-both h-screen">
        <div>
            <button class="bg-black p-3" on:click={toggle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
        <iframe class="aspect-video s-gtwbzcV7hFeP" src="https://www.youtube.com/embed/NxAZaXIn8mc?si=Jtz7-tzqf7Z8JU9M&amp;showinfo=0&amp;modestbranding=1&amp;autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" style="width: 100%;"></iframe>
    </div>
</div>