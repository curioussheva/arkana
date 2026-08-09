// src/features/insight/components/InsightCard.tsx

import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useThemeStore } from '@store/theme-store';

import { BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from '@constants/theme';

interface InsightCardProps {
  title?: string;
  subtitle?: string;
  icon?: string;

  children: React.ReactNode;

  style?: ViewStyle;
}

export function InsightCard({ title, subtitle, icon, children, style }: InsightCardProps) {
  const colors = useThemeStore(state => state.getColors());

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,

          marginHorizontal: SPACING.md,
          marginBottom: SPACING.md,

          padding: SPACING.lg,

          borderRadius: BORDER_RADIUS['2xl'],

          borderWidth: 1,
          borderColor: colors.border,

          ...SHADOWS.lg,
        },

        header: {
          marginBottom: SPACING.md,
        },

        titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },

        icon: {
          fontSize: 20,
          marginRight: 8,
        },

        title: {
          flex: 1,

          color: colors.text,

          fontSize: FONT_SIZE.xl,
          fontWeight: '700',
        },

        subtitle: {
          marginTop: 4,

          color: colors.textSecondary,

          fontSize: FONT_SIZE.sm,
          lineHeight: 20,
        },
      }),
    [colors]
  );

  return (
    <View style={[styles.card, style]}>
      {(title || subtitle) && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {!!icon && <Text style={styles.icon}>{icon}</Text>}

            {!!title && <Text style={styles.title}>{title}</Text>}
          </View>

          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}

      {children}
    </View>
  );
}

export default InsightCard;
