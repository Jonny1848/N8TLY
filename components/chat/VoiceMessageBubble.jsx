/**
 * VoiceMessageBubble – Wiedergabe einer Sprachnachricht in einer Chat-Bubble
 *
 * Zeigt einen Play/Pause-Button, einen Fortschrittsbalken und die Dauer an.
 * Muss als eigene Komponente existieren, da Hooks (useAudioPlayer)
 * nicht innerhalb von renderItem einer FlatList genutzt werden koennen.
 *
 * Props:
 *  - mediaUrl: URL der Audio-Datei (aus Supabase Storage)
 *  - isOwn: Boolean – ob die Nachricht vom aktuellen User stammt (fuer Farbgebung)
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { PlayIcon, PauseIcon } from 'react-native-heroicons/solid';
import { theme } from '../../constants/theme';

export default function VoiceMessageBubble({ mediaUrl, isOwn }) {
  // Audio-Player fuer diese spezifische Sprachnachricht
  const player = useAudioPlayer(mediaUrl);
  const status = useAudioPlayerStatus(player);

  /** Play/Pause umschalten */
  const togglePlayback = () => {
    if (status.playing) {
      player.pause();
    } else {
      // Wenn am Ende: Zurueckspulen und abspielen
      if (status.currentTime >= status.duration && status.duration > 0) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  /** Dauer formatieren (mm:ss) */
  const formatDuration = (seconds) => {
    const s = Math.round(seconds || 0);
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Fortschritt als Prozentsatz (0–1)
  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;

  return (
    <View style={styles.container}>
      {/* Play/Pause Button */}
      <Pressable onPress={togglePlayback} style={styles.playBtn}>
        {status.playing ? (
          <PauseIcon size={16} color={isOwn ? '#FFFFFF' : theme.colors.primary.main} />
        ) : (
          <PlayIcon size={16} color={isOwn ? '#FFFFFF' : theme.colors.primary.main} />
        )}
      </Pressable>

      {/* Fortschrittsbalken + Dauer */}
      <View style={styles.progressArea}>
        {/* Hintergrund-Track */}
        <View style={[styles.track, {
          backgroundColor: isOwn ? 'rgba(255,255,255,0.3)' : theme.colors.neutral.gray[200],
        }]}>
          {/* Gefuellter Fortschritt */}
          <View style={[styles.trackFill, {
            width: `${progress * 100}%`,
            backgroundColor: isOwn ? '#FFFFFF' : theme.colors.primary.main,
          }]} />
        </View>
        {/* Zeitanzeige: Aktuelle Position oder Gesamtdauer */}
        <Text style={[styles.duration, {
          color: isOwn ? 'rgba(255,255,255,0.7)' : theme.colors.neutral.gray[500],
        }]}>
          {status.playing || status.currentTime > 0
            ? formatDuration(status.currentTime)
            : formatDuration(status.duration)}
        </Text>
      </View>
    </View>
  );
}

// ============================
// Styles
// ============================
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 180,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  progressArea: {
    flex: 1,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  duration: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
  },
});
