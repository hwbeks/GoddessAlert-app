import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bcsyjkbhimsvbzufczyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjc3lqa2JoaW1zdmJ6dWZjenl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjI1OTksImV4cCI6MjA5MTEzODU5OX0.m09NtiYISdO5OzGidt06tWM9WtAQzhzjGD4oX7696Y0";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  }
});
