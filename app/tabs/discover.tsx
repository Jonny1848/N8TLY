import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MapPin,
  Calendar,
  Sparkles 
} from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function DiscoverScreen() {
  // Dummy data für die Vorschau
  const trendingEvents = [
    { id: '1', title: 'Techno Warehouse', attendees: 234, location: 'Berlin Mitte' },
    { id: '2', title: 'Summer Rooftop', attendees: 189, location: 'Kreuzberg' },
    { id: '3', title: 'House Festival', attendees: 456, location: 'Prenzlauer Berg' },
  ];

  const friendsActivity = [
    { id: '1', friend: 'Max', event: 'Berghain Night', action: 'geht hin' },
    { id: '2', friend: 'Lisa', event: 'Rooftop Party', action: 'ist interessiert' },
  ];

  const recommendations = [
    { id: '1', title: 'Deep House Session', match: 95, reason: 'Basierend auf deinen Musik-Präferenzen' },
    { id: '2', title: 'Techno Open Air', match: 88, reason: 'Ähnlich wie Events die du magst' },
  ];

  const goingSoloUsers = [
    { id: '1', name: 'Anna', event: 'Berghain', age: 24 },
    { id: '2', name: 'Tom', event: 'Sisyphos', age: 27 },
    { id: '3', name: 'Sarah', event: 'Watergate', age: 25 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4">
        <View>
          <Text className="text-3xl font-bold text-gray-900">Discover</Text>
          <Text className="text-sm text-gray-600 mt-1">Finde neue Events & Leute</Text>
        </View>
        <View className="w-12 h-12 rounded-full justify-center items-center" 
              style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
          <Sparkles size={24} color={theme.colors.primary.main} strokeWidth={2} />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Trending Events Section */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2.5 px-5 mb-4">
            <TrendingUp size={22} color={theme.colors.primary.main} strokeWidth={2} />
            <Text className="text-lg font-bold text-gray-900">Hot Right Now</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {trendingEvents.map((event) => (
              <Pressable key={event.id} className="w-40 bg-white rounded-2xl p-3 border border-gray-200">
                <View className="absolute top-3 right-3 w-7 h-7 rounded-full justify-center items-center z-10" 
                      style={{ backgroundColor: theme.colors.primary.main }}>
                  <TrendingUp size={16} color="#fff" strokeWidth={2.5} />
                </View>
                <View className="w-full h-24 rounded-xl justify-center items-center mb-2" 
                      style={{ backgroundColor: `${theme.colors.primary.main}10` }}>
                  <Calendar size={32} color={theme.colors.primary.main} strokeWidth={1.5} />
                </View>
                <Text className="text-sm font-semibold text-gray-900 mb-2" numberOfLines={2}>
                  {event.title}
                </Text>
                <View className="gap-1">
                  <View className="flex-row items-center gap-1.5">
                    <Users size={14} color={theme.colors.neutral.gray[600]} />
                    <Text className="text-xs font-semibold text-gray-600">{event.attendees}</Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <MapPin size={14} color={theme.colors.neutral.gray[600]} />
                    <Text className="text-xs text-gray-600 flex-1" numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Friends Activity Section */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2.5 px-5 mb-4">
            <Users size={22} color={theme.colors.primary.main} strokeWidth={2} />
            <Text className="text-lg font-bold text-gray-900">Was deine Freunde machen</Text>
          </View>
          
          {friendsActivity.map((activity) => (
            <Pressable key={activity.id} className="flex-row items-center px-5 py-3 gap-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
                <Text className="text-lg font-bold text-gray-700">
                  {activity.friend[0]}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-700 leading-5">
                  <Text className="font-semibold text-gray-900">{activity.friend}</Text>
                  {' '}{activity.action} zu{' '}
                  <Text className="font-semibold" style={{ color: theme.colors.primary.main }}>
                    {activity.event}
                  </Text>
                </Text>
              </View>
              <Pressable className="px-4 py-2 rounded-lg" 
                        style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
                <Text className="text-xs font-semibold" style={{ color: theme.colors.primary.main }}>
                  Details
                </Text>
              </Pressable>
            </Pressable>
          ))}
        </View>

        {/* Personalized Recommendations */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2.5 px-5 mb-4">
            <Heart size={22} color={theme.colors.primary.main} strokeWidth={2} />
            <Text className="text-lg font-bold text-gray-900">Für dich empfohlen</Text>
          </View>
          
          {recommendations.map((rec) => (
            <Pressable key={rec.id} className="flex-row mx-5 mb-3 bg-white rounded-2xl p-3 border border-gray-200 gap-3">
              <View className="w-20 h-20 rounded-xl justify-center items-center" 
                    style={{ backgroundColor: `${theme.colors.primary.main}10` }}>
                <Sparkles size={32} color={theme.colors.primary.main} strokeWidth={1.5} />
              </View>
              <View className="flex-1 justify-center">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="flex-1 text-base font-semibold text-gray-900">{rec.title}</Text>
                  <View className="px-2.5 py-1 rounded-xl ml-2" style={{ backgroundColor: theme.colors.primary.main }}>
                    <Text className="text-xs font-bold text-white">{rec.match}%</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-600 leading-4">{rec.reason}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Going Solo Section */}
        <View className="py-5 mb-0" style={{ backgroundColor: `${theme.colors.primary.main}05` }}>
          <View className="flex-row items-center gap-2.5 px-5 mb-2">
            <View className="w-9 h-9 rounded-full justify-center items-center" 
                  style={{ backgroundColor: theme.colors.primary.main }}>
              <Users size={18} color="#fff" strokeWidth={2} />
            </View>
            <Text className="text-lg font-bold text-gray-900">Allein unterwegs</Text>
          </View>
          <Text className="px-5 text-xs text-gray-600 leading-5 mb-4">
            Diese Leute gehen alleine zu Events und sind offen für neue Kontakte
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {goingSoloUsers.map((user) => (
              <Pressable key={user.id} className="w-36 bg-white rounded-2xl p-4 items-center border border-gray-200">
                <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center mb-2">
                  <Text className="text-2xl font-bold text-gray-700">{user.name[0]}</Text>
                </View>
                <View className="px-2.5 py-1 rounded-xl mb-2" style={{ backgroundColor: theme.colors.primary.main }}>
                  <Text className="text-xs font-bold text-white">Going Solo</Text>
                </View>
                <Text className="text-sm font-semibold text-gray-900 mb-1 text-center">
                  {user.name}, {user.age}
                </Text>
                <Text className="text-xs text-gray-600 mb-3 text-center" numberOfLines={1}>
                  {user.event}
                </Text>
                <Pressable className="w-full py-2 rounded-lg" 
                          style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
                  <Text className="text-xs font-semibold text-center" 
                        style={{ color: theme.colors.primary.main }}>
                    Nachricht
                  </Text>
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
}