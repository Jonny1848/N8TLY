import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ArrowLeft, ArrowRight, PartyPopper, Check } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const PARTY_PREFERENCES = [
  { id: 'clubs', name: 'Clubs', emoji: '🪩' },
  { id: 'bars', name: 'Bars', emoji: '🍸' },
  { id: 'festivals', name: 'Festivals', emoji: '🎪' },
  { id: 'concerts', name: 'Konzerte', emoji: '🎤' },
  { id: 'raves', name: 'Raves', emoji: '🌈' },
  { id: 'beach_party', name: 'Beach Party', emoji: '🏖️' },
  { id: 'rooftop', name: 'Rooftop', emoji: '🏙️' },
  { id: 'underground', name: 'Underground', emoji: '🕳️' },
  { id: 'open_air', name: 'Open Air', emoji: '🌳' },
  { id: 'house_party', name: 'House Party', emoji: '🏠' },
  { id: 'boat_party', name: 'Boat Party', emoji: '⛵' },
  { id: 'warehouse', name: 'Warehouse', emoji: '🏭' },
];



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
    <View style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1">
      <View className="flex-1 px-6 py-10">
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


          <View className="flex-row items-center mb-3">
            <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-4xl font-bold">
              Deine Vibes
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-6">
            Was sind deine Party-Präferenzen?
          </Text>

          <View className="flex-row mb-6">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-xl font-bold mb-4">
              🎉 Wo feierst du am liebsten?
            </Text>
            {selectedParty.length > 0 && (
              <Text style={{ color: theme.colors.accent.main }} className="text-sm font-medium mb-3">
                ✓ {selectedParty.length} ausgewählt
              </Text>
            )}
            <View className="flex-row flex-wrap">
              {PARTY_PREFERENCES.map((pref) => {
                const isSelected = selectedParty.includes(pref.name);
                return (
                  <Pressable
                    key={pref.id}
                    onPress={() => toggleParty(pref)}
                    style={{
                      backgroundColor: isSelected ? theme.colors.accent.main : theme.colors.neutral.white,
                      borderColor: theme.colors.neutral.gray[300],
                      borderWidth: isSelected ? 0 : 2
                    }}
                    className="px-4 py-2 rounded-full m-1"
                  >
                    <View className="flex-row items-center">
                      <Text className="text-base mr-2">{pref.emoji}</Text>
                      <Text
                        style={{
                          color: isSelected ? '#fff' : theme.colors.neutral.gray[700]
                        }}
                        className="text-sm font-medium"
                      >
                        {pref.name}
                      </Text>
                      {isSelected && (
                        <Check size={14} color="#fff" className="ml-1" />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 bg-white">
          <Pressable
            onPress={handleNext}
            disabled={selectedParty.length === 0}
            style={{
              backgroundColor: selectedParty.length > 0 ? theme.colors.primary.main : theme.colors.neutral.gray[300]
            }}
            className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
          >
            <Text
              style={{
                color: selectedParty.length > 0 ? '#fff' : theme.colors.neutral.gray[500]
              }}
              className="text-lg font-bold mr-2"
            >
              Weiter
            </Text>
            <ArrowRight size={24} color={selectedParty.length > 0 ? '#fff' : '#9ca3af'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}