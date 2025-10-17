import { View, TouchableOpacity } from 'react-native';
import { 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Compass, 
  User,
  House,
  Home,
  Plus
} from 'lucide-react-native';
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
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? `${theme.colors.primary.main}15` : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <House size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? `${theme.colors.primary.main}15` : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <Calendar size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Chats',
          tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? `${theme.colors.primary.main}15` : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <MessageCircle size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? `${theme.colors.primary.main}15` : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <Compass size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? `${theme.colors.primary.main}15` : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}