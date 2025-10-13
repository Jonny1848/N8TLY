import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { supabase } from "../lib/supabase";
import { theme } from "../constants/theme";

export default function home() {

  const logout = async () => {
    const { data, error } = await supabase.auth.signOut();
    if (error) console.error('Fehler beim Logout:', error);
    else console.log('[AUTH] User erfolgreich abgemeldet');
  }
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text style={{ color: theme.colors.primary.main }} className="text-2xl font-bold mb-4">
        Home-Bildschirm
      </Text>
      <Pressable
        style={{ backgroundColor: theme.colors.primary.main }}
        className="rounded-xl px-6 py-3"
        onPress={logout}
      >
        <Text className="text-white font-medium">Logout</Text>
      </Pressable>
    </View>
  )
}