// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔥 BARU
import { AppNavigator } from '@navigation/AppNavigator';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { getDatabase } from '@db/index';
import { SplashScreen as CustomSplash } from '@components/SplashScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';

const ONBOARDING_STORAGE_KEY = '@arkana_has_launched';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Inisialisasi basis data SQLite lokal
        await getDatabase();
        console.log('[App] Database initialized');

        // 2. 🔥 Cek apakah ini peluncuran aplikasi pertama kali (fresh install)
        const hasLaunched = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (hasLaunched === 'true') {
          setShowOnboarding(false); // Sudah pernah onboarding, skip langsung masuk
        } else {
          setShowOnboarding(true);  // Peluncuran perdana, wajib onboarding
        }

        // Penahan waktu kosmetik agar transisi splash smooth
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {
        console.warn('[App] Initialization error:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Callback penanda user menekan tombol selesai di slide onboarding terakhir
  const handleOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true'); // Kunci status di storage
      setShowOnboarding(false); // Alihkan view ke navigasi utama
    } catch (e) {
      console.warn('[App] Gagal menyimpan status onboarding:', e);
      setShowOnboarding(false); // Fallback aman agar user tidak stuck
    }
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
            <ErrorBoundary componentName="RootErrorBoundary">
              {showOnboarding ? (
                <OnboardingScreen onComplete={handleOnboardingComplete} />
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
 