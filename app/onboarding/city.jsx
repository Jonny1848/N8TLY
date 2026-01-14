import { View, Text, Pressable, ScrollView, TextInput, Image} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ArrowLeft, ArrowRight, MapPin, Search } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const GERMAN_CITIES = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart',
  'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden',
  'Hannover', 'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld',
  'Bonn', 'Münster', 'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden',
  'Gelsenkirchen', 'Mönchengladbach', 'Braunschweig', 'Kiel', 'Chemnitz',
  'Aachen', 'Halle', 'Magdeburg', 'Freiburg', 'Krefeld', 'Lübeck',
  'Mainz', 'Erfurt', 'Rostock', 'Kassel', 'Hagen', 'Potsdam', 'Saarbrücken',
  'Hamm', 'Ludwigshafen', 'Oldenburg', 'Leverkusen', 'Osnabrück',
  'Heidelberg', 'Darmstadt', 'Regensburg', 'Würzburg', 'Ingolstadt',
  'Ulm', 'Heilbronn', 'Pforzheim', 'Göttingen', 'Offenbach', 'Recklinghausen'
];

export default function City() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [selectedCity, setSelectedCity] = useState(profileData.favoriteCity || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = GERMAN_CITIES.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (selectedCity) {
      updateProfileData({ favoriteCity: selectedCity });
      router.push('/onboarding/location');
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
              Deine Stadt
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-6">
            In welcher Stadt feierst du am liebsten?
          </Text>

          {/* Progress Indicator */}
          <View className="flex-row mb-6">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>

          {/* Search Bar */}
          <View
            style={{
              backgroundColor: theme.colors.neutral.white,
              borderColor: theme.colors.accent.main,
              borderWidth: 2
            }}
            className="flex-row items-center rounded-xl px-4 py-3 mb-4"
          >
            <Search size={20} color={theme.colors.neutral.gray[400]} />
            <TextInput
              placeholder="Stadt suchen..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ color: theme.colors.neutral.gray[900] }}
              className="flex-1 ml-3 text-base"
              placeholderTextColor={theme.colors.neutral.gray[400]}
            />
          </View>
        </View>

        {/* Cities Grid */}
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap pb-24">
            {filteredCities.map((city) => (
              <Pressable
                key={city}
                onPress={() => setSelectedCity(city)}
                style={{
                  backgroundColor: selectedCity === city ? theme.colors.accent.main : theme.colors.neutral.white,
                  borderColor: theme.colors.neutral.gray[300],
                  borderWidth: selectedCity === city ? 0 : 2
                }}
                className="px-6 py-3 rounded-full m-1"
              >
                <Text
                  style={{
                    color: selectedCity === city ? '#fff' : theme.colors.neutral.gray[700]
                  }}
                  className="text-base font-medium"
                >
                  {city}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Weiter Button - Fixed at bottom */}
        <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 bg-white">
          <Pressable
            onPress={handleNext}
            disabled={!selectedCity}
            style={{
              backgroundColor: selectedCity ? theme.colors.primary.main : theme.colors.neutral.gray[300]
            }}
            className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
          >
            <Text
              style={{
                color: selectedCity ? '#fff' : theme.colors.neutral.gray[500]
              }}
              className="text-lg font-bold mr-2"
            >
              Weiter
            </Text>
            <ArrowRight size={24} color={selectedCity ? '#fff' : '#9ca3af'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}