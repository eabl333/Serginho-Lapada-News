const SUPABASE_URL = "https://uutdsmxvhvnibjaeljqm.supabase.co";
const SUPABASE_KEY = "sb_publishable_ET5BcSdKGYFztFrqiiYTww_ztz6YZIk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase conectado:", supabaseClient);