
import React, { useContext, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LoadingWrapper from '../src/components/LoadingWrapper';
import { MyContext, MyProvider } from '../src/context/AuthContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import QRProfileScreen from './(auth)/profile';
import EditProfile from './(auth)/edit-profile';
import CustomDrawerContent from '../src/components/CustomDrawerContent';
import LoginScreen from './login';
import { Redirect, Slot, Stack } from 'expo-router';

const Drawer = createDrawerNavigator();

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
    <MyProvider>
      <Slot />
    </MyProvider>
  );
}
