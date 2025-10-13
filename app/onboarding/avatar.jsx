import { View, Text, Pressable, Image,ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ArrowLeft, ArrowRight, Camera, User, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../constants/theme';

export default function Avatar() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [avatarUri, setAvatarUri] = useState(profileData.avatarUri || null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Wir benötigen Zugriff auf deine Kamera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    updateProfileData({ avatarUri });
    router.push('/onboarding/music');
  };

  const handleSkip = () => {
    updateProfileData({ avatarUri: null });
    router.push('/onboarding/music');
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1">
      <View className="flex-1 justify-between px-6 py-10">
        {/* Header */}
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


          {/* Titel */}
          <View className="flex-row items-center mb-3">
            <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-4xl font-bold">
              Profilbild
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-8">
            Zeig dein Gesicht! Ein Profilbild macht dich für andere erkennbar.
          </Text>

          {/* Progress Indicator */}
          <View className="flex-row mb-12">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>

          {/* Avatar Preview */}
          <View className="items-center mb-8">
            <View className="relative">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={{ borderColor: theme.colors.accent.main, borderWidth: 4 }}
                  className="w-40 h-40 rounded-full"
                />
              ) : (
                <View
                  style={{
                    backgroundColor: theme.colors.accent.bg,
                    borderColor: theme.colors.accent.main,
                    borderWidth: 4
                  }}
                  className="w-40 h-40 rounded-full items-center justify-center"
                >
                  <User size={64} color={theme.colors.accent.main} />
                </View>
              )}
              <Pressable
                onPress={pickImage}
                style={{ backgroundColor: theme.colors.accent.main }}
                className="absolute bottom-0 right-0 p-3 rounded-full border-4 border-white"
              >
                <Upload size={20} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-4">
            <Pressable
              onPress={takePhoto}
              style={{
                backgroundColor: theme.colors.neutral.white,
                borderColor: theme.colors.accent.main,
                borderWidth: 2
              }}
              className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
            >
              <Camera size={24} color={theme.colors.accent.main} />
              <Text style={{ color: theme.colors.accent.main }} className="text-lg font-bold ml-3">
                Foto aufnehmen
              </Text>
            </Pressable>

            <Pressable
              onPress={pickImage}
              style={{
                backgroundColor: theme.colors.neutral.white,
                borderColor: theme.colors.accent.main,
                borderWidth: 2
              }}
              className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
            >
              <Upload size={24} color={theme.colors.accent.main} />
              <Text style={{ color: theme.colors.accent.main }} className="text-lg font-bold ml-3">
                Aus Galerie wählen
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Buttons */}
        <View className="space-y-3 mb-8">
          {avatarUri && (
            <Pressable
              onPress={handleNext}
              style={{ backgroundColor: theme.colors.primary.main }}
              className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
            >
              <Text className="text-lg font-bold text-white mr-2">
                Weiter
              </Text>
              <ArrowRight size={24} color="#fff" />
            </Pressable>
          )}
          
          <Pressable
            onPress={handleSkip}
            className="flex-row items-center justify-center px-6 py-4"
          >
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-base">
              Später hinzufügen
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}