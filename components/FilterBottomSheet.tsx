import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { theme } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Event Types aus Onboarding
const EVENT_TYPES = [
  { id: 'clubs', name: 'Clubs', emoji: '🪩' },
  { id: 'bars', name: 'Bars', emoji: '🍸' },
  { id: 'festivals', name: 'Festivals', emoji: '🎪' },
  { id: 'concerts', name: 'Konzerte', emoji: '🎤' },
  { id: 'raves', name: 'Raves', emoji: '🌈' },
  { id: 'beach_party', name: 'Beach Party', emoji: '🏖️' },
  { id: 'rooftop', name: 'Rooftop', emoji: '🏙️' },
  { id: 'underground', name: 'Underground', emoji: '🕳️' },
  { id: 'open_air', name: 'Open Air', emoji: '🌳' },
  { id: 'house_party', name: 'House Party', emoji: '🏠' },
  { id: 'boat_party', name: 'Boat Party', emoji: '⛵' },
  { id: 'warehouse', name: 'Warehouse', emoji: '🏭' },
];

// Music Genres aus Onboarding
const MUSIC_GENRES = [
  { id: 'techno', name: 'Techno', emoji: '🎧' },
  { id: 'house', name: 'House', emoji: '🏠' },
  { id: 'hiphop', name: 'Hip-Hop', emoji: '🎤' },
  { id: 'rnb', name: 'R&B', emoji: '🎵' },
  { id: 'pop', name: 'Pop', emoji: '🎶' },
  { id: 'rock', name: 'Rock', emoji: '🎸' },
  { id: 'indie', name: 'Indie', emoji: '🎹' },
  { id: 'edm', name: 'EDM', emoji: '💥' },
  { id: 'trap', name: 'Trap', emoji: '🔥' },
  { id: 'dnb', name: 'Drum & Bass', emoji: '⚡' },
  { id: 'trance', name: 'Trance', emoji: '🌌' },
  { id: 'reggaeton', name: 'Reggaeton', emoji: '🌴' },
  { id: 'afrobeats', name: 'Afrobeats', emoji: '🌍' },
  { id: 'schlager', name: 'Schlager', emoji: '🍺' },
  { id: 'latin', name: 'Latin', emoji: '💃' },
  { id: 'jazz', name: 'Jazz', emoji: '🎺' },
];

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply?: () => void;
  onReset?: () => void;
}

export function FilterBottomSheet({ visible, onClose, onApply, onReset }: FilterBottomSheetProps) {
  const [radius, setRadius] = useState(10);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedMusicGenres, setSelectedMusicGenres] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);

  React.useEffect(() => {
    if (visible && !isClosing) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [visible, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    translateY.value = withTiming(SCREEN_HEIGHT, {
      duration: 300,
    });
    
    // Warte bis Animation fertig ist
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 320);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const toggleEventType = (typeId: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    );
  };

  const toggleMusicGenre = (genreId: string) => {
    setSelectedMusicGenres(prev =>
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    );
  };

  const handleReset = () => {
    setRadius(10);
    setSelectedEventTypes([]);
    setSelectedMusicGenres([]);
    onReset?.();
  };

  const handleApply = () => {
    console.log('Filter angewendet:', {
      radius,
      eventTypes: selectedEventTypes,
      musicGenres: selectedMusicGenres,
    });
    onApply?.();
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <View style={{ flex: 1 }} />
      </Pressable>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomSheet, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
          <Text style={styles.title}>Filters</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Radius Slider */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Radius</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Slider
                    style={styles.slider}
                    minimumValue={5}
                    maximumValue={50}
                    step={5}
                    value={radius}
                    onValueChange={setRadius}
                    minimumTrackTintColor={theme.colors.primary.main}
                    maximumTrackTintColor={theme.colors.neutral.gray[300]}
                    thumbTintColor={theme.colors.primary.main}
                  />
                </View>
                <View style={styles.radiusLabels}>
                  <Text style={styles.radiusLabelLeft}>5 km</Text>
                  <Text style={styles.radiusValue}>{radius} km</Text>
                  <Text style={styles.radiusLabelRight}>50 km</Text>
                </View>
              </View>
            </View>

            {/* Event Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Event Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {EVENT_TYPES.map((type) => {
                  const isSelected = selectedEventTypes.includes(type.id);
                  return (
                    <Pressable
                      key={type.id}
                      onPress={() => toggleEventType(type.id)}
                      style={[
                        styles.card,
                        isSelected && styles.cardSelected,
                      ]}
                    >
                      <Text style={styles.cardEmoji}>{type.emoji}</Text>
                      <Text
                        style={[
                          styles.cardText,
                          isSelected && styles.cardTextSelected,
                        ]}
                      >
                        {type.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Music Genres */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Music Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {MUSIC_GENRES.map((genre) => {
                  const isSelected = selectedMusicGenres.includes(genre.id);
                  return (
                    <Pressable
                      key={genre.id}
                      onPress={() => toggleMusicGenre(genre.id)}
                      style={[
                        styles.card,
                        isSelected && styles.cardSelected,
                      ]}
                    >
                      <Text style={styles.cardEmoji}>{genre.emoji}</Text>
                      <Text
                        style={[
                          styles.cardText,
                          isSelected && styles.cardTextSelected,
                        ]}
                      >
                        {genre.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

          {/* Bottom spacing */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Footer Buttons */}
        <SafeAreaView edges={['bottom']} style={styles.footerSafeArea}>
          <View style={styles.footer}>
            <Pressable onPress={handleReset} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable onPress={handleApply} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  footerSafeArea: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray[100],
  },
  closeButton: {
    paddingVertical: 4,
    width: 60,
  },
  closeText: {
    fontSize: 16,
    color: theme.colors.neutral.gray[700],
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.neutral.gray[900],
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.neutral.gray[900],
    marginBottom: 16,
  },
  sliderContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  sliderWrapper: {
    width: '100%',
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  radiusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  radiusLabelLeft: {
    fontSize: 12,
    color: theme.colors.neutral.gray[500],
  },
  radiusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  radiusLabelRight: {
    fontSize: 12,
    color: theme.colors.neutral.gray[500],
  },
  horizontalScrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  card: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  cardSelected: {
    backgroundColor: theme.colors.primary.main,
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.neutral.gray[700],
    textAlign: 'center',
  },
  cardTextSelected: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray[100],
    backgroundColor: 'white',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray[300],
    alignItems: 'center',
    backgroundColor: 'white',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.neutral.gray[700],
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});