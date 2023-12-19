<script lang="ts">
    export let active = false;
    export let align = "center";
    export let disabled = false;
    export let className = "";
</script>


<button
class:bg-gray-200={active}
class:dark:bg-[--dark-700]={active}
class:justify-center={align === "center"}
class:justify-start={align === "left"}
class:justify-end={align === "right"}
class:opacity-50={disabled}
disabled={disabled}
on:click
class="{className} text-center w-full disabled:text-gray-900 disabled:dark:text-white text-gray-600 dark:text-gray-300 hover:text-gray-900 grow dark:hover:text-white p-2 rounded-lg flex gap-2">
    <slot></slot>
</button>