import { View, Text, Pressable, ActivityIndicator, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../components/OnboardingContext';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Sparkles, AlertCircle } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { useEffect } from 'react';


export default function Complete() {
  const router = useRouter();
  const { profileData, resetProfileData } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect (() => {
    console.log('partyPreferences →', profileData.partyPreferences);
  })

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Aktuellen User holen
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Kein User gefunden');
      }

      // Avatar hochladen falls vorhanden
      let avatarUrl = null;
      if (profileData.avatarUri) {
        try {
          const fileName = `${user.id}_${Date.now()}.jpg`;
          const response = await fetch(profileData.avatarUri);
          const blob = await response.blob();
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          
          avatarUrl = publicUrl;
        } catch (uploadError) {
          console.error('Avatar Upload Fehler:', uploadError);
          // Weiter ohne Avatar
        }
      }

      // Profil in Datenbank erstellen/updaten
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profileData.username,
          age: parseInt(profileData.age),
          is_public: profileData.isPublic,
          favorite_city: profileData.favoriteCity,
          location_enabled: profileData.locationEnabled,
          avatar_url: avatarUrl,
          music_genres: profileData.musicGenres,
          party_preferences: profileData.partyPreferences,
          bio: profileData.bio,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Reset context und navigiere zu Home
      resetProfileData();
      router.replace('/tabs');
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1">
      <View className="flex-1 justify-center items-center px-6 py-10">
        {/* Success Icon */}
        <View className="items-center mb-8">
          <View style={{ backgroundColor: theme.colors.accent.bg }} className="rounded-full p-6 mb-6">
            <CheckCircle size={80} color={theme.colors.accent.main} />
          </View>
        </View>

        {/* Titel */}
        <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-4xl font-bold text-center mb-4">
          Fast geschafft!
        </Text>
        
        <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-lg text-center mb-12">
          Dein Profil ist bereit. Lass uns die Party starten! 🎉
        </Text>

        {/* Zusammenfassung */}
        <View
          style={{
            backgroundColor: theme.colors.neutral.white,
            borderColor: theme.colors.neutral.gray[200],
            borderWidth: 2
          }}
          className="w-full rounded-2xl p-6 mb-8"
        >
          <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-lg font-bold mb-4">
            Dein Profil im Überblick:
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-base">👤 Benutzername:</Text>
              <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-base font-semibold ml-2">
                @{profileData.username}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-base">🎂 Alter:</Text>
              <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-base font-semibold ml-2">
                {profileData.age} Jahre
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-base">📍 Stadt:</Text>
              <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-base font-semibold ml-2">
                {profileData.favoriteCity}
              </Text>
            </View>
            
            <View className="flex-row">
              <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-base">🎵 Musikgenres:</Text>
              <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-base font-semibold ml-2 flex-1 flex-wrap">
                {profileData.musicGenres.join(', ')}
              </Text>
            </View>
            
            <View className="flex-row">
              <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-base">🎉 Party-Typen:</Text>
              <Text style={{ color: theme.colors.neutral.gray[900] }} className="text-base font-semibold ml-2 flex-1 flex-wrap">
                {profileData.partyPreferences.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View
            style={{ backgroundColor: theme.colors.error + '15' }}
            className="w-full rounded-xl p-4 mb-6 flex-row items-start"
          >
            <AlertCircle size={20} color={theme.colors.error} className="mr-2 mt-0.5" />
            <Text style={{ color: theme.colors.error }} className="text-sm flex-1">{error}</Text>
          </View>
        )}

        {/* Buttons */}
        <View className="w-full space-y-3">
          <Pressable
            onPress={handleComplete}
            disabled={loading}
            style={{
              backgroundColor: loading ? theme.colors.primary.light : theme.colors.primary.main
            }}
            className="flex-row items-center justify-center px-6 py-4 rounded-2xl"
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-lg font-bold text-white ml-3">
                  Profil wird erstellt...
                </Text>
              </>
            ) : (
              <Text className="text-lg font-bold text-white">
                Profil vervollständigen 🚀
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            disabled={loading}
            className="flex-row items-center justify-center px-6 py-4"
          >
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-base">
              Zurück zum Bearbeiten
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}