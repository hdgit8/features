export async function load ({ locals: { supabase }}) {
    const{data: courses} = await supabase.from("courses").select()
    if (courses) {
        for (let i = 0; i < courses.length; i++) {
            if (courses[i].banner_path)
            {
                const result = supabase.storage.from("courses").getPublicUrl(courses[i].banner_path)
                courses[i]["public_url"] = result.data.publicUrl
            }
        }
    }

    return {
        courses
    }
}