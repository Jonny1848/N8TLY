import { View, Text, Pressable, Image, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { ChevronLeftIcon, CameraIcon, PhotoIcon, UserCircleIcon } from 'react-native-heroicons/outline';
import * as ImagePicker from 'expo-image-picker';
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
      Alert.alert('Kamera-Zugriff', 'Wir benötigen Zugriff auf deine Kamera');
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
        <ProgressBar currentStep={6} totalSteps={10} />

        {/* Title */}
        <Text className="text-4xl font-bold mb-3" style={{ color: theme.colors.neutral.gray[900], fontFamily: 'Manrope_700Bold' }}>
          Profilbild
        </Text>
        
        <Text className="text-lg mb-8" style={{ color: theme.colors.neutral.gray[600], fontFamily: 'Manrope_400Regular' }}>
          Zeig dein Gesicht! Ein Profilbild macht dich für andere erkennbar.
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 items-center">
        {/* Avatar Preview */}
        <View className="items-center mb-8">
          {avatarUri ? (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <Pressable 
                onPress={pickImage}
                style={styles.editBadge}
              >
                <PhotoIcon size={20} color="#fff" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <UserCircleIcon size={100} color={theme.colors.neutral.gray[300]} />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="w-full mb-6">
          <Pressable
            onPress={takePhoto}
            style={styles.actionButton}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary.main }]}>
              <CameraIcon size={24} color="#fff" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold mb-1" style={{ color: theme.colors.neutral.gray[900] }}>
                Foto aufnehmen
              </Text>
              <Text className="text-sm" style={{ color: theme.colors.neutral.gray[600] }}>
                Nimm ein neues Foto mit der Kamera auf
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={pickImage}
            style={[styles.actionButton, { marginTop: 12 }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#8b5cf6' }]}>
              <PhotoIcon size={24} color="#fff" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold mb-1" style={{ color: theme.colors.neutral.gray[900] }}>
                Aus Galerie wählen
              </Text>
              <Text className="text-sm" style={{ color: theme.colors.neutral.gray[600] }}>
                Wähle ein Bild aus deiner Bibliothek
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text className="text-sm" style={{ color: theme.colors.neutral.gray[700] }}>
            💡 Du kannst dein Profilbild jederzeit in den Einstellungen ändern.
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <View className="px-6 pb-10">
        <Pressable
          onPress={handleNext}
          style={[styles.continueButton, { backgroundColor: theme.colors.primary.main }]}
        >
          <Text className="text-lg font-bold text-center text-white">
            {avatarUri ? 'Weiter' : 'Überspringen'}
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
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: '#e5e7eb',
  },
  placeholderContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#e5e7eb',
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#8b5cf6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
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
