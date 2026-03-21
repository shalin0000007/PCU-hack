import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://izazxurlbjdfbrhrbtzt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6YXp4dXJsYmpkZmJyaHJidHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNzI5NTksImV4cCI6MjA4OTY0ODk1OX0.ASK1pqlDuZ6OSbPJzWU-SE7r3e9l8NooLG_OT6fwTEc";

export const supabase = createClient(supabaseUrl, supabaseKey);
