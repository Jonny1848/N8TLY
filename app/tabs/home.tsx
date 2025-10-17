import { View, Text, Pressable, Image, Platform, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/solid';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { theme } from '../../constants/theme';
import MapboxGL from "@rnmapbox/maps";
import * as Location from 'expo-location';



const MAPBOX_ACCESS_TOKEN = "sk.eyJ1Ijoiam9ubnkyMDA1IiwiYSI6ImNtZ3R0MDVwODA3MTMyanI3eTRiM2k0bHEifQ.JDKw4aOqKw_UNLKok4gvOQ";

MapboxGL.setAccessToken("sk.eyJ1Ijoiam9ubnkyMDA1IiwiYSI6ImNtZ3R0MDVwODA3MTMyanI3eTRiM2k0bHEifQ.JDKw4aOqKw_UNLKok4gvOQ");


export default function HomeScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // BERLIN Fallback für Simulator
  const BERLIN_COORDS = { latitude: 52.520008, longitude: 13.404954 };

  // Live-Location beim Mount
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      try {
        // Permission prüfen
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('[LOCATION] Permission nicht gewährt, nutze Berlin als Fallback');
          setUserLocation(BERLIN_COORDS);
          setLocationError('Location permission not granted');
          return;
        }

        // Erste Position abrufen
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        console.log('[LOCATION] Aktueller Standort:', coords);
        
        // Prüfe ob es Simulator-Default ist (San Francisco)
        if (Math.abs(coords.latitude - 37.785834) < 0.001 &&
            Math.abs(coords.longitude + 122.406417) < 0.001) {
          console.log('[LOCATION] Simulator-Default erkannt, nutze Berlin');
          setUserLocation(BERLIN_COORDS);
        } else {
          setUserLocation(coords);
        }

        // Live-Updates starten
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50, // Update alle 50 Meter
          },
          (newLocation) => {
            const newCoords = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            };
            console.log('[LOCATION] Position update:', newCoords);
            setUserLocation(newCoords);
          }
        );
      } catch (error) {
        console.error('[LOCATION] Fehler beim Abrufen:', error);
        setUserLocation(BERLIN_COORDS);
        setLocationError('Failed to get location');
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const handleLocatePress = () => {
    if (cameraRef.current && userLocation) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  const searchCity = async (cityName: string) => {
    if (!cityName.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const placeName = data.features[0].place_name;
        
        console.log('[SEARCH] Gefunden:', placeName, { latitude, longitude });
        
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 12,
            animationDuration: 1500,
          });
        }
        
        Keyboard.dismiss();
      } else {
        console.log('[SEARCH] Keine Ergebnisse für:', cityName);
      }
    } catch (error) {
      console.error('[SEARCH] Fehler:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      searchCity(searchQuery);
      setSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) {
      setSearchQuery('');
    }
  };

  return (
    <View className="flex-1">
      {/* Fullscreen Map */}
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL="mapbox://styles/mapbox/standard" //standard
          logoEnabled={false}
          attributionEnabled={false}
          compassEnabled={false}
          compassViewPosition={3}
          compassViewMargins={{ x: 20, y: 100 }}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={14}
            centerCoordinate={
              userLocation
                ? [userLocation.longitude, userLocation.latitude]
                : [13.404954, 52.520008] // Berlin als Fallback
            }
            animationMode="flyTo"
            animationDuration={1000}
          />
          
          <MapboxGL.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            minDisplacement={10}
          />
        </MapboxGL.MapView>

      {/* Overlay Elemente */}
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0" style={{ zIndex: 10 }}>
        <View className="px-5 pt-2">
          <View className="flex-row">
            {/* Logo */}
            <Image
              source={require("../../assets/N8T4.png")}
              className="w-28 h-28 "
              resizeMode="contain"
            />
            
            {/* Action Buttons */}
            <View className="flex-row gap-3">
              {/* Search Button */}
              <Pressable
                className="w-12 h-12 rounded-2xl justify-center items-center shadow-lg"
                style={{ backgroundColor: theme.colors.neutral.white }}
                onPress={toggleSearch}
              >
                <MagnifyingGlassIcon
                  size={24}
                  color={theme.colors.primary.main}
                />
              </Pressable>
              
              {/* Filter Button */}
              <Pressable
                className="w-12 h-12 rounded-2xl justify-center items-center shadow-lg"
                style={{ backgroundColor: theme.colors.primary.light }}
                onPress={() => setFilterVisible(!filterVisible)}
              >
                <AdjustmentsHorizontalIcon
                  size={24}
                  color={theme.colors.primary.main}
                />
              </Pressable>
            </View>
          </View>

          {/* Expandable Search Field */}
          {searchExpanded && (
            <View className="mt-3 bg-white rounded-2xl shadow-lg px-4 py-3">
              <View className="flex-row items-center">
                <MagnifyingGlassIcon size={20} color={theme.colors.neutral.gray[500]} />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="Stadt suchen (z.B. Düsseldorf)..."
                  placeholderTextColor={theme.colors.neutral.gray[400]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus={true}
                />
                {isSearching && (
                  <Text className="text-sm ml-2" style={{ color: theme.colors.primary.main }}>
                    ...
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* Location Button - Unten rechts */}
      <View className="absolute bottom-24 right-5" style={{ zIndex: 10 }}>
        <Pressable
          className="w-14 h-14 rounded-full justify-center items-center shadow-lg"
          style={{ backgroundColor: theme.colors.primary.main }}
          onPress={handleLocatePress}
        >
          <MapPinIcon size={26} color="#fff" />
        </Pressable>
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