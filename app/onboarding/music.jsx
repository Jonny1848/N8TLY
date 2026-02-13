import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { theme } from '../../constants/theme';

const MUSIC_GENRES = [
  { id: 'techno', name: 'Techno', emoji: '🎧' },
  { id: 'house', name: 'House', emoji: '🏠' },
  { id: 'hiphop', name: 'Hip-Hop', emoji: '🎤' },
  { id: 'rnb', name: 'R&B', emoji: '🎵' },
  { id: 'pop', name: 'Pop', emoji: '🎶' },
  { id: 'rock', name: 'Rock', emoji: '🎸' },
  { id: 'indie', name: 'Indie', emoji: '🎹' },
  { id: 'edm', name: 'EDM', emoji: '💥' },
  { id: 'trap', name: 'Trap', emoji: '🔥' },
  { id: 'dnb', name: 'Drum & Bass', emoji: '⚡' },
  { id: 'trance', name: 'Trance', emoji: '🌌' },
  { id: 'reggaeton', name: 'Reggaeton', emoji: '🌴' },
  { id: 'afrobeats', name: 'Afrobeats', emoji: '🌍' },
  { id: 'schlager', name: 'Schlager', emoji: '🍺' },
  { id: 'latin', name: 'Latin', emoji: '💃' },
  { id: 'jazz', name: 'Jazz', emoji: '🎺' },
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

export default function MusicGenres() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [selectedGenres, setSelectedGenres] = useState(profileData.musicGenres || []);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre.name)
        ? prev.filter(name => name !== genre.name)
        : [...prev, genre.name]
    );
  };

  const handleNext = () => {
    if (selectedGenres.length > 0) {
      updateProfileData({ musicGenres: selectedGenres });
      router.push('/onboarding/preferences');
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
        <ProgressBar currentStep={7} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Deine Musik
        </Text>
        
        <Text className="text-lg mb-6" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Welche Musikrichtungen liebst du?
        </Text>

        {selectedGenres.length > 0 && (
          <View style={styles.selectedBadge}>
            <Text className="text-sm font-semibold" style={{ color: theme.colors.primary.main }}>
              ✓ {selectedGenres.length} {selectedGenres.length === 1 ? 'Genre' : 'Genres'} ausgewählt
            </Text>
          </View>
        )}
      </View>

      {/* Genres Grid */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap mb-32">
          {MUSIC_GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre.name);
            return (
              <Pressable
                key={genre.id}
                onPress={() => toggleGenre(genre)}
                style={[
                  styles.genreChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary.main : '#fff',
                    borderColor: isSelected ? theme.colors.primary.main : '#e5e7eb',
                  }
                ]}
              >
                <Text className="text-lg mr-2">{genre.emoji}</Text>
                <Text
                  className="font-medium"
                  style={{
                    color: isSelected ? '#fff' : theme.colors.neutral.gray[700],
                    fontSize: 15,
                    fontFamily: 'Manrope_500Medium',
                  }}
                >
                  {genre.name}
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
          disabled={selectedGenres.length === 0}
          style={[
            styles.continueButton,
            { backgroundColor: selectedGenres.length > 0 ? theme.colors.primary.main : theme.colors.neutral.gray[300] }
          ]}
        >
          <Text
            className="text-lg font-bold text-center"
            style={{ color: selectedGenres.length > 0 ? '#fff' : theme.colors.neutral.gray[500] }}
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
  genreChip: {
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
