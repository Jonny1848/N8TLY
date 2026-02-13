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

export default function Username() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [username, setUsername] = useState(profileData.username || '');
  const [error, setError] = useState('');

  const validateUsername = (text) => {
    setUsername(text);
    setError('');
    
    if (text.length > 0) {
      if (text.length < 3) {
        setError('Mindestens 3 Zeichen');
      } else if (text.length > 20) {
        setError('Maximal 20 Zeichen');
      } else if (!/^[a-zA-Z0-9_]+$/.test(text)) {
        setError('Nur Buchstaben, Zahlen und _');
      }
    }
  };

  const handleNext = () => {
    if (username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username)) {
      updateProfileData({ username });
      router.push('/onboarding/age');
    }
  };

  const isValid = username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);

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
        <ProgressBar currentStep={1} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Dein Username
        </Text>
        
        <Text className="text-lg mb-8" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Wähle einen coolen Benutzernamen, unter dem dich andere finden können.
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text className="text-sm font-semibold mb-2" style={{ color: theme.colors.neutral.gray[700], fontFamily: 'Manrope_600SemiBold' }}>
            BENUTZERNAME
          </Text>
          <TextInput
            value={username}
            onChangeText={validateUsername}
            placeholder="z.B. party_king_2024"
            placeholderTextColor={theme.colors.neutral.gray[400]}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            returnKeyType="next"
            onSubmitEditing={handleNext}
            style={styles.input}
          />
          
          {/* Helper/Error Text */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xs" style={{ color: error ? theme.colors.error : theme.colors.neutral.gray[500], fontFamily: 'Manrope_400Regular' }}>
              {error || '3-20 Zeichen, nur a-z, 0-9, _'}
            </Text>
            <Text className="text-xs" style={{ color: theme.colors.neutral.gray[400], fontFamily: 'Manrope_400Regular' }}>
              {username.length}/20
            </Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox} className="mt-6">
          <Text className="text-sm" style={{ color: theme.colors.neutral.gray[700] }}>
            💡 Dein Username ist öffentlich sichtbar und kann später nicht geändert werden.
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
            style={{ color: isValid ? '#fff' : theme.colors.neutral.gray[500], fontFamily: 'Manrope_700Bold' }}
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
