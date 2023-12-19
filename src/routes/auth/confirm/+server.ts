import { redirect } from '@sveltejs/kit'

export const GET = async (event) => {
    const {
        url,
        locals: { supabase }
    } = event

    const token_hash = url.searchParams.get('token_hash') as string;
    const type = url.searchParams.get('type') as string;
    const next = url.searchParams.get('next') ?? '/';

    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })

        // if success (no error)
        if (!error) {
            // redirect to another page
            throw redirect(303, `/${next.slice(1)}`)
        }
    }

    // return the user to an error page with some instructions
    throw redirect(303, '/auth/auth-code-error');
}