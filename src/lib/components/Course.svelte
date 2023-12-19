<script>
    export let text = "";
    export let image = ""; //"https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x28HCmU-vNbUj5RJkrWAMw.jpeg";
</script>

<div>
    {#if !image && text}
        <div class="aspect-video bg-gradient-to-r from-black dark:to-[--dark-900] to-white bg-cover bg-center bg-white dark:text-white text-gray-900 dark:bg-[--dark-800] rounded-lg transition-all"></div>
        {#if text}
            <h3 class="p-1">{text}</h3>
        {:else}
            <h3 class="p-2 rounded mt-3 dark:bg-[--dark-800] bg-white"></h3>
        {/if}
    {:else}
        <div
        style="background-image:url({image})" 
        class="aspect-video bg-cover bg-center bg-white dark:text-white text-gray-900 dark:bg-[--dark-800] rounded-lg transition-all"></div>
        {#if text}
            <h3 class="p-1">{text}</h3>
        {:else}
            <h3 class="p-2 rounded mt-3 dark:bg-[--dark-800] bg-white"></h3>
        {/if}
    {/if}
</div>