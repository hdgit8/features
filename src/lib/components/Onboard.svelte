<script lang="ts">
	import messageStore from '$lib/stores/message.store';
    import type {Session, SupabaseClient} from '@supabase/supabase-js'

    export let supabase: SupabaseClient | null;
    export let session: Session | null;

    let email: string;
    let password: string;
    let confirmPassword: string;
    let stage: string = "email"; // email, password, confirm_password, success
    let authType: string = "login"; // can be login or signup

    async function signUpNewUser() {
        const {data, error} = await supabase?.auth.signUp({
            email,
            password,
        })

        if (error) {
        }
    }

    async function loginButton() {
        // entered email
        if (stage === "email" && email) {
            stage = "password"
            return;
        }

        // entered password
        if (stage === "password" && password) {
            stage = "confirm_password"
            return;
        }

        if (email && password) {
            const resp = await supabase?.auth.signInWithPassword({
                password: password,
                email: email,
            })

            if (!resp) {
                messageStore.showError("No response from server. Check your internet connection.")
                return;
            }
            
            if (resp.error) {
                messageStore.showError(
                    'Failed to login'
                );
                console.log("login error:", resp.error)
                password = "";
                confirmPassword = "";
                stage = "password";
                return;
            }
        }
    }

    async function signupButton() {
        // entered email
        if (stage === "email" && email) {
            stage = "password"
            return;
        }

        // entered password
        if (stage === "password" && password) {
            stage = "confirm_password"
            return;
        }

        // entered confirmPassword
        if (stage === "confirm_password" && confirmPassword) {
            if (password !== confirmPassword) {
                messageStore.showError(
                    'Passwords must match. Try again.'
                );
                password = "";
                confirmPassword = "";
                stage = "password";
                return;
            }
        }

        if (email && password) {
            messageStore.showSuccess(
                'Successfully created account! Check your email to continue signup.'
            );
            stage = "success";
            const resp = await supabase?.auth.signUp({
                password: password,
                email: email,
            })

            if (!resp) {
                messageStore.showError("No response from server. Check your internet connection.")
                return;
            }
            
            if (resp.error) {
                messageStore.showError(
                    'Failed to login'
                );
                console.log("login error:", resp.error)
                password = "";
                confirmPassword = "";
                stage = "password";
                return;
            }
        }
    }
</script>

{#if !session}
<div
class="fixed top-0 left-0 right-0 bottom-0 z-40 backdrop-blur-sm bg-black bg-opacity-60">
</div>

<div class="fixed top-0 left-0 right-0 bottom-0 z-50 text-white overflow-y-scroll">
    <div class="mt-[20vh] w-screen h-40">
        
        <!-- typing animation -->
        <div class="flex items-center flex-col w-full justify-center">
            <button 
            on:click={() => {
                session = {
                    access_token: "", 
                    refresh_token: "", 
                    expires_in: 0, 
                    token_type:"", 
                    user: {
                        id:"", 
                        app_metadata:{}, 
                        user_metadata:{},
                        aud:"",
                        created_at:"",
                    },
                };
            }}
            
            class="text-sm font-mono hover:underline p-16 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            <div class="text-xl font-mono typewriter-welcome-1"></div>
        </div>

        <!-- signup or login or skip -->
    </div>
    <div class="text-gray-200 mt-24">
        <div class="flex gap-2 justify-center mb-2">
            {#if stage === "email"}
            <input type="email" bind:value={email} required placeholder="your@email.com" class="placeholder:text-gray-400 p-2 px-3 text-base rounded bg-[--dark-700] w-60">
            {/if}
            {#if stage === "password"}
            <input type="password" bind:value={password} required placeholder="password" class="placeholder:text-gray-400 p-2 px-3 text-base rounded bg-[--dark-700] w-60">
            {/if}
            {#if stage === "confirm_password"}
            <input type="password" bind:value={confirmPassword} required placeholder="confirm password" class="placeholder:text-gray-400 p-2 px-3 text-base rounded bg-[--dark-700] w-60">
            {/if}
        </div>
        <div class="flex gap-2 justify-center items-center flex-col text-center">
            <button
            on:click={signupButton}
            class:hover:text-gray-500={true}
            class="p-2 flex w-60 mx-auto justify-center hover:bg-[--dark-700] hover:text-gray-300 text-gray-400 px-3 rounded gap-2 bg-[--dark-800]">
                <span>Create Account</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </button>
            <span class="text-gray-400">- or -</span>
            <button
            on:click={loginButton}
            class="p-2 flex w-60 mx-auto justify-center hover:bg-[--dark-700] hover:text-gray-300 text-gray-400 px-3 rounded gap-2 bg-[--dark-800]">
                <span>Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </button>
        </div>
    </div>
</div>
{/if}

<style lang="scss" scoped>
    @import 'typed';

    .typewriter-welcome-1 {
        @include typed("Welcome to Sparker", null, (caret:false, iterations: 0));
    }

    #onboard-image {
        --from-color-gradient: rgba(0, 0, 0, 0.2);
        --to-color-gradient: rgba(0, 0, 0, 0.5);

        mask-image: -webkit-gradient(linear, left top, left bottom, 
    from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 1)));
        -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, 
    from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 1)));
    }

    .fade-in {
        opacity: 1;
        animation: fade-in-anim 7s;
    }

    @keyframes fade-in-anim {
        from {
            opacity: 0;
        }
        70% {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>