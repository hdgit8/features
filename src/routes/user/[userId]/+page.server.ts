import { error } from '@sveltejs/kit'

export async function load ({ params, locals: { supabase }}) {
    const{data} = await supabase.from("profiles").select().eq("user_id", params.userId)

    if (!data && !data?.length) {
        throw error(404, "Not Found")
    }

    return {
        user: data[0]
    }
}