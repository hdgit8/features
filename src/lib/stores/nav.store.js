import { get, writable } from "svelte/store";

const store = writable({ isOpen: false, title: "", back: "" });

export default {
    subscribe: store.subscribe,
    open: function() {
        const tmp = get(store);
        store.set({isOpen: true, title: tmp.title, back: tmp.back});
    },
    close: function() {
        const tmp = get(store);
        store.set({isOpen: false, title: tmp.title, back: tmp.back});
    },
    title: function(title = "No Title", back = "") {
        const tmp = get(store);
        store.set({isOpen: tmp.isOpen, title: title, back: back});
    },
}