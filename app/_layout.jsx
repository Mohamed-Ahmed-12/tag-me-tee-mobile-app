
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LoadingWrapper from '../src/components/LoadingWrapper';
import { AuthProvider } from '../src/context/AuthContext';
import { Slot } from 'expo-router';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    EthnocentricBold: require('../assets/fonts/Ethnocentric.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
