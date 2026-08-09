import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { ARKANA_ICON } from '@constants/images';
import { FONT_SIZE, SPACING } from '@constants/theme';

export function SplashScreen() {
  const colors = useThemeStore(state => state.getColors());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={ZoomIn.duration(800)} style={styles.logoWrapper}>
        <Image source={ARKANA_ICON} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.textWrapper}>
        <Text style={[styles.title, { color: colors.text }]}>Arkana</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ungkap Rahasia Takdirmu
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  textWrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE['4xl'] || 36,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
