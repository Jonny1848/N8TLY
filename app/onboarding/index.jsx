import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import { supabase } from "../../lib/supabase";
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody, Heading,
  AlertDialogBackdrop,Button,ButtonText
} from "@gluestack-ui/themed"
import { useState } from 'react';

export default function Onboarding() {
  const router = useRouter();
  const [showAlertDialog,setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);
  
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Fehler beim Logout:', error);
    else console.log('[AUTH] User erfolgreich abgemeldet');
  };

  const startOnboarding = () => {
    router.push("/onboarding/username");
  };

  return (
    <View style={{ backgroundColor: theme.colors.neutral.white }} className="flex-1 justify-between items-center px-6 py-10">
      {/* Logout oben rechts */}
      <Pressable
        onPress={() => setShowAlertDialog(true)}
        style={{ backgroundColor: theme.colors.neutral.gray[100] }}
        className="absolute top-10 right-5 px-4 py-2 rounded-lg z-10"
      >
        <Text style={{ color: theme.colors.neutral.gray[700] }} className="font-medium">
          Abmelden
        </Text>
      </Pressable>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Möchtest du dich wirklich abmelden
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
             Loggst du dich jetzt aus, wird die Erstellung deines N8TLY-Profils beendet. Willst dich also wirklich abmelden?
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <View className="flex-row items-stretch">
              <Pressable
                variant="outline"
                action="secondary"
                onPress={handleClose}
                size="sm"
                className ="rounded-lg px-4 py-3 bg-slate border-spacing-0 animate-spin"
              >
                <Text>Abbrechen</Text>
              </Pressable>
              <Pressable 
                size="sm" 
                onPress={() => {handleLogout();handleClose();}}
                className ="rounded-lg px-5 py-3 "
              >
                <Text>Ja</Text>
              </Pressable>
            </View>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Oben: Logo + Texte */}
      <View className="flex-1 justify-center items-center">
        <View className="relative mb-8">
          <Image source={require("../../assets/N8T4.png")} className="w-48 h-48" />
        </View>
        
        <Text
          style={{ color: theme.colors.neutral.gray[900] }}
          className="text-3xl font-bold text-center mb-4"
        >
          Willkommen bei N8TLY! 
        </Text>
        
        <Text
          style={{ color: theme.colors.neutral.gray[600] }}
          className="text-lg text-center mb-8 px-4"
        >
          Deine Social-App für unvergessliche Event-Erlebnisse in ganz Deutschland
        </Text>

        <View
          style={{
            backgroundColor: theme.colors.neutral.white,
            borderColor: theme.colors.primary.light,
            borderWidth: 2
          }}
          className="rounded-2xl p-6"
        >
          <Text
            style={{ color: theme.colors.neutral.gray[700] }}
            className="text-base text-center mb-3"
          >
            Lass uns dein Profil erstellen, damit du:
          </Text>
          <View className="space-y-2">
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-sm">
              - Die besten Events in deiner Stadt findest
            </Text>
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-sm">
              - Gleichgesinnte triffst und dich mit ihnen connectest
            </Text>
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-sm">
              - Neue Locations entdeckst
            </Text>
            <Text style={{ color: theme.colors.neutral.gray[600] }} className="text-sm">
              - Teil der N8TLY Community wirst
            </Text>
          </View>
        </View>
      </View>

      {/* Unten: Button */}
      <View className="w-full mb-8">
        <Pressable
          onPress={startOnboarding}
          style={{ backgroundColor: theme.colors.primary.main }}
          className="px-8 py-4 rounded-2xl"
        >
          <Text className="text-white text-lg font-bold text-center">
            Los geht's! 🚀
          </Text>
        </Pressable>
        
        <Text
          style={{ color: theme.colors.neutral.gray[500] }}
          className="text-sm text-center mt-4"
        >
          Dauert nur 2-3 Minuten
        </Text>
      </View>
    </View>
  );
}