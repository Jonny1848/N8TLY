import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { theme } from '../../constants/theme';

const PARTY_PREFERENCES = [
  { id: 'clubs', name: 'Clubs', emoji: '🪩' },
  { id: 'bars', name: 'Bars', emoji: '🍸' },
  { id: 'raves', name: 'Raves', emoji: '🌈' },
  { id: 'beach_party', name: 'Beach Party', emoji: '🏖️' },
  { id: 'rooftop', name: 'Rooftop', emoji: '🏙️' },
  { id: 'underground', name: 'Underground', emoji: '🕳️' },
  { id: 'open_air', name: 'Open Air', emoji: '🌳' },
  { id: 'house_party', name: 'House Party', emoji: '🏠' },
  { id: 'boat_party', name: 'Boat Party', emoji: '⛵' },
  { id: 'warehouse', name: 'Warehouse', emoji: '🏭' },
];

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

export default function Preferences() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [selectedParty, setSelectedParty] = useState(profileData.partyPreferences || []);

  const toggleParty = (party) => {
    setSelectedParty(prev =>
      prev.includes(party.name) ? prev.filter(name => name !== party.name) : [...prev, party.name]
    );
  };

  const handleNext = () => {
    if (selectedParty.length > 0) {
      updateProfileData({
        partyPreferences: selectedParty
      });
      router.push('/onboarding/bio');
    }
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
        <ProgressBar currentStep={8} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Deine Vibes
        </Text>
        
        <Text className="text-lg mb-6" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Wo feierst du am liebsten?
        </Text>

        {selectedParty.length > 0 && (
          <View style={styles.selectedBadge}>
            <Text className="text-sm font-semibold" style={{ color: theme.colors.primary.main }}>
              ✓ {selectedParty.length} ausgewählt
            </Text>
          </View>
        )}
      </View>

      {/* Party Preferences Grid */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap mb-32">
          {PARTY_PREFERENCES.map((pref) => {
            const isSelected = selectedParty.includes(pref.name);
            return (
              <Pressable
                key={pref.id}
                onPress={() => toggleParty(pref)}
                style={[
                  styles.prefChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary.main : '#fff',
                    borderColor: isSelected ? theme.colors.primary.main : '#e5e7eb',
                  }
                ]}
              >
                <Text className="text-lg mr-2">{pref.emoji}</Text>
                <Text
                  className="font-medium"
                  style={{
                    color: isSelected ? '#fff' : theme.colors.neutral.gray[700],
                    fontSize: 15,
                    fontFamily: 'Manrope_500Medium',
                  }}
                >
                  {pref.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleNext}
          disabled={selectedParty.length === 0}
          style={[
            styles.continueButton,
            { backgroundColor: selectedParty.length > 0 ? theme.colors.primary.main : theme.colors.neutral.gray[300] }
          ]}
        >
          <Text
            className="text-lg font-bold text-center"
            style={{ color: selectedParty.length > 0 ? '#fff' : theme.colors.neutral.gray[500] }}
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
  selectedBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  prefChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    margin: 4,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
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
