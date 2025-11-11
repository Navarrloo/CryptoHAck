import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// You should store these in environment variables and access them via process.env
// For example, in a Cloudflare Worker/Pages environment, you would set these in the dashboard.
const supabaseUrl = 'https://hbmdpcplfcmabglplmoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibWRwY3BsZmNtYWJnbHBsbW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTgyODQsImV4cCI6MjA3ODQzNDI4NH0.tVnw-egdZIIZzMc_LG9GP4teni1Vh7Fb5plfILMPeWg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)