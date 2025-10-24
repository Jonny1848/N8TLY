import { View, Text, Pressable, Image, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { MapPinIcon, MagnifyingGlassIcon, MicrophoneIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/solid';
import { theme } from '../../constants/theme';
import MapboxGL from "@rnmapbox/maps";
import * as Location from 'expo-location';
import { useAudioPlayer } from 'expo-audio';
import { FilterBottomSheet } from '../../components/FilterBottomSheet';

const MAPBOX_ACCESS_TOKEN = "sk.eyJ1Ijoiam9ubnkyMDA1IiwiYSI6ImNtZ3R0MDVwODA3MTMyanI3eTRiM2k0bHEifQ.JDKw4aOqKw_UNLKok4gvOQ";

MapboxGL.setAccessToken("sk.eyJ1Ijoiam9ubnkyMDA1IiwiYSI6ImNtZ3R0MDVwODA3MTMyanI3eTRiM2k0bHEifQ.JDKw4aOqKw_UNLKok4gvOQ");

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const flightPlayer = useAudioPlayer(require('../../assets/flight.mp3'));

  // BERLIN Fallback für Simulator
  const BERLIN_COORDS = { latitude: 52.520008, longitude: 13.404954 };

  // Live-Location beim Mount
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('[LOCATION] Permission nicht gewährt, nutze Berlin als Fallback');
          setUserLocation(BERLIN_COORDS);
          return;
        }

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
            distanceInterval: 50,
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
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const playFlightSound = () => {
    try {
      flightPlayer.seekTo(0);
      flightPlayer.play();
    } catch (error) {
      console.error('[SOUND] Fehler beim Abspielen:', error);
    }
  };

  const handleLocatePress = () => {
    if (cameraRef.current && userLocation) {
      playFlightSound();
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  const searchCity = async (cityName: string) => {
    if (!cityName.trim()) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        
        if (cameraRef.current) {
          playFlightSound();
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 12,
            animationDuration: 1500,
          });
        }
        
        Keyboard.dismiss();
      }
    } catch (error) {
      console.error('[SEARCH] Fehler:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Fullscreen Map */}
      <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/light-v11"
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
          animationMode="easeTo"
          animationDuration={1000}
        />
        
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          minDisplacement={10}
        />
      </MapboxGL.MapView>

      {/* Logo oben zentriert */}
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0" style={{ zIndex: 10 }}>
        <View className="items-center pt-1 pb-4">
          <Image
            source={require("../../assets/N8T4.png")}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      {/* Filter Button - Oben rechts */}
      <SafeAreaView edges={['top']} className="absolute top-0 right-0" style={{ zIndex: 10 }}>
        <View className="p-5 pt-6">
          <Pressable
            className="w-12 h-12 rounded-2xl justify-center items-center shadow-lg"
            style={{ backgroundColor: theme.colors.neutral.gray[100] }}
            onPress={() => setFilterVisible(true)}
          >
            <AdjustmentsHorizontalIcon
              size={24}
              color={theme.colors.primary.main}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Location Button - Unten links auf der Karte */}
      <View className="absolute bottom-32 left-5" style={{ zIndex: 10 }}>
        <Pressable
          className="w-14 h-14 rounded-full justify-center items-center shadow-xl"
          style={{ backgroundColor: theme.colors.primary.main }}
          onPress={handleLocatePress}
        >
          <MapPinIcon size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Suchleiste am unteren Rand - über Bottom Tab */}
      <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl" style={{ zIndex: 5 }}>
        <View className="px-5 pt-3 pb-1">
          <View className="flex-row items-center bg-gray-100 rounded-full px-5 py-4 shadow-lg space-x-10">
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
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}