import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'; // GPT-Imports
import 'react-native-get-random-values'; // GPT-Imports

export const supabaseUrl = "https://ydpqettivamnkflqoyfp.supabase.co";
export const supabasePublishableKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcHFldHRpdmFtbmtmbHFveWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODQzMjksImV4cCI6MjA3NDU2MDMyOX0.aMq0ZRixEGbYsPUy46zYPhxaAZcJXcrYZ8E-8cW7WmQ";
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

/**
 * Profil-Abfrage mit access_token direkt – Workaround für OAuth.
 *
 * Problem: Nach setSession() sendet der Supabase-Client den JWT manchmal nicht mit der ersten
 * REST-Anfrage. RLS braucht auth.uid() → Abfrage liefert leer oder hängt.
 *
 * Lösung: fetch() mit Authorization: Bearer <access_token> – Token kommt direkt aus OAuth-Response.
 */
export async function fetchProfileWithToken(accessToken, uid) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${uid}&select=onboarding_completed`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: supabasePublishableKey,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await res.json();
  return data?.[0] ?? null;
}

