<script lang="ts">
	import messageStore from "$lib/stores/message.store";
	import { onMount } from "svelte";
    import Button from "./Button.svelte";
	import type { Session, SupabaseClient } from "@supabase/supabase-js";

    export let supabase: SupabaseClient;
    export let session: Session | null;

    let isLogin = true;
    let email:string = "";
    let password: string = "";
    let confirmPassword:string = "";
    let name:string = "";

    let showOptions = false;

    onMount(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                showOptions = false;
            }
        })

        return () => subscription.unsubscribe()
    });

    async function doAuth() {
        if (isLogin) { 
            if (!email) {
                messageStore.showError("Must input an email.")
                return;
            }
            
            if (!password) {
                messageStore.showError("Must input a password.")
                return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.log(error)
                messageStore.showError("There was an error. '" + error.message + "'");
                return;
            }

            messageStore.showSuccess("Logged in.")

        } else {
            if (!name) {
                messageStore.showError("Must input a name.")
                return;
            }

            if (!email) {
                messageStore.showError("Must input an email.")
                return;
            }
            
            if (!password) {
                messageStore.showError("Must input a password.")
                return;
            }

            if (password !== confirmPassword) {
                messageStore.showError("Passwords must match")
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    }
                }
            })

            if (error) {
                console.log(error)
                messageStore.showError("There was an error. '" + error.message + "'");
                return;
            }

            messageStore.showSuccess("Check your email for a confirmation link.")
        }

        email = "";
        password = "";
        confirmPassword = "";
        name = "";
    }
</script>

{#if !session}
<div class="z-10 text-white absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm" style="background-color:rgba(0, 0, 0, 0.2);">
    <!-- FORM -->
    <div class="flex flex-col gap-3 mx-auto max-w-xs mt-10">
        <h3 class="text-2xl text-center">Welcome to Sparker!</h3>
        <div class="text-center">You need to login to view this page</div>
        <div class="flex w-full items-center gap-2">
            <Button active={isLogin} on:click={() => {isLogin = true}}>
                <span>Login</span>
            </Button>
            <Button active={!isLogin} on:click={() => {isLogin = false}}>
                <span>Sign Up</span>
            </Button>
        </div>
        {#if !isLogin}
        <input bind:value={name} type="text" required placeholder="Your Name" class="text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded-lg bg-[--dark-700]" />
        {/if}
        <input bind:value={email} type="email" required placeholder="your@email.com" class="text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded-lg bg-[--dark-700]">
        <input bind:value={password} type="password" required placeholder="password" class="text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded-lg bg-[--dark-700]" />
        {#if !isLogin && password}
        <input bind:value={confirmPassword} type="password" required placeholder="confirm password" class="text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded-lg bg-[--dark-700]" />
        {/if}
        <Button on:click={doAuth}>
            {#if isLogin}
            <span>Login</span>
            {:else}
            <span>Sign Up</span>
            {/if}
        </Button>
    </div>
</div>
{/if}