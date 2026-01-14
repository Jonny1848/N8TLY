import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ArrowLeft, ArrowRight, Music, Check } from 'lucide-react-native';
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
    <View style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1">
      <View className="flex-1 px-6 py-10">
        {/* Header */}
        <View className="">
          <View className="flex-row items-center space-x-52">
            <Pressable onPress={() => router.back()} className="p-2">
              <ArrowLeft size={28} color={theme.colors.neutral.gray[900]} />
            </Pressable>

            <Image
              source={require("../../assets/N8LY9.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>

          {/* Titel */}
          <View className="flex-row items-center mb-3">
            <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-4xl font-bold">
              Deine Musik 
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-6">
            Welche Musikrichtungen liebst du? (Wähle mindestens eine)
          </Text>

          {/* Progress Indicator */}
          <View className="flex-row mb-6">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>

          {selectedGenres.length > 0 && (
            <Text style={{ color: theme.colors.accent.main }} className="text-sm font-medium mb-4">
              ✓ {selectedGenres.length} {selectedGenres.length === 1 ? 'Genre' : 'Genres'} ausgewählt
            </Text>
          )}
        </View>

        {/* Genres Grid */}
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap pb-24">
            {MUSIC_GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre.name);
              return (
                <Pressable
                  key={genre.id}
                  onPress={() => toggleGenre(genre)}
                  style={{
                    backgroundColor: isSelected ? theme.colors.accent.main : theme.colors.neutral.white,
                    borderColor: theme.colors.neutral.gray[300],
                    borderWidth: isSelected ? 0 : 2
                  }}
                  className="px-5 py-3 rounded-full m-1"
                >
                  <View className="flex-row items-center">
                    <Text className="text-lg mr-2">{genre.emoji}</Text>
                    <Text
                      style={{
                        color: isSelected ? '#fff' : theme.colors.neutral.gray[700]
                      }}
                      className="text-base font-medium"
                    >
                      {genre.name}
                    </Text>
                    {isSelected && (
                      <Check size={16} color="#fff" className="ml-2" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Weiter Button - Fixed at bottom */}
        <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 bg-white">
          <Pressable
            onPress={handleNext}
            disabled={selectedGenres.length === 0}
            style={{
              backgroundColor: selectedGenres.length > 0 ? theme.colors.primary.main : theme.colors.neutral.gray[300]
            }}
            className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
          >
            <Text
              style={{
                color: selectedGenres.length > 0 ? '#fff' : theme.colors.neutral.gray[500]
              }}
              className="text-lg font-bold mr-2"
            >
              Weiter
            </Text>
            <ArrowRight size={24} color={selectedGenres.length > 0 ? '#fff' : '#9ca3af'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}