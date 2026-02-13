import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
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

export default function Age() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [age, setAge] = useState(profileData.age || '');
  const [error, setError] = useState('');

  const validateAge = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setAge(numericText);
    setError('');
    
    if (numericText) {
      const numAge = parseInt(numericText);
      if (numAge < 16) {
        setError('Mindestalter: 16 Jahre');
      } else if (numAge > 99) {
        setError('Bitte gültiges Alter eingeben');
      }
    }
  };

  const handleNext = () => {
    const numAge = parseInt(age);
    if (numAge >= 16 && numAge <= 99) {
      updateProfileData({ age });
      router.push('/onboarding/privacy');
    }
  };

  const isValid = age && parseInt(age) >= 16 && parseInt(age) <= 99;

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
        <ProgressBar currentStep={2} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Wie alt bist du?
        </Text>
        
        <Text className="text-lg mb-8" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Dein Alter hilft uns, dir passende Events zu zeigen.
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text className="text-sm font-semibold mb-2" style={{ color: theme.colors.neutral.gray[700], fontFamily: 'Manrope_600SemiBold' }}>
            ALTER
          </Text>
          <TextInput
            value={age}
            onChangeText={validateAge}
            placeholder="z.B. 25"
            placeholderTextColor={theme.colors.neutral.gray[400]}
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="next"
            onSubmitEditing={handleNext}
            style={styles.input}
          />
          
          {/* Helper/Error Text */}
          <Text className="text-xs mt-2" style={{ color: error ? theme.colors.error : theme.colors.neutral.gray[500] }}>
            {error || 'Mindestalter: 16 Jahre'}
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox} className="mt-6">
          <Text className="text-sm" style={{ color: theme.colors.neutral.gray[700] }}>
            🔒 Dein Alter ist nicht öffentlich sichtbar und wird nur für altersgerechte Event-Vorschläge verwendet.
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <View className="px-6 pb-10">
        <Pressable
          onPress={handleNext}
          disabled={!isValid}
          style={[
            styles.continueButton,
            { backgroundColor: isValid ? theme.colors.primary.main : theme.colors.neutral.gray[300] }
          ]}
        >
          <Text
            className="text-lg font-bold text-center"
            style={{ color: isValid ? '#fff' : theme.colors.neutral.gray[500] }}
          >
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
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    fontSize: 18,
    color: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontFamily: 'Manrope_400Regular',
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
