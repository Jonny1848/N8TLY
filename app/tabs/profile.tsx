import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Ticket,
  Heart,
  MapPin,
  Calendar,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  Star
} from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [user] = useState({
    name: 'Max Mustermann',
    username: '@maxmuster',
    bio: 'Techno-Lover aus Berlin 🎵',
    eventsAttended: 24,
    friendsCount: 156,
  });

  // Dummy tickets
  const upcomingTickets = [
    { id: '1', event: 'Berghain Night', date: 'Sa, 15.06', venue: 'Berghain', price: '25€' },
    { id: '2', event: 'Rooftop Party', date: 'So, 16.06', venue: 'Klunkerkranich', price: '15€' },
  ];

  const handleLogout = async () => {
    console.log('[LOGOUT] Starting logout process...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[LOGOUT] Fehler beim Logout:', error);
    } else {
      console.log('[LOGOUT] signOut successful, waiting for auth state change...');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Settings */}
        <View className="flex-row justify-between items-center px-5 pt-3 pb-4">
          <Text className="text-3xl font-bold text-gray-900">Profil</Text>
          <Pressable className="w-10 h-10 rounded-xl bg-gray-100 justify-center items-center">
            <Settings size={24} color={theme.colors.neutral.gray[700]} />
          </Pressable>
        </View>

        {/* Profile Info */}
        <View className="items-center px-5 py-6 mx-5 mb-6 rounded-3xl" 
              style={{ backgroundColor: `${theme.colors.primary.main}05` }}>
          <View className="relative mb-4">
            <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center border-4 border-white">
              <User size={48} color={theme.colors.neutral.gray[600]} strokeWidth={1.5} />
            </View>
            <Pressable className="absolute bottom-0 right-0 px-3 py-1.5 rounded-xl border-2 border-white" 
                      style={{ backgroundColor: theme.colors.primary.main }}>
              <Text className="text-xs font-semibold text-white">Bearbeiten</Text>
            </Pressable>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-1">{user.name}</Text>
          <Text className="text-sm text-gray-600 mb-2">{user.username}</Text>
          <Text className="text-sm text-gray-700 text-center mb-5">{user.bio}</Text>

          {/* Stats */}
          <View className="flex-row bg-white rounded-2xl p-4 w-full mb-4">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold mb-1" style={{ color: theme.colors.primary.main }}>
                {user.eventsAttended}
              </Text>
              <Text className="text-xs text-gray-600">Events</Text>
            </View>
            <View className="w-px bg-gray-200 mx-2" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold mb-1" style={{ color: theme.colors.primary.main }}>
                {user.friendsCount}
              </Text>
              <Text className="text-xs text-gray-600">Freunde</Text>
            </View>
            <View className="w-px bg-gray-200 mx-2" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold mb-1" style={{ color: theme.colors.primary.main }}>
                12
              </Text>
              <Text className="text-xs text-gray-600">Memories</Text>
            </View>
          </View>

          <Pressable className="w-full py-3 rounded-xl items-center" 
                    style={{ backgroundColor: theme.colors.primary.main }}>
            <Text className="text-base font-semibold text-white">Profil bearbeiten</Text>
          </Pressable>
        </View>

        {/* My Tickets Section */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center mb-4">
            <Ticket size={22} color={theme.colors.primary.main} strokeWidth={2} />
            <Text className="flex-1 text-lg font-bold text-gray-900 ml-2.5">Meine Tickets</Text>
            <Pressable className="flex-row items-center gap-1">
              <Text className="text-sm font-semibold" style={{ color: theme.colors.primary.main }}>
                Alle
              </Text>
              <ChevronRight size={16} color={theme.colors.primary.main} />
            </Pressable>
          </View>

          {upcomingTickets.length > 0 ? (
            <>
              {upcomingTickets.map((ticket) => (
                <Pressable key={ticket.id} className="flex-row items-center bg-white rounded-2xl p-4 mb-3 border border-gray-200">
                  <View className="w-12 h-12 rounded-xl justify-center items-center mr-3" 
                        style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
                    <Calendar size={24} color={theme.colors.primary.main} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {ticket.event}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {ticket.venue} • {ticket.date}
                    </Text>
                  </View>
                  <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: theme.colors.primary.light }}>
                    <Text className="text-sm font-bold" style={{ color: theme.colors.primary.main }}>
                      {ticket.price}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </>
          ) : (
            <View className="items-center py-8">
              <Ticket size={48} color={theme.colors.neutral.gray[300]} strokeWidth={1.5} />
              <Text className="text-sm text-gray-600 mt-3">Noch keine Tickets gekauft</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Quick Actions</Text>
          
          <Pressable className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-xl bg-gray-100 justify-center items-center mr-3">
              <Heart size={20} color={theme.colors.neutral.gray[700]} />
            </View>
            <Text className="flex-1 text-base text-gray-900">Favorisierte Events</Text>
            <ChevronRight size={20} color={theme.colors.neutral.gray[400]} />
          </Pressable>

          <Pressable className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-xl bg-gray-100 justify-center items-center mr-3">
              <MapPin size={20} color={theme.colors.neutral.gray[700]} />
            </View>
            <Text className="flex-1 text-base text-gray-900">Favorisierte Locations</Text>
            <ChevronRight size={20} color={theme.colors.neutral.gray[400]} />
          </Pressable>

          <Pressable className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-xl bg-gray-100 justify-center items-center mr-3">
              <Star size={20} color={theme.colors.neutral.gray[700]} />
            </View>
            <Text className="flex-1 text-base text-gray-900">Event-Bewertungen</Text>
            <ChevronRight size={20} color={theme.colors.neutral.gray[400]} />
          </Pressable>
        </View>

        {/* Settings Section */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Einstellungen</Text>
          
          <Pressable className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-xl bg-gray-100 justify-center items-center mr-3">
              <Bell size={20} color={theme.colors.neutral.gray[700]} />
            </View>
            <Text className="flex-1 text-base text-gray-900">Benachrichtigungen</Text>
            <ChevronRight size={20} color={theme.colors.neutral.gray[400]} />
          </Pressable>

          <Pressable className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-xl bg-gray-100 justify-center items-center mr-3">
              <Shield size={20} color={theme.colors.neutral.gray[700]} />
            </View>
            <Text className="flex-1 text-base text-gray-900">Privatsphäre & Sicherheit</Text>
            <ChevronRight size={20} color={theme.colors.neutral.gray[400]} />
          </Pressable>

          <Pressable className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 h-10 rounded-xl bg-gray-100 justify-center items-center mr-3">
              <HelpCircle size={20} color={theme.colors.neutral.gray[700]} />
            </View>
            <Text className="flex-1 text-base text-gray-900">Hilfe & Support</Text>
            <ChevronRight size={20} color={theme.colors.neutral.gray[400]} />
          </Pressable>
        </View>

        {/* Logout */}
        <View className="px-5 mb-6">
          <Pressable 
            className="flex-row items-center justify-center gap-3 py-4 rounded-xl border border-red-200"
            style={{ backgroundColor: '#FEE2E2' }}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="text-base font-semibold" style={{ color: '#EF4444' }}>
              Abmelden
            </Text>
          </Pressable>
        </View>

        {/* App Version */}
        <View className="items-center py-4">
          <Text className="text-xs text-gray-500">N8TLY Version 1.0.0</Text>
        </View>

        {/* Bottom Spacing */}
        <View className="h-5" />
    </ScrollView>
    </SafeAreaView>
  );
}