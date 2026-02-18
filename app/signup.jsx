import { View, Text, Pressable, Image, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Alert, Platform, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter, Redirect } from 'expo-router';
import { supabase } from "../lib/supabase";
import { useOAuthHandlers } from "./hooks/useOAuthHandlers";
import { theme } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { EnvelopeIcon } from "react-native-heroicons/outline";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import { CheckIcon } from "react-native-heroicons/solid";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const router = useRouter();

  // OAuth-Logik zentral im Hook (Google + Apple)
  const {
    signInWithGoogle,
    signInWithApple,
    oauthProcessing,
    oauthRedirectTo,
    appleAuthAvailable,
  } = useOAuthHandlers({ setErrorMsg, mode: 'signup', router });

  // Deklarativer Redirect nach OAuth
  if (oauthRedirectTo) {
    return <Redirect href={oauthRedirectTo} />;
  }

  // OAuth-Overlay: Signup-Form verstecken, bis Weiterleitung
  if (oauthProcessing) {
    return (
      <View style={styles.oauthOverlay}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.oauthOverlayText}>Registrierung wird verarbeitet...</Text>
      </View>
    );
  }

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = password.length >= 6;
  const passwordMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSignUp = async () => {
    setSubmitted(true);
    setErrorMsg("");

    if (!emailValid) {
      setErrorMsg("Bitte gebe eine gültige Email ein.");
      return;
    }

    if (!passwordValid) {
      setErrorMsg("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    if (!passwordMatch) {
      setErrorMsg("Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    console.log('[SIGNUP] Starte Registrierung für:', email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error('=== REGISTRIERUNGS-FEHLER ===');
      console.error('Error Message:', error.message);
      console.error('Error Status:', error.status);
      console.error('Error Code:', error.code);
      console.error('Komplettes Error-Objekt:', JSON.stringify(error, null, 2));
      console.error('===========================');

      let userMessage = error.message;
      if (error.message.includes('Database error')) {
        userMessage = 'Datenbankfehler bei der Registrierung. Bitte versuche es erneut oder kontaktiere den Support.';
      }

      setErrorMsg(userMessage);
      return;
    }

    // Erfolgreiche Registrierung
    console.log('[SIGNUP] Registrierung erfolgreich!');
    console.log('[SIGNUP] User ID:', data?.user?.id);
    console.log('[SIGNUP] Email:', data?.user?.email);

    Alert.alert('Registrierung erfolgreich! Du kannst dich jetzt anmelden.');
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="flex-1 px-6 pt-6">
          {/* Logo */}
          <View className="items-center mb-8">
            <Image 
              source={require("../assets/N8LY9.png")} 
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View className="mb-6 items-center justify-center" style={{ alignItems: 'center' }}>
            <Text className="text-3xl font-bold text-black mb-2" style={{ textAlign: 'center', fontFamily: 'Manrope_700Bold' }}>
              Konto erstellen
            </Text>
            <Text className="text-base text-gray-500" style={{ textAlign: 'center', fontFamily: 'Manrope_400Regular' }}>
              Erstelle dein Konto und leg los
            </Text>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-5">
            <Pressable
              onPress={() => router.replace("/login")}
              className={`flex-1 py-3 rounded-lg ${activeTab === "signin" ? "bg-white" : ""}`}
            >
              <Text className={`text-center font-semibold ${activeTab === "signin" ? "text-black" : "text-gray-500"}`} style={{ fontFamily: 'Manrope_600SemiBold' }}>
                Anmelden
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("signup")}
              className={`flex-1 py-3 rounded-lg ${activeTab === "signup" ? "bg-white" : ""}`}
            >
              <Text className={`text-center font-semibold ${activeTab === "signup" ? "text-black" : "text-gray-500"}`} style={{ fontFamily: 'Manrope_600SemiBold' }}>
                Registrieren
              </Text>
            </Pressable>
          </View>

          {/* Email Input */}
          <View className="mb-3">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white" style={{ minHeight: 56, paddingVertical: 16 }}>
              <EnvelopeIcon size={20} color={theme.colors.neutral.gray[500]} />
              <TextInput
                className="flex-1 ml-3 text-base text-black"
                placeholder="E-Mail Adresse"
                placeholderTextColor={theme.colors.neutral.gray[400]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ paddingVertical: 0, lineHeight: 20 }}
              />
              {emailValid && email.length > 0 && (
                <CheckIcon size={20} color={theme.colors.success} />
              )}
            </View>
            {submitted && !emailValid && (
              <Text className="text-red-500 text-sm mt-1 ml-1" style={{}}>
                Bitte gebe eine gültige Email ein.
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-3">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white" style={{ minHeight: 56, paddingVertical: 16 }}>
              <TextInput
                className="flex-1 text-base text-black"
                placeholder="Passwort"
                placeholderTextColor={theme.colors.neutral.gray[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ paddingVertical: 0, lineHeight: 20 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                {showPassword ? (
                  <EyeSlashIcon size={20} color={theme.colors.neutral.gray[500]} />
                ) : (
                  <EyeIcon size={20} color={theme.colors.neutral.gray[500]} />
                )}
              </TouchableOpacity>
            </View>
            {submitted && !passwordValid && (
              <Text className="text-red-500 text-sm mt-1 ml-1" style={{}}>
                Passwort muss mindestens 6 Zeichen lang sein.
              </Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-4">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white" style={{ minHeight: 56, paddingVertical: 16 }}>
              <TextInput
                className="flex-1 text-base text-black"
                placeholder="Passwort bestätigen"
                placeholderTextColor={theme.colors.neutral.gray[400]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={{ paddingVertical: 0, lineHeight: 20 }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ padding: 4 }}>
                {showConfirmPassword ? (
                  <EyeSlashIcon size={20} color={theme.colors.neutral.gray[500]} />
                ) : (
                  <EyeIcon size={20} color={theme.colors.neutral.gray[500]} />
                )}
              </TouchableOpacity>
            </View>
            {submitted && !passwordMatch && (
              <Text className="text-red-500 text-sm mt-1 ml-1" style={{}}>
                Passwörter stimmen nicht überein.
              </Text>
            )}
          </View>

          {/* Error Message */}
          {errorMsg && (
            <View className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200">
              <Text className="text-red-600 text-sm" style={{}}>{errorMsg}</Text>
            </View>
          )}

          {/* Continue Button */}
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            className={`py-4 rounded-xl mb-5 ${loading ? "opacity-50" : ""}`}
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            {loading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white font-semibold text-center ml-2" style={{ fontFamily: 'Manrope_600SemiBold' }}>
                  Wird geladen...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-base" style={{ fontFamily: 'Manrope_600SemiBold' }}>
                Loslegen
              </Text>
            )}
          </Pressable>

          {/* Or Continue With */}
          <View className="flex-row items-center mb-5">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm" style={{ fontFamily: 'Manrope_400Regular' }}>Oder weiter mit</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center gap-12 mb-6">
            {/* Google */}
            <TouchableOpacity
              onPress={signInWithGoogle}
              className="w-14 h-14 rounded-full bg-white border border-gray-200 items-center justify-center"
            >
              <Image source={require("../assets/google.png")} className="w-6 h-6" />
            </TouchableOpacity>

            {/* Apple (nur iOS, nativer Flow) */}
            {Platform.OS === 'ios' && appleAuthAvailable && (
              <TouchableOpacity
                onPress={signInWithApple}
                className="w-14 h-14 rounded-full bg-black items-center justify-center"
              >
                <Image source={require("../assets/appleLogoWhite.png")} className="w-6 h-6" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  oauthOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  oauthOverlayText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.neutral.gray[600],
    fontFamily: 'Manrope_400Regular',
  },
});
