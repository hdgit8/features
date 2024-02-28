<script>
    import {onMount} from "svelte"
    onMount(() => {
        resize();
    })

    function resize() {
        const textar = document.getElementById("chatbox");
        if (!textar) return;

        textar.style.height = 'auto';
        textar.style.height = textar.scrollHeight + 'px';
    }
</script>

<div class="w-full h-screen relative">
    <div class="absolute bottom-0 w-full p-2">
        <div class="flex w-full rounded-lg bg-[--dark-900]">
            <label class="p-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                </svg>
                <input class="hidden" type="file">
            </label>
            <textarea id="chatbox" on:input={resize} on:keyup={resize} class="w-full rounded-lg max-h-60 bg-[--dark-900] outline-none py-3 pr-3"></textarea>
        </div>
    </div>
</div>

<style>
    textarea {
        resize: none;
    }
</style>