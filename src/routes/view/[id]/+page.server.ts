import { error, redirect } from '@sveltejs/kit'

export async function load ({ params, locals: { supabase }}) {
    const{data:courses} = await supabase.from("courses").select().eq("id", params.id)
    if (courses) {
        if (courses[0].banner_path) {
            const result = supabase.storage.from("courses").getPublicUrl(courses[0].banner_path)
            courses[0]["public_url"] = result.data.publicUrl
        }
    }

    const{data:modules} = await supabase.from("modules")
            .select("id, num, name, sections (id, name, num)")
            .order("num")
            .order("num", { referencedTable: "sections"})
            .eq("course_id", courses[0].id)

    if (!courses && !courses?.length) {
        throw error(404, "Not Found")
    }

    const course = courses[0];
    if (modules && modules?.length) {
        const module = modules[0];
        if (module?.sections && module?.sections.length) {
            const section = module.sections[0];
            throw redirect(302, `/view/${course.id}/${module.id}/${section.id}`)
        }

        throw redirect(302, `/view/${course.id}/${module.id}`)
    }

    return  {
        course: {
            ...courses[0],
            "modules": modules
        }
    }
}