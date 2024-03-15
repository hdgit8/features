<script>
    export let id = "";
    export let text = "";
    export let image = ""; //"https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x28HCmU-vNbUj5RJkrWAMw.jpeg";
</script>

<a href="/{id}">
    {#if image}
        <div style="background-image:url({image})" 
        class="aspect-video bg-cover bg-center text-white bg-[--dark-800] rounded-lg transition-all">
            <div class="h-full w-full flex flex-col rounded-lg bg-gradient-to-b from-transparent to-[--dark-900]">
                <div class="mt-auto p-1">
                    {#if text}
                        <h3 class="p-1">{text}</h3>
                    {:else}
                        <div class="p-2 rounded mt-3 bg-[--dark-800" />
                    {/if}
                </div>
            </div>    
        </div>
    {:else}
        <div class="aspect-video flex flex-col bg-gradient-to-r from-[--dark-800] to-[--dark-900] bg-cover bg-center text-white bg-[--dark-800] rounded-lg transition-all"></div>
    {/if}
</a>