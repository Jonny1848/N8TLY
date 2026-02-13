import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
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

export default function Bio() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [bio, setBio] = useState(profileData.bio || '');

  const handleNext = () => {
    updateProfileData({ bio });
    router.push('/onboarding/complete');
  };

  const maxLength = 200;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
        <ProgressBar currentStep={9} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Über dich
        </Text>
        
        <Text className="text-lg mb-8" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Erzähl anderen ein bisschen über dich! Was macht dich aus?
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Bio Input Card */}
        <View style={styles.bioCard}>
          <TextInput
            placeholder="z.B. Techno-Enthusiast aus Berlin. Liebe Warehouse Partys und Festival-Season! 🎧✨"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={6}
            maxLength={maxLength}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.neutral.gray[400]}
            style={styles.bioInput}
          />
        </View>

        {/* Character Counter */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-sm" style={{ color: theme.colors.neutral.gray[500] }}>
            {bio.length}/{maxLength} Zeichen
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{
              color: bio.length > 0 ? theme.colors.primary.main : theme.colors.neutral.gray[400]
            }}
          >
            {bio.length > 0 ? '✓ Optional' : 'Optional'}
          </Text>
        </View>

        {/* Tips Box */}
        <View style={styles.tipsBox}>
          <Text className="text-sm font-semibold mb-2" style={{ color: theme.colors.neutral.gray[700] }}>
            💡 Tipps für eine gute Bio:
          </Text>
          <Text className="text-sm mb-1" style={{ color: theme.colors.neutral.gray[600] }}>
            • Sei authentisch und positiv
          </Text>
          <Text className="text-sm mb-1" style={{ color: theme.colors.neutral.gray[600] }}>
            • Lasse andere wissen, wer du bist!
          </Text>
          <Text className="text-sm" style={{ color: theme.colors.neutral.gray[600] }}>
            • Verwende Emojis für mehr Persönlichkeit
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
            {bio.length > 0 ? 'Weiter' : 'Ohne Bio fortfahren'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  bioCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bioInput: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
    fontFamily: 'Manrope_400Regular',
  },
  tipsBox: {
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
