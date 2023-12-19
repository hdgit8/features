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

    async function logout() {
        await supabase.auth.signOut();
    }
</script>

{#if session}
<div class="flex flex-col">
    <Button align="left" on:click={() => {showOptions = !showOptions}}>
        <div>
            {session?.user.user_metadata.name}
        </div>
        <div class="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
            </svg>
        </div>
    </Button>

    {#if showOptions}
        <div>
            <Button on:click={logout}>
                logout
            </Button>
        </div>
    {/if}
</div>
{:else}
<div class="flex w-full items-center">
    <Button active={isLogin} on:click={() => {isLogin = true}}>
        <span>Login</span>
    </Button>
    <Button active={!isLogin} on:click={() => {isLogin = false}}>
        <span>Sign Up</span>
    </Button>
</div>
{#if !isLogin}
<input bind:value={name} type="text" required placeholder="Your Name" class="text-black dark:text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded bg-white dark:bg-[--dark-700]" />
{/if}
<input bind:value={email} type="email" required placeholder="your@email.com" class="text-black dark:text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded bg-white dark:bg-[--dark-700]">
<input bind:value={password} type="password" required placeholder="password" class="text-black dark:text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded bg-white dark:bg-[--dark-700]" />
{#if !isLogin && password}
<input bind:value={confirmPassword} type="password" required placeholder="confirm password" class="text-black dark:text-gray-200 placeholder:text-gray-400 p-2 px-3 text-base rounded bg-white dark:bg-[--dark-700]" />
{/if}
<Button on:click={doAuth}>
    {#if isLogin}
    <span>Login</span>
    {:else}
    <span>Sign Up</span>
    {/if}
</Button>
{/if}