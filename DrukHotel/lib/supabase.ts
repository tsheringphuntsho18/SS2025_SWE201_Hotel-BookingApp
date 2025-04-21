import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gecupdjidcbywiqkyyzh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlY3VwZGppZGNieXdpcWt5eXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzUyMjcsImV4cCI6MjA1OTc1MTIyN30.aedkhXq57wh3tauAo8C7KcBCC9jyEuJ70omjJ4YDgvo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
