import { writable } from "svelte/store";
import { PUBLIC_ERROR_MESSAGE } from "$env/static/public";

const messageStore = writable({show: false, message: '', type: 'error'});

let interval = null;

export default {
    subscribe: messageStore.subscribe,
    showError: function(message = PUBLIC_ERROR_MESSAGE) {
        messageStore.set({show: true, message, type: 'error'});
        if (interval) clearInterval(interval);
    },
    showSuccess: function(message) {
        messageStore.set({show: true, message, type: 'success'});
        if (interval) clearInterval(interval);
    },
    showAlert: function(message) {
        messageStore.set({show: true, message, type: 'alert'});
        if (interval) clearInterval(interval);
    },
    showLoading: function(message, callback = () => false) {
        messageStore.set({show: true, message, type: 'loading'});

        interval = setInterval(() => {
            if (callback()) {
                this.hide();
                clearInterval(interval)
            }
        }, 800)
    },
    hide: function() {
        messageStore.set({show: false, message: '', type: 'success'});
        if (interval) clearInterval(interval);
    }
}