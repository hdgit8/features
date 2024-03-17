import type { Session } from "@supabase/supabase-js";

export async function load ({ depends, locals: { supabase, getSession }}) {
    depends("auth:courses");

    const session = await getSession() as Session;

    let {data:recommendedCourses} = await supabase.from("courses").select()
    if (recommendedCourses) {
        for (let i = 0; i < recommendedCourses.length; i++) {
            if (recommendedCourses[i].banner_path)
            {
                const result = supabase.storage.from("courses").getPublicUrl(recommendedCourses[i].banner_path)
                recommendedCourses[i]["public_url"] = result.data.publicUrl
            }
        }
    }

    if (!recommendedCourses) {
        recommendedCourses = [];
    }

    if (!session?.user) {
        return {
            recommendedCourses,
        }
    }

    const{data: createdCourses} = await supabase.from("courses").select().eq("user_id", session.user.id)
    if (createdCourses) {
        for (let i = 0; i < createdCourses.length; i++) {
            if (createdCourses[i].banner_path)
            {
                const result = supabase.storage.from("courses").getPublicUrl(createdCourses[i].banner_path)
                createdCourses[i]["public_url"] = result.data.publicUrl
            }
        }
    }

    return {
        createdCourses,
        recommendedCourses,
    }
}