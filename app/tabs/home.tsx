import { View, Text, Pressable, Image, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { AdjustmentsHorizontalIcon as AdjustmentsHorizontalIconOutline } from 'react-native-heroicons/outline';
import { theme } from '../../constants/theme';
import MapboxGL from "@rnmapbox/maps";
import * as Location from 'expo-location';
import { useAudioPlayer } from 'expo-audio';
import { FilterBottomSheet } from '../../components/FilterBottomSheet';
import { supabase } from '../../lib/supabase'; 

const MAPBOX_ACCESS_TOKEN = "sk.eyJ1Ijoiam9ubnkyMDA1IiwiYSI6ImNtZ3R0MDVwODA3MTMyanI3eTRiM2k0bHEifQ.JDKw4aOqKw_UNLKok4gvOQ";

MapboxGL.setAccessToken("sk.eyJ1Ijoiam9ubnkyMDA1IiwiYSI6ImNtZ3R0MDVwODA3MTMyanI3eTRiM2k0bHEifQ.JDKw4aOqKw_UNLKok4gvOQ");

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // ⭐ Event-States
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = useRef<MapboxGL.MapView>(null);
  const flightPlayer = useAudioPlayer(require('../../assets/flight.mp3'));

  const BERLIN_COORDS = { latitude: 52.520008, longitude: 13.404954 };

  // ============================
  // Nutzerposition holen
  // ============================
  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    const start = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setUserLocation(BERLIN_COORDS);
          return;
        }

        // Erstposition
        const loc = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        };

        setUserLocation(coords);

        // Live-Tracking
        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 50 },
          (newLoc) => {
            setUserLocation({
              latitude: newLoc.coords.latitude,
              longitude: newLoc.coords.longitude
            });
          }
        );
      } catch (e) {
        setUserLocation(BERLIN_COORDS);
      }
    };

    start();
    return () => sub?.remove();
  }, []);

  // ============================
  // 🔥 Supabase: Events laden basierend auf Map-Bounds
  // ============================
  const fetchEventsInBounds = async (bounds: any) => {
    if (!bounds) return;
  
    // bounds: [[lng1, lat1], [lng2, lat2]]
    const [[lng1, lat1], [lng2, lat2]] = bounds;
  
    const swLat = Math.min(lat1, lat2);
    const neLat = Math.max(lat1, lat2);
    const swLng = Math.min(lng1, lng2);
    const neLng = Math.max(lng1, lng2);
  
    setLoadingEvents(true);
  
    const { data, error } = await supabase.rpc("get_events_in_bounds", {
      sw_lat: swLat,
      sw_lng: swLng,
      ne_lat: neLat,
      ne_lng: neLng,
    });
  
    if (error) {
      console.error("RPC Fehler get_events_in_bounds:", error);
    } else {
      /// console.log("Events aus Supabase:", data);
      setEvents(data ?? []);
    }
  
    setLoadingEvents(false);
  };

  // Wenn sich die Map bewegt → neue Events laden
  const handleRegionChange = async () => {
    try {
      const bounds = await mapRef.current?.getVisibleBounds();
      if (bounds) fetchEventsInBounds(bounds);
    } catch (e) {
      console.log("bounds error", e);
    }
  };

  // ============================
  // Fluggeräusch & Locate Button
  // ============================
  const playFlightSound = () => {
    try {
      flightPlayer.seekTo(0);
      flightPlayer.play();
    } catch {}
  };

  const handleLocatePress = () => {
    if (!userLocation) return;
    playFlightSound();
    cameraRef.current?.setCamera({
      centerCoordinate: [userLocation.longitude, userLocation.latitude],
      zoomLevel: 15,
      animationDuration: 1000,
    });
  };

  // ============================
  // 🔎 Suche über Mapbox Geocoding
  // ============================
  const searchCity = async (city: string) => {
    if (!city.trim()) return;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`
    );

    const data = await res.json();
    if (!data.features?.length) return;

    const [lng, lat] = data.features[0].center;

    playFlightSound();
    cameraRef.current?.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: 12,
      animationDuration: 1500,
    });

    Keyboard.dismiss();
  };

  // ==================================
  // 🔥 RENDER
  // ==================================

  return (
    <View className="flex-1 bg-white">
      
      {/* MAP */}
      <MapboxGL.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        styleURL="mapbox://styles/jonny2005/cmiag4rgh00eb01s90y2r7qw0"
        onRegionDidChange={handleRegionChange}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={
            userLocation
              ? [userLocation.longitude, userLocation.latitude]
              : [13.404954, 52.520008]
          }
          animationMode="flyTo"
          animationDuration={1000}
        />

        <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} />

        {/* ⭐ EVENT MARKER */}
        {events.map((event) => (
          <MapboxGL.PointAnnotation
            key={event.id}
            id={event.id}
            coordinate={[event.location_lng, event.location_lat]}
          >
            <View className="w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      {/* Logo zentral oben */}
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 items-center pt-1" style={{ zIndex: 10 }}>
        <Image
          source={require('../../assets/N8LY9.png')}
          style={{ width: 140, height: 140 }}
          resizeMode="contain"
        />
      </SafeAreaView>

      {/* Filter */}
      <SafeAreaView edges={['top']} className="absolute top-0 right-0" style={{ zIndex: 10 }}>
        <View className="p-5 pt-6">
          <Pressable
            className="w-12 h-12 rounded-2xl justify-center items-center shadow-lg bg-white"
            style={{ backgroundColor: theme.colors.neutral.gray[50] }}
            onPress={() => setFilterVisible(true)}
          >
            <AdjustmentsHorizontalIconOutline size={24} color="black" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Locate Button */}
      <View className="absolute bottom-32 left-5" style={{ zIndex: 10 }}>
        <Pressable
          className="w-14 h-14 rounded-full justify-center items-center shadow-xl"
          style={{ backgroundColor: theme.colors.primary.main2 }}
          onPress={handleLocatePress}
        >
          <MapPinIcon size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Suche */}
      <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0" style={{ zIndex: 5 }}>
        <View className="px-5 pb-2 mb-1">
          <View className="flex-row items-center bg-white rounded-full px-5 py-4 shadow-xl space-x-10">
            <MagnifyingGlassIcon size={22} color={theme.colors.neutral.gray[500]} />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="Where do you want to go?"
              placeholderTextColor={theme.colors.neutral.gray[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                searchCity(searchQuery);
                setSearchQuery('');
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={() => {}}
        onReset={() => {}}
      />
    </View>
  );
}