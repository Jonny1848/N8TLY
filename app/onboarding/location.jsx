import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ArrowLeft, ArrowRight, MapPin, Shield } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import * as Location from "expo-location";

export default function Locations() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [locationEnabled, setLocationEnabled] = useState(profileData.locationEnabled ?? false);

  const handleNext = async () => {
    // Nur Permission abfragen, wenn aktiviert
    if (locationEnabled) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[ONBOARDING] Location permission status:', status);
    }

    // Speichere nur die Preference
    updateProfileData({ locationEnabled });
    router.push('/onboarding/avatar');
  };

  return (
    <View style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="">
          <View className="flex-row items-center space-x-52">
            <Pressable onPress={() => router.back()} className="p-2">
              <ArrowLeft size={28} color={theme.colors.neutral.gray[900]} />
            </Pressable>

            <Image
              source={require("../../assets/N8T4.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>


          {/* Titel */}
          <View className="flex-row items-center mb-3">
            <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-4xl font-bold">
              Standort
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-8">
            Möchtest du deinen Standort teilen, um Events in deiner Nähe zu finden?
          </Text>

          {/* Progress Indicator */}
          <View className="flex-row mb-12">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>

          {/* Options */}
          <View className="space-y-4">
            {/* Standort aktivieren */}
            <Pressable
              onPress={() => setLocationEnabled(true)}
              style={{
                backgroundColor: locationEnabled ? theme.colors.accent.bg : theme.colors.neutral.white,
                borderColor: locationEnabled ? theme.colors.accent.main : theme.colors.neutral.gray[200],
                borderWidth: 2
              }}
              className="p-6 rounded-2xl"
            >
              <View className="flex-row items-start">
                <View
                  style={{
                    backgroundColor: locationEnabled ? theme.colors.accent.main : theme.colors.neutral.gray[200]
                  }}
                  className="p-3 rounded-full mr-4"
                >
                  <MapPin size={24} color={locationEnabled ? '#fff' : theme.colors.neutral.gray[600]} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-xl font-bold mb-2">
                    Standort aktivieren
                  </Text>
                  <Text style={{ color: theme.colors.neutral.gray[600] }} className="mb-3">
                    Finde Events und Locations in deiner Nähe. Dein genauer Standort wird niemals angezeigt.
                  </Text>
                  {locationEnabled && (
                    <View className="flex-row items-center">
                      <Shield size={16} color={theme.colors.accent.main} />
                      <Text style={{ color: theme.colors.neutral.gray[700] }} className="font-medium ml-2">
                        Sicher & Privat
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>

            {/* Standort deaktivieren */}
            <Pressable
              onPress={() => setLocationEnabled(false)}
              style={{
                backgroundColor: !locationEnabled ? theme.colors.accent.bg : theme.colors.neutral.white,
                borderColor: !locationEnabled ? theme.colors.accent.main : theme.colors.neutral.gray[200],
                borderWidth: 2
              }}
              className="p-6 rounded-2xl"
            >
              <View className="flex-row items-start">
                <View
                  style={{
                    backgroundColor: !locationEnabled ? theme.colors.accent.main : theme.colors.neutral.gray[200]
                  }}
                  className="p-3 rounded-full mr-4"
                >
                  <Shield size={24} color={!locationEnabled ? '#fff' : theme.colors.neutral.gray[600]} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-xl font-bold mb-2">
                    Nicht jetzt
                  </Text>
                  <Text style={{ color: theme.colors.neutral.gray[600] }}>
                    Du kannst Events weiterhin manuell in deiner Stadt suchen.
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Info Boxes */}
          <View className="space-y-3 mt-6 mb-8">
            <View style={{ backgroundColor: theme.colors.accent.bg }} className="rounded-xl p-4">
              <Text style={{ color: theme.colors.neutral.gray[700] }} className="text-sm">
                🔒 Dein Standort wird nur verwendet, um dir relevante Events anzuzeigen
              </Text>
            </View>
            <View style={{ backgroundColor: theme.colors.accent.bg }} className="rounded-xl p-4">
              <Text style={{ color: theme.colors.neutral.gray[700] }} className="text-sm">
                ⚙️ Du kannst diese Einstellung jederzeit ändern
              </Text>
            </View>
          </View>

          {/* Weiter Button */}
          <Pressable
            onPress={handleNext}
            style={{ backgroundColor: theme.colors.primary.main }}
            className="flex-row items-center justify-center px-6 py-4 rounded-2xl mb-8"
          >
            <Text className="text-lg font-bold text-white mr-2">
              Weiter
            </Text>
            <ArrowRight size={24} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}