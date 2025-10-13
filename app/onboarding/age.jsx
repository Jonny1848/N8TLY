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
import { OctagonAlert, ArrowLeft, ArrowRight, Calendar } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function Age() {
  const router = useRouter();
  const { profileData, updateProfileData } = useOnboarding();
  const [age, setAge] = useState(profileData.age || '');
  const [error, setError] = useState('');

  const validateAge = (text) => {
    setAge(text);
    setError('');
    
    const numAge = parseInt(text);
    if (text && isNaN(numAge)) {
      setError('Bitte gib nur Zahlen ein');
    } else if (numAge < 16) {
      setError('Du musst mindestens 16 Jahre alt sein');
    } else if (numAge > 99) {
      setError('Bitte gib ein gültiges Alter ein');
    }
  };

  const handleNext = () => {
    const numAge = parseInt(age);
    if (numAge >= 16 && numAge <= 99) {
      updateProfileData({ age });
      router.push('/onboarding/privacy');
    }
  };

  const isValid = age && parseInt(age) >= 16 && parseInt(age) <= 99;

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
              source={require("../../assets/N8T4.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>

          {/* Titel */}
          <View className="flex-row items-center mb-3">
            <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-4xl font-bold">
              Wie alt bist du?
            </Text>
          </View>
          
          <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg mb-8">
            Dein Alter hilft uns, dir passende Events und Locations zu zeigen.
          </Text>

          {/* Progress Indicator */}
          <View className="flex-row mb-8">
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
            <View style={{ backgroundColor: theme.colors.primary.main }} className="flex-1 h-2 rounded-full mr-1" />
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
          <FormControl isInvalid={!!error && age.length > 0} size="md">
            <FormControlLabel>
              <FormControlLabelText>
                Alter
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              className="my-2"
              size="xl"
              variant="outline"
              style={{ borderColor: theme.colors.neutral.gray[300], borderWidth: 2 }}
            >
              <InputField
                placeholder="z.B. 25"
                value={age}
                onChangeText={validateAge}
                keyboardType="number-pad"
                maxLength={2}
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
            </Input>

            <FormControlHelper>
              <FormControlHelperText style={{ color: theme.colors.neutral.gray[500] }}>
                Du musst mindestens 16 Jahre alt sein
              </FormControlHelperText>
            </FormControlHelper>

            {error && age.length > 0 && (
              <FormControlError>
                <FormControlErrorIcon as={OctagonAlert} style={{ color: theme.colors.error }} />
                <FormControlErrorText style={{ color: theme.colors.error }}>
                  {error}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Info Box */}
          <View style={{ backgroundColor: theme.colors.accent.bg }} className="rounded-xl p-4 mt-6">
            <Text style={{ color: theme.colors.neutral.gray[700] }} className="text-sm">
              🔒 Dein Alter wird nur verwendet, um dir altersgerechte Events anzuzeigen und ist nicht öffentlich sichtbar.
            </Text>
          </View>
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