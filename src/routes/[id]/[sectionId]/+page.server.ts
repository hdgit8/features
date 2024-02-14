import marked from "$lib/markdown/markdown"

export async function load ({ params, locals: { supabase }}) {
    const{data} = await supabase.from("sections").select("*, section_embeds(*)").eq("id", params.sectionId)

    const markdown = await marked.parse(data[0].markdown)

    return {
        section: data[0],
        markdown
    }
}