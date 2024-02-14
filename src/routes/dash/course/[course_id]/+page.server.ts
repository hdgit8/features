import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export async function load({params, locals: { supabase, getSession }}) {
    const supabaseT = supabase as SupabaseClient;
    const session = await getSession() as Session;

    if (!session) {
        throw error(400, {message:"Session does not exist"})
    }

    const {data, error:err} = await supabaseT.from("courses").select().eq("id", params.course_id);
    if (!data || err) {
        throw error(500, {message:"Error getting course from db"})
    }

    return {
        course: {...data[0]},
    }
}