import type { Session } from "@supabase/supabase-js";

export async function load ({ depends, locals: { supabase, getSession }}) {
    depends("auth:courses");

    const session = await getSession() as Session;

    if (!session?.user) {
        return;
    }

    const{data} = await supabase.from("courses").select().eq("user_id", session.user.id)
    if (data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].banner_path)
            {
                const result = supabase.storage.from("courses").getPublicUrl(data[i].banner_path)
                data[i]["public_url"] = result.data.publicUrl
            }
        }
    }

    return {
        courses: data
    }
}