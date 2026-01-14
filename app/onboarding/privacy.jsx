import { View, Text, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ArrowLeft, ArrowRight, Lock, Globe, Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function Privacy() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [isPublic, setIsPublic] = useState(profileData.isPublic ?? true);

  const handleNext = () => {
    updateProfileData({ isPublic });
    router.push('/onboarding/city');
  };

  return (
    <View style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1">
      <View className="flex-1 justify-between px-6 py-10">
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
              Privatsphäre
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-8">
            Entscheide, wer dein Profil sehen kann.
          </Text>

          {/* Progress Indicator */}
          <View className="flex-row mb-12">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>

          {/* Options */}
          <View className="space-y-4">
            {/* Öffentliches Profil */}
            <Pressable
              onPress={() => setIsPublic(true)}
              style={{
                backgroundColor: isPublic ? theme.colors.accent.bg : theme.colors.neutral.white,
                borderColor: isPublic ? theme.colors.accent.main : theme.colors.neutral.gray[200],
                borderWidth: 2
              }}
              className="p-6 rounded-2xl"
            >
              <View className="flex-row items-start">
                <View
                  style={{
                    backgroundColor: isPublic ? theme.colors.accent.main : theme.colors.neutral.gray[200]
                  }}
                  className="p-3 rounded-full mr-4"
                >
                  <Globe size={24} color={isPublic ? '#fff' : theme.colors.neutral.gray[600]} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-xl font-bold mb-2">
                    Öffentlich
                  </Text>
                  <Text style={{ color: theme.colors.neutral.gray[600] }}>
                    Jeder auf N8TLY kann dein Profil sehen und dir Freundschaftsanfragen senden.
                  </Text>
                  {isPublic && (
                    <View style={{ backgroundColor: theme.colors.accent.bg }} className="mt-3 rounded-lg px-3 py-2">
                      <Text style={{ color: theme.colors.neutral.gray[700] }} className="font-medium">
                        ✓ Empfohlen für beste Erfahrung
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>

            {/* Privates Profil */}
            <Pressable
              onPress={() => setIsPublic(false)}
              style={{
                backgroundColor: !isPublic ? theme.colors.accent.bg : theme.colors.neutral.white,
                borderColor: !isPublic ? theme.colors.accent.main : theme.colors.neutral.gray[200],
                borderWidth: 2
              }}
              className="p-6 rounded-2xl"
            >
              <View className="flex-row items-start">
                <View
                  style={{
                    backgroundColor: !isPublic ? theme.colors.accent.main : theme.colors.neutral.gray[200]
                  }}
                  className="p-3 rounded-full mr-4"
                >
                  <EyeOff size={24} color={!isPublic ? '#fff' : theme.colors.neutral.gray[600]} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-xl font-bold mb-2">
                    Privat
                  </Text>
                  <Text style={{ color: theme.colors.neutral.gray[600] }}>
                    Nur deine Freunde können dein Profil sehen. Andere müssen dich über deinen Benutzernamen finden.
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Info Box */}
          <View style={{ backgroundColor: theme.colors.neutral.gray[50] }} className="rounded-xl p-4 mt-6">
            <Text style={{ color: theme.colors.neutral.gray[700] }} className="text-sm">
              💡 Du kannst diese Einstellung jederzeit in deinen Profil-Einstellungen ändern.
            </Text>
          </View>
        </View>

        {/* Weiter Button */}
        <Pressable
          onPress={handleNext}
          style={{ backgroundColor: theme.colors.primary.main }}
          className="flex-row items-center justify-center px-6 py-4 rounded-2xl mb-8"
        >
          <Text className="text-lg font-bold text-white mr-2">
            Weiter
          </Text>
          <ArrowRight size={24} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}