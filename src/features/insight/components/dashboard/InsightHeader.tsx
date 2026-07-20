// src/features/insight/components/InsightHeader.tsx

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useThemeStore } from '@store/theme-store';

import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '@constants/theme';

interface InsightHeaderProps {
  profileName: string;
}

export function InsightHeader({
  profileName,
}: InsightHeaderProps) {
  const colors = useThemeStore(state => state.getColors());

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: SPACING.xl,
          paddingVertical: SPACING.xl,
          paddingTop: SPACING.xxl,

          borderBottomLeftRadius:
            BORDER_RADIUS['3xl'],

          borderBottomRightRadius:
            BORDER_RADIUS['3xl'],
        },

        badge: {
          alignSelf: 'flex-start',

          backgroundColor:
            'rgba(255,255,255,0.18)',

          paddingHorizontal: SPACING.md,
          paddingVertical: 6,

          borderRadius:
            BORDER_RADIUS.full,

          marginBottom: SPACING.md,
        },

        badgeText: {
          color: '#FFFFFF',
          fontWeight: '700',
          fontSize: FONT_SIZE.xs,
          letterSpacing: 1,
        },

        title: {
          color: '#FFFFFF',

          fontSize: FONT_SIZE['3xl'],
          fontWeight: '800',

          marginBottom: SPACING.sm,
        },

        subtitle: {
          color: 'rgba(255,255,255,0.92)',

          fontSize: FONT_SIZE.md,

          lineHeight: 24,
        },

        profile: {
          fontWeight: '700',
        },
      }),
    [colors.primary],
  );

  return (
    <LinearGradient
      colors={colors.gradients.headerGradient}
      style={styles.container}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          DESTINY MATRIX
        </Text>
      </View>

      <Text style={styles.title}>
        🔮 Spiritual Insight
      </Text>

      <Text style={styles.subtitle}>
        Blueprint energi dan perjalanan jiwa untuk{' '}
        <Text style={styles.profile}>
          {profileName}
        </Text>
      </Text>
    </LinearGradient>
  );
}

export default InsightHeader;