import { View } from 'react-native';
// Solid Icons (wenn fokussiert)
import { HomeIcon as HomeIconSolid } from 'react-native-heroicons/solid';
import { CalendarIcon as CalendarIconSolid } from 'react-native-heroicons/solid';
import { ChatBubbleLeftIcon as ChatBubbleLeftIconSolid } from 'react-native-heroicons/solid';
import { GlobeAltIcon as GlobeAltIconSolid } from 'react-native-heroicons/solid';
import { UserIcon as UserIconSolid } from 'react-native-heroicons/solid';
// Outline Icons (wenn nicht fokussiert)
import { HomeIcon as HomeIconOutline } from 'react-native-heroicons/outline';
import { CalendarIcon as CalendarIconOutline } from 'react-native-heroicons/outline';
import { ChatBubbleLeftIcon as ChatBubbleLeftIconOutline } from 'react-native-heroicons/outline';
import { GlobeAltIcon as GlobeAltIconOutline } from 'react-native-heroicons/outline';
import { UserIcon as UserIconOutline } from 'react-native-heroicons/outline';
import { theme } from '../../constants/theme';
import {Tabs} from "expo-router"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.neutral.gray[400],
        tabBarStyle: {
          backgroundColor: theme.colors.neutral.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral.gray[200],
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        // Animationen für Tab-Wechsel
        animation: 'shift',
        // Alternativen: 'fade' | 'slide_from_right' | 'slide_from_left' | 'slide_from_bottom' | 'fade_from_bottom' | 'simple_push'
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <HomeIconSolid size={24} color={color} />
            ) : (
              <HomeIconOutline size={24} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <CalendarIconSolid size={24} color={color} />
            ) : (
              <CalendarIconOutline size={24} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Chats',
          tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <ChatBubbleLeftIconSolid size={24} color={color} />
            ) : (
              <ChatBubbleLeftIconOutline size={24} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <GlobeAltIconSolid size={24} color={color} />
            ) : (
              <GlobeAltIconOutline size={24} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <UserIconSolid size={24} color={color} />
            ) : (
              <UserIconOutline size={24} color={color} />
            )
          ),
        }}
      />
    </Tabs>
  );
}