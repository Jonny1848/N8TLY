import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    console.log('[AUTH] OAuth Callback Screen mounted');
    
    // Die Session wird automatisch von _layout.tsx gehandhabt
    // durch onAuthStateChange Listener
    const timer = setTimeout(() => {
      console.log('[AUTH] Redirecting from callback');
      router.replace('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View 
      style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.neutral.white
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
      <Text 
        style={{ 
          marginTop: 16,
          color: theme.colors.neutral.gray[700],
          fontSize: 16
        }}
      >
        Anmeldung wird verarbeitet...
      </Text>
    </View>
  );
}