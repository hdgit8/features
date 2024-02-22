import { error } from '@sveltejs/kit'

export async function load ({ params, locals: { supabase }}) {
    const{data} = await supabase.from("courses").select().eq("id", params.id)
    if (data) {
        if (data[0].banner_path)
        {
            const result = supabase.storage.from("courses").getPublicUrl(data[0].banner_path)
            data[0]["public_url"] = result.data.publicUrl
        }
    }

    if (!data) {
        error(404, "Not found");
        return
    }

    return {
        course: data[0]
    }
}