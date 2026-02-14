import { View, Text, Pressable, Image, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { supabase } from '../../lib/supabase';

export default function Onboarding() {
  const router = useRouter();

  const startOnboarding = () => {
    router.push("/onboarding/username");
  };

  // Benutzer abmelden und zurück zur Login-Seite navigieren
  // Dies ermöglicht Kontowechsel und verhindert automatisches Zurückleiten zum Onboarding
  const handleGoBack = async () => {
    try {
      // Benutzer abmelden, um die aktive Session zu beenden
      await supabase.auth.signOut();
      console.log('[ONBOARDING] User signed out, navigating to login');
      
      // Zur Login-Seite navigieren
      router.replace('/login');
    } catch (error) {
      console.error('[ONBOARDING] Error signing out:', error);
      // Trotz Fehler zur Login-Seite navigieren
      router.replace('/login');
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/pexels-apasaric-2078071.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark Overlay für bessere Lesbarkeit */}
      <View style={styles.overlay} />
      
      <View className="flex-1 px-6">
        {/* Zurück-Button (oben links) */}
        <Pressable
          onPress={handleGoBack}
          className="absolute top-12 left-6 p-2 rounded-full z-10"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <ChevronLeftIcon size={28} color="white" />
        </Pressable>

        {/* Content: Headline + Subtext + Visual */}
        <View className="flex-1 justify-center items-center px-4">
          {/* Headline */}
          <Text className="text-white text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Manrope_700Bold' }}>
            Willkommen bei N8LY
          </Text>

          {/* Subtext */}
          <Text className="text-white/90 text-lg text-center mb-12 px-4 leading-6" style={{ fontFamily: 'Manrope_400Regular' }}>
            Entdecke Events, vernetze dich und erlebe unvergessliche Nächte
          </Text>

          {/* Visual: Logo */}
          <View className="items-center justify-center mb-16">
            <Image 
              source={require("../../assets/N8LY9.png")} 
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Bottom: Continue Button */}
        <View className="pb-10">
          <Pressable
            onPress={startOnboarding}
            className="bg-white rounded-3xl py-5"
            style={styles.button}
          >
            <Text 
              className="text-center text-lg font-bold"
              style={{ color: theme.colors.primary.main, fontFamily: 'Manrope_700Bold' }}
            >
              Los geht's!
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Dunkles Overlay für Text-Lesbarkeit
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
