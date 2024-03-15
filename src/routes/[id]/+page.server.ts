import marked from '$lib/markdown/markdown.js'
import { error } from '@sveltejs/kit'

export async function load ({ params, locals: { supabase }}) {
    const{data} = await supabase.from("courses").select("*, course_marketing(*)").eq("id", params.id)
    if (data) {
        if (data[0].banner_path) {
            const result = supabase.storage.from("courses").getPublicUrl(data[0].banner_path)
            data[0]["public_url"] = result.data.publicUrl
        }
        if (data[0]?.course_marketing?.markdown) {
            const markdownHTML = await marked.parse(data[0].course_marketing.markdown);
            data[0].course_marketing["markdownHtml"] = markdownHTML;
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