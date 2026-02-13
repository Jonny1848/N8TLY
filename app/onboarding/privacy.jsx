import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ChevronLeftIcon, GlobeAltIcon, LockClosedIcon } from 'react-native-heroicons/outline';
import { theme } from '../../constants/theme';

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

export default function Privacy() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [isPublic, setIsPublic] = useState(profileData.isPublic ?? true);

  const handleNext = () => {
    updateProfileData({ isPublic });
    router.push('/onboarding/city');
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
        <ProgressBar currentStep={3} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Privatsphäre
        </Text>
        
        <Text className="text-lg mb-8" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Entscheide, wer dein Profil sehen kann.
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Public Option */}
        <Pressable
          onPress={() => setIsPublic(true)}
          style={[
            styles.optionCard,
            {
              backgroundColor: isPublic ? '#f0f9ff' : '#fff',
              borderColor: isPublic ? theme.colors.primary.main : '#e5e7eb',
            }
          ]}
          className="mb-4"
        >
          <View className="flex-row items-start">
            <View 
              style={[
                styles.iconContainer,
                { backgroundColor: isPublic ? theme.colors.primary.main : '#f3f4f6' }
              ]}
            >
              <GlobeAltIcon size={24} color={isPublic ? '#fff' : '#6b7280'} />
            </View>
            
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold mb-1" style={{ color: theme.colors.neutral.gray[900] }}>
                Öffentliches Profil
              </Text>
              <Text className="text-sm leading-5" style={{ color: theme.colors.neutral.gray[600] }}>
                Jeder kann dein Profil sehen und dir folgen. Ideal, um neue Leute kennenzulernen.
              </Text>
            </View>

            {isPublic && (
              <View style={styles.checkmark}>
                <Text className="text-white font-bold">✓</Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Private Option */}
        <Pressable
          onPress={() => setIsPublic(false)}
          style={[
            styles.optionCard,
            {
              backgroundColor: !isPublic ? '#f0f9ff' : '#fff',
              borderColor: !isPublic ? theme.colors.primary.main : '#e5e7eb',
            }
          ]}
        >
          <View className="flex-row items-start">
            <View 
              style={[
                styles.iconContainer,
                { backgroundColor: !isPublic ? theme.colors.primary.main : '#f3f4f6' }
              ]}
            >
              <LockClosedIcon size={24} color={!isPublic ? '#fff' : '#6b7280'} />
            </View>
            
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold mb-1" style={{ color: theme.colors.neutral.gray[900] }}>
                Privates Profil
              </Text>
              <Text className="text-sm leading-5" style={{ color: theme.colors.neutral.gray[600] }}>
                Nur bestätigte Freunde können dein Profil sehen. Mehr Kontrolle über deine Privatsphäre.
              </Text>
            </View>

            {!isPublic && (
              <View style={styles.checkmark}>
                <Text className="text-white font-bold">✓</Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Info Box */}
        <View style={styles.infoBox} className="mt-8">
          <Text className="text-sm" style={{ color: theme.colors.neutral.gray[700] }}>
            💡 Du kannst diese Einstellung jederzeit in deinem Profil ändern.
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
