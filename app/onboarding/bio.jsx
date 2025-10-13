import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function Bio() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [bio, setBio] = useState(profileData.bio || '');

  const handleNext = () => {
    updateProfileData({ bio });
    router.push('/onboarding/complete');
  };

  const handleSkip = () => {
    updateProfileData({ bio: '' });
    router.push('/onboarding/complete');
  };

  const maxLength = 200;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: theme.colors.neutral.white }}
      className="flex-1"
    >
      <View className="flex-1 justify-between px-6 py-10">
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
              Über dich
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-8">
            Erzähl anderen ein bisschen über dich! Was macht dich aus?
          </Text>

          <View className="flex-row mb-8">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>

          <View
            style={{
              backgroundColor: theme.colors.neutral.white,
              borderColor: theme.colors.accent.main,
              borderWidth: 2
            }}
            className="rounded-2xl p-4 mb-3"
          >
            <TextInput
              placeholder="z.B. Techno-Enthusiast aus Berlin. Liebe Warehouse Partys und Festival-Season. Immer auf der Suche nach neuen Locations! 🎧✨"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={6}
              maxLength={maxLength}
              textAlignVertical="top"
              style={{ color: theme.colors.neutral.gray[900] }}
              className="text-base min-h-32"
              placeholderTextColor={theme.colors.neutral.gray[400]}
            />
          </View>

          <View className="flex-row justify-between items-center mb-6">
            <Text style={{ color: theme.colors.neutral.gray[500] }} className="text-sm">
              {bio.length}/{maxLength} Zeichen
            </Text>
            <Text
              style={{
                color: bio.length > 0 ? theme.colors.accent.main : theme.colors.neutral.gray[400]
              }}
              className="text-sm font-medium"
            >
              {bio.length > 0 ? '✓ Optional' : 'Optional'}
            </Text>
          </View>

          <View style={{ backgroundColor: theme.colors.accent.bg }} className="rounded-xl p-4">
            <Text style={{ color: theme.colors.neutral.gray[700] }} className="text-sm mb-2 font-medium">
              💡 Tipps für eine gute Bio:
            </Text>
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-sm mb-1">• Sei authentisch und positiv</Text>
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-sm mb-1">• Lasse N8TLY-User wissen, wer du bist!</Text>
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-sm">• Verwende Emojis für mehr Persönlichkeit</Text>
          </View>
        </View>

        <View className="space-y-3 mb-8">
          <Pressable
            onPress={handleNext}
            style={{ backgroundColor: theme.colors.primary.main }}
            className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
          >
            <Text className="text-lg font-bold text-white mr-2">
              {bio.length > 0 ? 'Weiter' : 'Ohne Bio fortfahren'}
            </Text>
            <ArrowRight size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}