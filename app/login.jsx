import { View, Text, Pressable, Image, ActivityIndicator, ScrollView } from "react-native";
import {
  Input, InputField, Button, ButtonText, InputIcon, InputSlot,
  FormControl, FormControlLabel, FormControlLabelText,
  FormControlHelper, FormControlHelperText,
  FormControlError, FormControlErrorIcon, FormControlErrorText,
  EyeIcon, EyeOffIcon, Alert, AlertText
} from "@gluestack-ui/themed";
import { useState, useEffect } from "react";
import { OctagonAlert } from "lucide-react-native";
import { useRouter } from 'expo-router';
import { supabase } from "../lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import { theme } from "../constants/theme";

// WICHTIG: Dies erlaubt dem Browser, die Auth-Session abzuschließen
WebBrowser.maybeCompleteAuthSession();


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg,setErrorMsg] = useState("");

  const[loading,setLoading] = useState(null);
  const router = useRouter();

  
  const emailValid = /\S+@\S+\.\S+/.test(email);      
  const passwordValid = password.length >= 6;

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    console.log({ emailValid, passwordValid, email, password,submitted });
    if (emailValid && passwordValid) {
      setSubmitted(true);
      console.log("Im Anmeldebutton");
      const{ data, error} = await supabase.auth.signInWithPassword({
        email,password
      });
      setSubmitted(false);
      
      if (error) {
        console.log(error);
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Falsche E-Mail oder Passwort.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('Bitte bestätige zuerst deine E-Mail-Adresse.');
        } else {
          setErrorMsg('Anmeldung fehlgeschlagen.');
        }
        return;
      }
      else {
        setLoading(false);
      }
    }
  };

  const handleRegistration = () => {
    router.push("signup");
  }

  
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const signInWithGoogle = async () => {
    try {
      console.log("[AUTH] Google Sign-In initiated");
      setErrorMsg("");
      
      // Redirect URI für OAuth
      const redirectUri = makeRedirectUri({
        scheme: 'n8tly',
        path: 'auth/callback'
      });
      
      console.log("[AUTH] Redirect URI:", redirectUri);
      
      // OAuth URL von Supabase holen
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("[AUTH] Google Sign-In Error:", error.message);
        setErrorMsg('Google-Anmeldung fehlgeschlagen: ' + error.message);
        return;
      }
      
      if (!data?.url) {
        console.error("[AUTH] No OAuth URL received");
        setErrorMsg('OAuth-URL konnte nicht erstellt werden');
        return;
      }
      
      console.log("[AUTH] Opening OAuth URL:", data.url);
      
      // Browser öffnen für OAuth Flow
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri,
        {
          showInRecents: true,
        }
      );
      
      console.log("[AUTH] Browser result:", JSON.stringify(result, null, 2));
      
      if (result.type === 'success' && result.url) {
        console.log("[AUTH] OAuth successful, URL:", result.url);
        
        // URL-Parameter extrahieren
        const url = new URL(result.url);
        const access_token = url.searchParams.get('access_token');
        const refresh_token = url.searchParams.get('refresh_token');
        
        if (access_token && refresh_token) {
          // Session mit Tokens setzen
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          
          if (sessionError) {
            console.error("[AUTH] Session Error:", sessionError);
            setErrorMsg('Fehler beim Setzen der Session');
          } else {
            console.log("[AUTH] Session successfully set");
            // Navigation wird automatisch durch _layout.tsx gehandhabt
          }
        }
      } else if (result.type === 'cancel') {
        console.log("[AUTH] User cancelled");
        setErrorMsg('Google-Anmeldung abgebrochen');
      } else if (result.type === 'dismiss' || result.type === 'locked') {
        console.log("[AUTH] Browser dismissed or locked");
        setErrorMsg('Browser wurde geschlossen');
      }
    } catch (err) {
      console.error("[AUTH] Google Sign-In Exception:", err);
      setErrorMsg('Ein unerwarteter Fehler ist aufgetreten: ' + (err.message || err));
    }
  };
  

  return (
   <ScrollView className="bg-white">
     <View className="flex-1 justify-center bg-white mt-24">
      <View className="flex-col space-y-6 ml-6 mr-6 mt-10">
       
         <Text className="text-center text-3xl font-bold mb-5" style={{ color: theme.colors.primary.main }}>
           Anmelden
         </Text>
 
           {/* Email */}
           <FormControl isInvalid={submitted && !emailValid} size="sm">
             <FormControlLabel>
               <FormControlLabelText>Email</FormControlLabelText>
             </FormControlLabel>
             <Input
               className="my-1"
               size="md"
               variant="outline"
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
               variant="outline"
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
 
             {/*Anmeldebutton*/}
             <Pressable
               style={{ backgroundColor: theme.colors.primary.main }}
               className="px-5 py-3 rounded-2xl"
               onPress={handleSubmit}
             >
               {loading && passwordValid && emailValid && submitted && (
                 <ActivityIndicator size="small" color="#fff" className="mr-2"/>
               )}
               <Text className="text-white font-bold text-center">
                 {(loading && passwordValid && emailValid && submitted) ? 'Wird gesendet…' : 'Anmelden'}
               </Text>
             </Pressable>
 
 
           {errorMsg &&  (
             <Alert action="warning" variant="solid">
               <AlertText>
               {errorMsg}
               </AlertText>
             </Alert>
           )}
 
             {/*Passwort vergessen*/}
           <View className="">
             <Button variant="link">
               <ButtonText style={{ color: theme.colors.primary.main }}>
                 Passwort vergessen?
               </ButtonText>
             </Button>
           </View>
 
             
 
           <View className = "flex-col justify-center space-y-4">
 
             {/*Mit Google anmelden*/}
           
             <Pressable
               className="bg-white px-4 py-3 rounded-xl mt-5"
               style={{ borderColor: theme.colors.neutral.gray[200], borderWidth: 2 }}
               onPress={signInWithGoogle}
             >
               <View className="flex-row items-center justify-center">
                 <Image source={require("../assets/google.png")} className="w-5 h-5 mr-3" />
                 <Text className="text-gray-700 font-medium">Mit Google anmelden</Text>
               </View>
             </Pressable>
 
             {/*Mit Apple anmelden*/}
             <Pressable
               className="bg-white px-4 py-3 rounded-xl"
               style={{ borderColor: theme.colors.neutral.gray[200], borderWidth: 2 }}
             >
               <View className="flex-row items-center justify-center">
                 <Image source={require("../assets/apple.png")} className="w-5 h-5 mr-3" />
                 <Text className="text-gray-700 font-medium">Mit Apple anmelden</Text>
               </View>
             </Pressable>
           </View>
 
             {/*Registrieren*/}
 
           <View className="flex-row items-center justify-center space-x-1 mb-8">
             <Text style={{ color: theme.colors.neutral.gray[600] }}>
               Du hast noch keinen Account?
             </Text>
             <Button variant="link" onPress={handleRegistration}>
               <ButtonText style={{ color: theme.colors.secondary.main }}>
                 Registrieren
               </ButtonText>
             </Button>
           </View>
         </View>
     </View>
   </ScrollView>
  );
}

