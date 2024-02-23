export async function load ({ locals: { supabase }}) {
    let {data} = await supabase.from("courses").select()
    if (data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].banner_path)
            {
                const result = supabase.storage.from("courses").getPublicUrl(data[i].banner_path)
                data[i]["public_url"] = result.data.publicUrl
            }
        }
    }

    if (!data) {
        data = [];
    }

    return {
        courses: data
    }
}