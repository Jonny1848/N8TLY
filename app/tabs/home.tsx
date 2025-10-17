import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { MapPin, SlidersHorizontal, Locate } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken("sk.eyJ1Ijoiam9ubnkyMDA1IiwiYSI6ImNtZ3R0MDVwODA3MTMyanI3eTRiM2k0bHEifQ.JDKw4aOqKw_UNLKok4gvOQ");


export default function HomeScreen() {
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Minimalistischer Header */}
      <SafeAreaView edges={['top']} className="bg-white w-full h-44">
        <View className="flex-row justify-between items-center px-5 py-2">
          {/* Logo */}
          <View className="flex-row items-center">
            <Image 
              source={require("../../assets/N8T4.png")} 
              className="w-40 h-40" 
              resizeMode="contain"
            />
          </View>
          
          {/* Rechts: Filter Button */}
          <Pressable 
            className="w-12 h-12 rounded-2xl justify-center items-center"
            style={{ backgroundColor: `${theme.colors.primary.main}15` }}
            onPress={() => setFilterVisible(!filterVisible)}
          >
            <SlidersHorizontal 
              size={24} 
              color={theme.colors.primary.main} 
              strokeWidth={2.5}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Map Container - Fullscreen */}
      <View className="flex-1 relative">
        {/* TODO: Mapbox Map wird hier eingebaut sobald Build-Probleme gelöst sind */}
        <View className="flex-1 bg-gray-50">
          <View className="flex-1 justify-center items-center px-10">
            <MapPin size={64} color={theme.colors.primary.main} strokeWidth={1.5} />
            <Text className="text-lg font-semibold text-gray-900 mt-4 text-center">
              Map-Placeholder
            </Text>
            <Text className="text-sm text-gray-600 mt-2 text-center">
              Zuerst müssen wir die App zum Laufen bringen
            </Text>
          </View>
        </View>

        {/* Location Button - Unten rechts */}
        <View className="absolute bottom-24 right-5">
          <Pressable 
            className="w-14 h-14 rounded-full justify-center items-center shadow-lg"
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            <Locate size={26} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Event Preview Card - Unten (optional, kann später aktiviert werden) */}
        {/* <View className="absolute bottom-0 left-0 right-0 px-4 pb-24">
          <View className="bg-white rounded-3xl p-4 shadow-xl">
            <Text className="text-base font-bold text-gray-900">Event Name</Text>
            <Text className="text-sm text-gray-600 mt-1">Location • Distance</Text>
          </View>
        </View> */}
      </View>

      {/* Filter Panel - Slide-in von rechts */}
      {filterVisible && (
        <>
          {/* Backdrop */}
          <Pressable 
            className="absolute inset-0 bg-black/30"
            onPress={() => setFilterVisible(false)}
          />
          
          {/* Filter Panel */}
          <View className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl">
            <SafeAreaView edges={['top', 'bottom']} className="flex-1">
              {/* Header */}
              <View className="px-6 py-4 border-b border-gray-200">
                <View className="flex-row justify-between items-center">
                  <Text className="text-2xl font-bold text-gray-900">Filter</Text>
                  <Pressable onPress={() => setFilterVisible(false)}>
                    <Text className="text-base font-semibold" style={{ color: theme.colors.primary.main }}>
                      Fertig
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Filter Content */}
              <View className="flex-1 px-6 py-4">
                {/* Radius Filter */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Radius
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    <Pressable className="px-4 py-2 rounded-full" 
                              style={{ backgroundColor: theme.colors.primary.main }}>
                      <Text className="text-sm font-semibold text-white">5 km</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">10 km</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">20 km</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">50 km</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Musik Genre Filter */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Musik
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Techno</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">House</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Hip-Hop</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Electronic</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Trance</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Event-Art Filter */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Event-Art
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Club</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Rooftop</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Festival</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Bar</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Open Air</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Datum Filter */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Wann?
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Heute</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Morgen</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Wochenende</Text>
                    </Pressable>
                    <Pressable className="px-4 py-2 rounded-full bg-gray-100">
                      <Text className="text-sm font-semibold text-gray-700">Diese Woche</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Footer - Reset & Apply */}
              <View className="px-6 py-4 border-t border-gray-200">
                <View className="flex-row gap-3">
                  <Pressable className="flex-1 py-3 rounded-xl border-2 border-gray-200">
                    <Text className="text-center text-base font-semibold text-gray-700">
                      Zurücksetzen
                    </Text>
                  </Pressable>
                  <Pressable 
                    className="flex-1 py-3 rounded-xl"
                    style={{ backgroundColor: theme.colors.primary.main }}
                  >
                    <Text className="text-center text-base font-semibold text-white">
                      Anwenden
                    </Text>
                  </Pressable>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </>
      )}
    </View>
  );
}