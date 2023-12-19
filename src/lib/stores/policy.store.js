import {get, writable} from 'svelte/store';
import { browser } from '$app/environment';

const localStore = browser && localStorage.getItem("policy") || null;
const localJSON = JSON.parse(localStore) || {accepted: false};
const store = writable(localJSON);

// update when changed
const unsubscribe = store.subscribe(value => {
    if (browser) localStorage.setItem("policy", JSON.stringify(value));
});

if (get(store).accepted) {
    unsubscribe();
}

export default {
    subscribe: store.subscribe,
    accept: function()
    {
        store.set({accepted: true})
        unsubscribe();
    }
}