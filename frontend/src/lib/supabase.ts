import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log only in development to help debug "No API key" errors
if (import.meta.env.DEV) {
    if (!supabaseUrl) console.error('Supabase URL is missing!')
    if (!supabaseKey) console.error('Supabase Anon Key is missing!')
}

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
