import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'; // GPT-Imports
import 'react-native-get-random-values'; // GPT-Imports

const supabaseUrl = "https://ydpqettivamnkflqoyfp.supabase.co";
const supabasePublishableKey = 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcHFldHRpdmFtbmtmbHFveWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODQzMjksImV4cCI6MjA3NDU2MDMyOX0.aMq0ZRixEGbYsPUy46zYPhxaAZcJXcrYZ8E-8cW7WmQ";
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

