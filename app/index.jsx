import { StyleSheet, View } from "react-native";
import { useIntro } from '../components/IntroContext';
import React, { useEffect, useRef } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import 'react-native-url-polyfill/auto';

export default function LogoScreen() {
  const audioplayer1 = useAudioPlayer(require("../assets/Introsound.mp3"));
  const { setIntroCompleted } = useIntro();
  const hasNavigatedRef = useRef(false);
  
  const handleNavigation = () => {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      console.log('[INTRO] Setting introCompleted to true');
      setIntroCompleted(true);
      console.log('[INTRO] Navigating to login');
      router.replace("/login");
    }
  };

  const player = useVideoPlayer(require("../assets/N8T.mp4"), (p) => {
    p.muted = false;
    p.play();
    audioplayer1.play?.();
    
    // Video-Ende-Events
    p.addListener('playingChange', (isPlaying) => {
      console.log('[INTRO] Playing state changed:', isPlaying);
      if (!isPlaying && p.currentTime > 0 && Math.abs(p.currentTime - p.duration) < 0.5) {
        console.log('[INTRO] Video ended via playingChange');
        handleNavigation();
      }
    });

    p.addListener('statusChange', (status) => {
      console.log('[INTRO] Status changed:', status.status);
      if (status.status === 'idle' && p.currentTime > 0) {
        console.log('[INTRO] Video ended via statusChange');
        handleNavigation();
      }
    });
  });

  // Fallback-Timer als Sicherheit
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      console.log('[INTRO] Fallback timer triggered');
      handleNavigation();
    }, 5000); // 5 Sekunden Fallback

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  video: {
    width: 300,
    height: 300,
  },
});
