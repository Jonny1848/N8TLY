import { View, Text, Pressable, Image, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from 'expo-router';
import { supabase } from "../lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import { theme } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { EnvelopeIcon } from "react-native-heroicons/outline";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import { CheckIcon } from "react-native-heroicons/solid";

// WICHTIG: Dies erlaubt dem Browser, die Auth-Session abzuschließen
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const router = useRouter();

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = password.length >= 6;

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    console.log('[LOGIN] Starting login...', { emailValid, passwordValid });

    if (emailValid && passwordValid) {
      setSubmitted(true);
      console.log('[LOGIN] Credentials valid, calling Supabase...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      setSubmitted(false);

      if (error) {
        console.error('[LOGIN] Error:', error);
        setLoading(false);

        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Falsche E-Mail oder Passwort.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('Bitte bestätige zuerst deine E-Mail-Adresse.');
        } else {
          setErrorMsg('Anmeldung fehlgeschlagen.');
        }
        return;
      }

      // Erfolgreicher Login
      console.log('[LOGIN] Login successful, session:', data.session?.user?.email);
      setLoading(false);

      // Navigation wird durch _layout.tsx Auth-Listener gehandhabt
      console.log('[LOGIN] Waiting for auth state change handler...');
    } else {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleRegistration = () => {
    router.push("signup");
  };

  const signInWithGoogle = async () => {
    try {
      console.log("[AUTH] Google Sign-In initiated");
      setErrorMsg("");

      const redirectUri = makeRedirectUri({
        scheme: 'n8tly',
        path: 'auth/callback'
      });

      console.log("[AUTH] Redirect URI:", redirectUri);

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

        const url = new URL(result.url);
        const access_token = url.searchParams.get('access_token');
        const refresh_token = url.searchParams.get('refresh_token');

        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            console.error("[AUTH] Session Error:", sessionError);
            setErrorMsg('Fehler beim Setzen der Session');
          } else {
            console.log("[AUTH] Session successfully set");
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-1 px-6 pt-8">
          {/* Logo */}
          <View className="items-center mb-12">
            <Image 
              source={require("../assets/N8LY9.png")} 
              className="w-32 h-32"  // Bigger logo
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View className="mb-8 items-center justify-center" style={{ alignItems: 'center' }}>
            <Text className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'Arial', textAlign: 'center' }}>
              Welcome Back
            </Text>
            <Text className="text-base text-gray-500" style={{ fontFamily: 'Arial', textAlign: 'center' }}>
              Welcome Back, Please enter Your details
            </Text>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
            <Pressable
              onPress={() => setActiveTab("signin")}
              className={`flex-1 py-3 rounded-lg ${activeTab === "signin" ? "bg-white" : ""}`}
            >
              <Text className={`text-center font-semibold ${activeTab === "signin" ? "text-black" : "text-gray-500"}`} style={{ fontFamily: 'Arial' }}>
                Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/signup")}
              className={`flex-1 py-3 rounded-lg ${activeTab === "signup" ? "bg-white" : ""}`}
            >
              <Text className={`text-center font-semibold ${activeTab === "signup" ? "text-black" : "text-gray-500"}`} style={{ fontFamily: 'Arial' }}>
                Signup
              </Text>
            </Pressable>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white" style={{ minHeight: 56, paddingVertical: 16 }}>
              <EnvelopeIcon size={20} color={theme.colors.neutral.gray[500]} />
              <TextInput
                className="flex-1 ml-3 text-base text-black"
                placeholder="Email Address"
                placeholderTextColor={theme.colors.neutral.gray[400]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ fontFamily: 'Arial', paddingVertical: 0, lineHeight: 20 }}
              />
              {emailValid && email.length > 0 && (
                <CheckIcon size={20} color={theme.colors.success} />
              )}
            </View>
            {submitted && !emailValid && (
              <Text className="text-red-500 text-sm mt-1 ml-1" style={{ fontFamily: 'Arial' }}>
                Bitte gebe eine gültige Email ein.
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 bg-white" style={{ minHeight: 56, paddingVertical: 16 }}>
              <TextInput
                className="flex-1 text-base text-black"
                placeholder="Password"
                placeholderTextColor={theme.colors.neutral.gray[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ fontFamily: 'Arial', paddingVertical: 0, lineHeight: 20 }}
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
              <Text className="text-red-500 text-sm mt-1 ml-1" style={{ fontFamily: 'Arial' }}>
                Passwort muss mindestens 6 Zeichen lang sein.
              </Text>
            )}
          </View>

          {/* Error Message */}
          {errorMsg && (
            <View className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
              <Text className="text-red-600 text-sm" style={{ fontFamily: 'Arial' }}>{errorMsg}</Text>
            </View>
          )}

          {/* Continue Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            className={`py-4 rounded-xl mb-6 ${loading ? "opacity-50" : ""}`}
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            {loading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white font-semibold text-center ml-2" style={{ fontFamily: 'Arial' }}>
                  Loading...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-base" style={{ fontFamily: 'Arial' }}>
                Continue
              </Text>
            )}
          </Pressable>

          {/* Or Continue With */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm" style={{ fontFamily: 'Arial' }}>Or Continue With</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center gap-4 mb-8">
            {/* Google */}
            <TouchableOpacity
              onPress={signInWithGoogle}
              className="w-14 h-14 rounded-full bg-white border border-gray-200 items-center justify-center"
            >
              <Image source={require("../assets/google.png")} className="w-6 h-6" />
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              className="w-14 h-14 rounded-full bg-black items-center justify-center"
            >
              <Image source={require("../assets/appleLogoWhite.png")} className="w-6 h-6" />
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: '#1877F2' }}
            >
              <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Arial' }}>f</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Text */}
          <View className="mt-auto">
            <Text className="text-gray-500 text-sm leading-5" style={{ fontFamily: 'Arial' }}>
              
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
