<script lang="ts">
    export let active = false;
    export let align = "center";
    export let disabled = false;
    export let className = "";
</script>


<button
class:opacity-70={!active}
class:justify-center={align === "center"}
class:justify-start={align === "left"}
class:justify-end={align === "right"}
class:opacity-50={disabled}
disabled={disabled}
on:click
class="{className} text-center w-full bg-[--dark-700] disabled:text-white text-gray-300 grow hover:text-white p-2 rounded-lg flex gap-2">
    <slot></slot>
</button>