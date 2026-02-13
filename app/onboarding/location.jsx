import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ChevronLeftIcon, MapPinIcon, ShieldCheckIcon } from 'react-native-heroicons/outline';
import { theme } from '../../constants/theme';
import * as Location from "expo-location";

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <View className="flex-row gap-1 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className="flex-1 h-1 rounded-full"
          style={{
            backgroundColor: index < currentStep ? theme.colors.primary.main : '#e5e7eb'
          }}
        />
      ))}
    </View>
  );
};

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
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View className="px-6 pt-12 pb-6">
        <Pressable 
          onPress={() => router.back()} 
          className="mb-6"
          style={styles.backButton}
        >
          <ChevronLeftIcon size={28} color={theme.colors.neutral.gray[900]} />
        </Pressable>

        {/* Progress */}
        <ProgressBar currentStep={5} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Standort
        </Text>
        
        <Text className="text-lg mb-8" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Möchtest du deinen Standort teilen, um Events in deiner Nähe zu finden?
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Enable Option */}
        <Pressable
          onPress={() => setLocationEnabled(true)}
          style={[
            styles.optionCard,
            {
              backgroundColor: locationEnabled ? '#f0f9ff' : '#fff',
              borderColor: locationEnabled ? theme.colors.primary.main : '#e5e7eb',
            }
          ]}
          className="mb-4"
        >
          <View className="flex-row items-start">
            <View 
              style={[
                styles.iconContainer,
                { backgroundColor: locationEnabled ? theme.colors.primary.main : '#f3f4f6' }
              ]}
            >
              <MapPinIcon size={24} color={locationEnabled ? '#fff' : '#6b7280'} />
            </View>
            
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold mb-1" style={{ color: theme.colors.neutral.gray[900] }}>
                Standort aktivieren
              </Text>
              <Text className="text-sm leading-5" style={{ color: theme.colors.neutral.gray[600] }}>
                Finde Events in deiner Nähe und sieh, welche Freunde gerade unterwegs sind.
              </Text>
            </View>

            {locationEnabled && (
              <View style={styles.checkmark}>
                <Text className="text-white font-bold">✓</Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Disable Option */}
        <Pressable
          onPress={() => setLocationEnabled(false)}
          style={[
            styles.optionCard,
            {
              backgroundColor: !locationEnabled ? '#f0f9ff' : '#fff',
              borderColor: !locationEnabled ? theme.colors.primary.main : '#e5e7eb',
            }
          ]}
        >
          <View className="flex-row items-start">
            <View 
              style={[
                styles.iconContainer,
                { backgroundColor: !locationEnabled ? theme.colors.primary.main : '#f3f4f6' }
              ]}
            >
              <ShieldCheckIcon size={24} color={!locationEnabled ? '#fff' : '#6b7280'} />
            </View>
            
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold mb-1" style={{ color: theme.colors.neutral.gray[900] }}>
                Nicht jetzt
              </Text>
              <Text className="text-sm leading-5" style={{ color: theme.colors.neutral.gray[600] }}>
                Du kannst diese Funktion später in den Einstellungen aktivieren.
              </Text>
            </View>

            {!locationEnabled && (
              <View style={styles.checkmark}>
                <Text className="text-white font-bold">✓</Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Info Box */}
        <View style={styles.infoBox} className="mt-8">
          <Text className="text-sm" style={{ color: theme.colors.neutral.gray[700] }}>
            🔒 Dein genauer Standort wird nie öffentlich geteilt. Wir zeigen nur die Stadt und Events in deiner Umgebung.
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <View className="px-6 pb-10">
        <Pressable
          onPress={handleNext}
          style={[styles.continueButton, { backgroundColor: theme.colors.primary.main }]}
        >
          <Text className="text-lg font-bold text-center text-white">
            Weiter
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  optionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
