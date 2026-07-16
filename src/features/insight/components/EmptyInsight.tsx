import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { useThemeStore } from '@store/theme-store';

import {
  SPACING,
  FONT_SIZE,
} from '@constants/theme';

export function EmptyInsight() {
  const colors = useThemeStore(state => state.getColors());

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Animated.View
        entering={FadeInDown.duration(700)}
      >
        <Text style={styles.icon}>🔮</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(150).duration(700)}
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Belum Ada Insight
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Hitung Destiny Matrix terlebih dahulu
          {'\n'}
          untuk membuka analisis spiritual,
          energi, chakra, serta blueprint
          perjalanan jiwamu.
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
    padding: SPACING.xl,
  },

  icon: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },

  description: {
    textAlign: 'center',
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
    maxWidth: 320,
  },
});