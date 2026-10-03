import { createClient } from '@supabase/supabase-js'

// Plain public client — for server-side reads of public data (no auth required)
// Uses the anon key which respects RLS policies
export function createPublicClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
