import marked from '$lib/markdown/markdown.js'
import { error } from '@sveltejs/kit'

export async function load ({ params, locals: { supabase }}) {
    const{data:courses} = await supabase.from("courses").select("*").eq("id", params.id)
    if (courses) {
        if (courses[0].banner_path) {
            const result = supabase.storage.from("courses").getPublicUrl(courses[0].banner_path)
            courses[0]["public_url"] = result.data.publicUrl
        }
        if (courses[0]?.course_marketing?.markdown) {
            const markdownHTML = await marked.parse(courses[0].course_marketing.markdown);
            courses[0].course_marketing["markdownHtml"] = markdownHTML;
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

    return {
        course: {
            ...courses[0],
            "modules": modules
        }
    }
}