import { View, Text, Pressable, ScrollView,Alert } from "react-native";
import {
  Input, InputField, Button, ButtonText, InputIcon, InputSlot,
  FormControl, FormControlLabel, FormControlLabelText,
  FormControlHelper, FormControlHelperText,
  FormControlError, FormControlErrorIcon, FormControlErrorText,
  EyeIcon, EyeOffIcon, ButtonIcon
} from "@gluestack-ui/themed";
import { useRouter } from 'expo-router';
import { useState } from "react";
import { OctagonAlert, ArrowLeft } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import { theme } from "../constants/theme";


export default function SignUp (){
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [testPassword,setTestPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showTestPassword, setShowTestPassword] = useState(false);
    const router = useRouter();
  
    const emailValid = /\S+@\S+\.\S+/.test(email);      
    const passwordValid = password.length >= 6;
    const passwordTestValid = password == testPassword;

    const handleSignUp = async () => {
        setSubmitted(true);
        if (emailValid && passwordValid && passwordTestValid) {
          console.log('[SIGNUP] Starte Registrierung für:', email);
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          // Detailliertes Error-Logging
          if (error) {
            console.error('=== REGISTRIERUNGS-FEHLER ===');
            console.error('Error Message:', error.message);
            console.error('Error Status:', error.status);
            console.error('Error Code:', error.code);
            console.error('Komplettes Error-Objekt:', JSON.stringify(error, null, 2));
            console.error('===========================');
            
            // Benutzerfreundliche Fehlermeldung
            let userMessage = error.message;
            if (error.message.includes('Database error')) {
              userMessage = 'Datenbankfehler bei der Registrierung. Bitte versuche es erneut oder kontaktiere den Support.';
            }
            
            alert(userMessage);
            return;
          }
          
          // Erfolgreiche Registrierung
          console.log('[SIGNUP] Registrierung erfolgreich!');
          console.log('[SIGNUP] User ID:', data?.user?.id);
          console.log('[SIGNUP] Email:', data?.user?.email);
          
          Alert.alert('Registrierung erfolgreich! Du kannst dich jetzt anmelden.');
          router.replace('/login');
        }
      };
    
      const handleState = () => {
        setShowPassword((showState) => {
          return !showState;
        });
      };

      const handleStateTest = () => {
        setShowTestPassword((showState) => {
          return !showState;
        });
      };



    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-col space-y-6 ml-6 mr-6 mt-16">
                <Pressable onPress={() => router.back()} className="mb-4">
                    <ArrowLeft size={28} color={theme.colors.primary.main} />
                </Pressable>
                
                <Text
                  className="text-4xl font-bold mb-5"
                  style={{ color: theme.colors.primary.main }}
                >
                  Account erstellen
                </Text>
                {/* Email */}
                <FormControl isInvalid={submitted && !emailValid} size="sm">
                    <FormControlLabel>
                    <FormControlLabelText>Email</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                      className="my-1"
                      size="md"
                      style={{ borderColor: theme.colors.neutral.gray[200] }}
                    >
                    <InputField
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    </Input>
                    {!emailValid && submitted && (
                    <FormControlError>
                        <FormControlErrorIcon as={OctagonAlert} className="text-red-500" />
                        <FormControlErrorText className="text-red-500">
                        Bitte gebe eine gültige Email ein.
                        </FormControlErrorText>
                    </FormControlError>
                    )}
                </FormControl>

                {/* Passwort */}
                <FormControl isInvalid={submitted && !passwordValid} size="sm">
                    <FormControlLabel>
                    <FormControlLabelText>Passwort</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                      className="my-1"
                      size="md"
                      style={{ borderColor: theme.colors.neutral.gray[200] }}
                    >
                        <InputField
                            type={showPassword ? "text":"password"}
                            placeholder="••••••"
                            value={password}
                            onChangeText={setPassword}
                        />
                        <InputSlot className="pr-3" onPress={handleState}>
                            <InputIcon
                            size="md"
                            as={showPassword ? EyeIcon : EyeOffIcon}
                            className="stroke-background-600"
                            />
                        </InputSlot>
                    </Input>

                    <FormControlHelper>
                    <FormControlHelperText>Mindestens 6 Zeichen.</FormControlHelperText>
                    </FormControlHelper>

                    {!passwordValid && submitted && (
                    <FormControlError>
                        <FormControlErrorIcon as={OctagonAlert} className="text-red-500" />
                        <FormControlErrorText className="text-red-500">
                        Dein eingegebenes Passwort ist nicht gültig.
                        </FormControlErrorText>
                    </FormControlError>
                    )}
                </FormControl>

                {/* Passwort bestätigen */}
                <FormControl isInvalid={submitted && !passwordTestValid} size="sm">
                    <FormControlLabel>
                    <FormControlLabelText>Passwort bestätigen</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                      className="my-1"
                      size="md"
                      style={{ borderColor: theme.colors.neutral.gray[200] }}
                    >
                        <InputField
                            type={showTestPassword ? "text":"password"}
                            placeholder="••••••"
                            value={testPassword}
                            onChangeText={setTestPassword}
                        />
                        <InputSlot className="pr-3" onPress={handleStateTest}>
                            <InputIcon
                            size="md"
                            as={showTestPassword ? EyeIcon : EyeOffIcon}
                            className="stroke-background-600"
                            />
                        </InputSlot>
                    </Input>

                    <FormControlHelper>
                    <FormControlHelperText>Mindestens 6 Zeichen.</FormControlHelperText>
                    </FormControlHelper>
                     {!passwordTestValid && (submitted || !passwordValid) &&(
                        <FormControlError>
                        <FormControlErrorIcon as={OctagonAlert} className="text-red-500" />
                        <FormControlErrorText className="text-red-500">
                        Stimmt nicht mit Passwort überein.
                        </FormControlErrorText>
                    </FormControlError>
                     )}
                </FormControl>

                <Pressable
                  style={{ backgroundColor: theme.colors.primary.main }}
                  className="px-5 py-3 rounded-2xl mt-12 mb-8"
                  onPress={handleSignUp}
                >
                    <Text className="text-white font-bold text-center">
                      Registrieren
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}