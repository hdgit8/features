import { writable } from "svelte/store";

const store = writable({ contents: [] });

export default {
    subscribe: store.subscribe,
}