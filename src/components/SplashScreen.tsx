// src/components/SplashScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ARKANA_ICON } from '@constants/images';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(1200)}>
        <Image 
          source={ARKANA_ICON}
          style={styles.logo}
        />
        <Text style={styles.title}>Arkana</Text>
        <Text style={styles.subtitle}>Ungkap Rahasia Takdirmu</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
  },
}); 