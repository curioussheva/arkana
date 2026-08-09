// src/features/insight-analytics/components/ShareButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import * as Haptics from 'expo-haptics';

import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';

import { useThemeStore } from '@store/theme-store';

interface Props {
  onPress(): void;
}

export function ShareButton({ onPress }: Props) {
  const colors = useThemeStore(s => s.getColors());

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      marginHorizontal: SPACING.md,
      marginTop: SPACING.lg,
      marginBottom: SPACING.xl,

      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,

      borderRadius: BORDER_RADIUS.xl,

      backgroundColor: colors.primary + '15',

      borderWidth: 1,
      borderColor: colors.primary + '35',
    },

    text: {
      color: colors.primary,
      fontSize: FONT_SIZE.md,
      fontWeight: '700',
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.button}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        onPress();
      }}
    >
      <Text style={styles.text}>📤 Bagikan Insight Takdir</Text>
    </TouchableOpacity>
  );
}
