// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@navigation/AppNavigator';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { getDatabase } from '@db/index';
import { SplashScreen as CustomSplash } from '@components/SplashScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await getDatabase();
        console.log('[App] Database initialized');
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Untuk sementara selalu tampilkan onboarding
        setShowOnboarding(true);
      } catch (e) {
        console.warn('[App] Initialization error:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <CustomSplash />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <ErrorBoundary>
              {showOnboarding ? (
                <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
              ) : (
                <AppNavigator />
              )}
            </ErrorBoundary>
            <StatusBar style="light" />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
}); 