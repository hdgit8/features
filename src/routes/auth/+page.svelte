<script lang="ts">
	import messageStore from "$lib/stores/message.store";
	import { onMount } from "svelte";
    import Button from "$lib/components/Button.svelte";
	import { goto } from "$app/navigation";

    export let data
    let { supabase, session } = data
    $: ({ supabase, session } = data) // listen to changes

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
            goto("/home")

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
            goto("/home");
        }

        email = "";
        password = "";
        confirmPassword = "";
        name = "";
    }
</script>

<div class="flex p-3 px-4 absolute top-0 w-full">
    <a href="/" class="flex hover:opacity-80">
        <img alt="sparker" src="/sparker_white.png" class="h-9 p-1">
        <div class="text-white text-xl font-medium p-1">Sparker3D.com</div>
    </a>
</div>

<div class="flex w-full h-[100vh]">
    <div class="w-full lg:w-1/3 pt-10 flex flex-col text-white px-5">
        <!-- FORM -->
        <div class="flex flex-col gap-3 mx-auto w-full max-w-sm mt-10">
            <div class="mb-2 mt-5">
                {#if isLogin}
                <h3 class="text-2xl">Login to Sparker</h3>
                {:else}
                <h3 class="text-2xl">Create a Sparker account</h3>
                {/if}
            </div>
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
        <div class="mx-auto max-w-sm w-full text-sm text-gray-500 mt-auto p-5 pb-10">
            By continuing, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.
        </div>
    </div>
    <div class="h-[100vh] hidden lg:block lg:w-2/3 bg-cover bg-center" style="background-image:url('/relaxing.png');"></div>
</div>