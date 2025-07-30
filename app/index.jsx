import { Link, Stack, useNavigation } from 'expo-router';
import { Text, View } from 'react-native';
import { useEffect } from 'react';

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Link href={'/profile'}>Profile</Link>
      <Link href={'/edit-profile'}>Edit Profile</Link>
      <Link href={'/login'}>Login</Link>
    </View>
  );
}