// app/_layout.jsx
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Slot, useRouter, usePathname, Stack } from 'expo-router';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { supabase } from '../lib/supabase';
import { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native'
import { IntroProvider, useIntro } from '../components/IntroContext';
import { OnboardingProvider } from '../components/OnboardingContext';

function RootLayoutContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { introCompleted } = useIntro();

  // verhindert Doppelnavigation & parallele handleAuthenticated-Läufe
  const navigatingRef = useRef<string | null>(null);
  const handlingAuthRef = useRef(false);
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    // Warte bis Intro abgeschlossen ist
    if (!introCompleted) return;

    let unsub = () => {};

    (async () => {
      // 1) BOOTSTRAP: aktuelle Session prüfen und DIREKT routen
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Aktuelle Session:" + session?.user?.email);
        await handleAuthenticated(session);
      } else {
        safeReplace('/login');
      }
      bootstrappedRef.current = true;

      // 2) EVENTS: zukünftige Änderungen behandeln (ohne Doppelaufrufe)
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(event);
        if (!bootstrappedRef.current) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) await handleAuthenticated(session);
        } else if (event === 'SIGNED_OUT') {
          safeReplace('/login');
        }
      });
      unsub = () => data?.subscription?.unsubscribe?.();
    })();

    return () => unsub();
  }, [introCompleted]);

  function safeReplace(target: string) {
    if (navigatingRef.current === target || pathname === target) return;
    navigatingRef.current = target;
    router.replace(target);
    setTimeout(() => (navigatingRef.current = null), 80);
  }

  async function handleAuthenticated(session: any) {
    if (handlingAuthRef.current) return; // Guard gegen parallele Aufrufe
    handlingAuthRef.current = true;
    try {
      const uid = session.user.id;
      // robuste Query (Fehler sichtbar machen)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        // Fallback: Onboarding starten (z. B. wenn Profil noch fehlt)
        safeReplace('/onboarding');
        return;
      }

      if (!profile || !profile.onboarding_completed) {
        safeReplace('/onboarding');
      } else {
        safeReplace('/tabs');
      }
    } finally {
      handlingAuthRef.current = false;
    }
  }

  return (
    <GluestackUIProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          // 🔹 Übergang auswählen:
          animation: 'slide_from_right',
          // Alternativen:
          // 'default' | 'simple_push' | 'fade' | 'fade_from_bottom' | 'slide_from_bottom'
        }}
      >
       
        <Stack.Screen name="login" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="home" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <IntroProvider>
      <OnboardingProvider>
        <RootLayoutContent />
      </OnboardingProvider>
    </IntroProvider>
  );
}



