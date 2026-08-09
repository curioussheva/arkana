import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import * as SplashScreenModule from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppNavigator } from '@navigation/AppNavigator';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { getDatabase } from '@db/index';
import { destinyCacheManager } from '@db/destiny-cache-manager';
import { SplashScreen as CustomSplash } from '@components/SplashScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';

import { useThemeStore } from '@store/theme-store';

const ONBOARDING_STORAGE_KEY = '@arkana_has_launched';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

export default function App() {
  const colorScheme = useColorScheme();
  const syncSystemTheme = useThemeStore((state) => state.syncSystemTheme);
  const isDark = useThemeStore((state) => state.isDark);

  const [appIsReady, setAppIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Sinkronisasi tema sistem
  useEffect(() => {
    if (colorScheme) {
      syncSystemTheme(colorScheme);
    }
  }, [colorScheme, syncSystemTheme]);

  // Bootstrapping
  useEffect(() => {
    async function prepare() {
      try {
        await getDatabase();

        // 🔴 Bersihkan cache matrix versi lama (skema stale) sekali di setiap
        // startup. Baris usang juga sudah otomatis terhapus saat query miss
        // di destinyCacheManager, tapi ini jaring pengaman tambahan agar
        // baris lama tidak sempat sama sekali diakses/dibaca.
        destinyCacheManager.cleanupStaleVersions().catch(err => {
          console.warn('[App] Gagal membersihkan cache matrix lama:', err);
        });

        const hasLaunched = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
        setShowOnboarding(hasLaunched !== 'true');
        await new Promise((resolve) => setTimeout(resolve, 600)); // kosmetik
      } catch (e) {
        console.warn('[App] Bootstrapping error:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  // ⭐ Sembunyikan native splash screen begitu data siap
  useEffect(() => {
    if (appIsReady) {
      SplashScreenModule.hideAsync().catch(() => {});
    }
  }, [appIsReady]);

  const handleOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setShowOnboarding(false);
    } catch (e) {
      console.warn('[App] Gagal menyimpan status onboarding:', e);
      setShowOnboarding(false);
    }
  }, []);

  if (!appIsReady) {
    return <CustomSplash />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <ErrorBoundary componentName="RootErrorBoundary">
              {showOnboarding ? (
                <OnboardingScreen onComplete={handleOnboardingComplete} />
              ) : (
                <AppNavigator />
              )}
            </ErrorBoundary>
            <StatusBar style={isDark() ? 'light' : 'dark'} />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
}); 