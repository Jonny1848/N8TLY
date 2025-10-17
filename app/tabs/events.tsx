import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Search, SlidersHorizontal, Calendar as CalendarIcon } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data für die Vorschau
  const upcomingEvents = [
    { id: '1', title: 'Techno Night', venue: 'Berghain', date: 'Heute, 23:00', type: 'Club' },
    { id: '2', title: 'Summer Rooftop Party', venue: 'Klunkerkranich', date: 'Morgen, 20:00', type: 'Rooftop' },
    { id: '3', title: 'House Music Festival', venue: 'Sisyphos', date: 'Sa, 15.06', type: 'Festival' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-4">
        <Text className="text-3xl font-bold text-gray-900">Events</Text>
        <Text className="text-sm text-gray-600 mt-1">Finde deine nächste Party</Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row px-5 gap-3 mb-4">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3 gap-3">
          <Search size={20} color={theme.colors.neutral.gray[400]} />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Event, Location oder Artist suchen..."
            placeholderTextColor={theme.colors.neutral.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable className="w-12 h-12 rounded-xl bg-gray-100 justify-center items-center">
          <SlidersHorizontal size={20} color={theme.colors.neutral.gray[700]} />
        </Pressable>
      </View>

      {/* Quick Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="max-h-12 mb-4"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        <Pressable className="px-4 py-2 rounded-full" style={{ backgroundColor: theme.colors.primary.main }}>
          <Text className="text-sm font-semibold text-white">Alle</Text>
        </Pressable>
        <Pressable className="px-4 py-2 rounded-full bg-gray-100">
          <Text className="text-sm font-semibold text-gray-700">Heute</Text>
        </Pressable>
        <Pressable className="px-4 py-2 rounded-full bg-gray-100">
          <Text className="text-sm font-semibold text-gray-700">Dieses WE</Text>
        </Pressable>
        <Pressable className="px-4 py-2 rounded-full bg-gray-100">
          <Text className="text-sm font-semibold text-gray-700">Techno</Text>
        </Pressable>
        <Pressable className="px-4 py-2 rounded-full bg-gray-100">
          <Text className="text-sm font-semibold text-gray-700">House</Text>
        </Pressable>
        <Pressable className="px-4 py-2 rounded-full bg-gray-100">
          <Text className="text-sm font-semibold text-gray-700">Rooftop</Text>
        </Pressable>
      </ScrollView>

      {/* Events List */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-900">Nächste Events</Text>
          <Text className="text-sm text-gray-600">{upcomingEvents.length} Events</Text>
        </View>

        {upcomingEvents.map((event) => (
          <Pressable key={event.id} className="flex-row bg-white rounded-2xl p-3 mb-4 border border-gray-200">
            {/* Event Image Placeholder */}
            <View className="w-24 h-24 rounded-xl justify-center items-center mr-3" 
                  style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
              <CalendarIcon size={40} color={theme.colors.primary.main} strokeWidth={1.5} />
            </View>
            
            <View className="flex-1 justify-between">
              <View className="flex-row justify-between items-start mb-1">
                <Text className="flex-1 text-base font-bold text-gray-900">{event.title}</Text>
                <View className="px-2 py-1 rounded-md ml-2" style={{ backgroundColor: theme.colors.primary.light }}>
                  <Text className="text-xs font-semibold" style={{ color: theme.colors.primary.main }}>
                    {event.type}
                  </Text>
                </View>
              </View>
              
              <Text className="text-sm text-gray-600 mb-1">{event.venue}</Text>
              <Text className="text-xs text-gray-500 mb-2">{event.date}</Text>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                  <View className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white -ml-2" />
                  <View className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white -ml-2" />
                  <Text className="text-xs font-semibold text-gray-600 ml-2">+12</Text>
                </View>
                
                <Pressable className="px-4 py-1.5 rounded-lg" 
                          style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
                  <Text className="text-xs font-semibold" style={{ color: theme.colors.primary.main }}>
                    Interessiert
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Load More */}
        <View className="items-center mt-2">
          <Pressable className="px-6 py-3 rounded-xl bg-gray-100">
            <Text className="text-sm font-semibold text-gray-700">Mehr Events laden</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}