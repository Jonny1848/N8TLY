import { View, Text, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import {
  Input, InputField,
  FormControl, FormControlLabel, FormControlLabelText,
  FormControlError, FormControlErrorIcon, FormControlErrorText,
  FormControlHelper, FormControlHelperText
} from '@gluestack-ui/themed';
import { OctagonAlert, ArrowLeft, ArrowRight, User } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function Username() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [username, setUsername] = useState(profileData.username || '');
  const [error, setError] = useState('');

  const validateUsername = (text) => {
    setUsername(text);
    setError('');
    
    if (text.length < 3) {
      setError('Benutzername muss mindestens 3 Zeichen haben');
    } else if (text.length > 20) {
      setError('Benutzername darf maximal 20 Zeichen haben');
    } else if (!/^[a-zA-Z0-9_]+$/.test(text)) {
      setError('Nur Buchstaben, Zahlen und _ sind erlaubt');
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
    <View style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1">
      <View className="flex-1 justify-between px-6 py-10">
        {/* Header mit Zurück-Button */}
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

          {/* Titel mit Icon */}
          <View className="flex-row items-center mb-3">
            <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-4xl font-bold">
              Dein Username
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-8">
            Wähle einen coolen Benutzernamen, unter dem dich andere auf N8TLY finden können.
          </Text>

          {/* Progress Indicator */}
          <View className="flex-row mb-8">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.neutral.gray[200] }} className="flex-1 h-2 rounded-full" />
          </View>

          {/* Input Field */}
          <FormControl isInvalid={!!error && username.length > 0} size="md">
            <FormControlLabel>
              <FormControlLabelText className="text-lg font-medium">
                Benutzername
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              className="my-2"
              size="xl"
              variant="outline"
              style={{ borderColor: theme.colors.neutral.gray[300], borderWidth: 2 }}
            >
              <InputField
                placeholder="Dein Username"
                value={username}
                onChangeText={validateUsername}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
            </Input>

            <FormControlHelper>
              <FormControlHelperText style={{ color: theme.colors.neutral.gray[500] }}>
                3-20 Zeichen, nur Buchstaben, Zahlen und _
              </FormControlHelperText>
            </FormControlHelper>

            {error && username.length > 0 && (
              <FormControlError>
                <FormControlErrorIcon as={OctagonAlert} style={{ color: theme.colors.error }} />
                <FormControlErrorText style={{ color: theme.colors.error }}>
                  {error}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Character counter */}
          <Text style={{ color: theme.colors.neutral.gray[400] }} className="text-sm text-right mt-2">
            {username.length}/20
          </Text>
        </View>

        {/* Weiter Button */}
        <Pressable
          onPress={handleNext}
          disabled={!isValid}
          style={{
            backgroundColor: isValid ? theme.colors.primary.main : theme.colors.neutral.gray[300]
          }}
          className="flex-row items-center justify-center px-6 py-4 rounded-2xl mb-8"
        >
          <Text
            style={{ color: isValid ? '#fff' : theme.colors.neutral.gray[500] }}
            className="text-lg font-bold mr-2"
          >
            Weiter
          </Text>
          <ArrowRight size={24} color={isValid ? '#fff' : '#9ca3af'} />
        </Pressable>
      </View>
    </View>
  );
}