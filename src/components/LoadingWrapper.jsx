import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function LoadingWrapper({ children }) {
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Ensure navigation is ready
    const timeout = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  if (!isNavigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}