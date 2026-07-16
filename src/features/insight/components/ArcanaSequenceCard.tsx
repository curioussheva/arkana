import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ArcanaWheel } from '@components/charts/ArcanaWheel';

import type { ArcanaDefinition } from '@core/arcana';

import { useThemeStore } from '@store/theme-store';

import {
  FONT_SIZE,
  SPACING,
} from '@constants/theme';

import { InsightCard } from './InsightCard';

interface Props {
  sequence: ArcanaDefinition[];
}

export function ArcanaSequenceCard({
  sequence,
}: Props) {
  const colors = useThemeStore(
    state => state.getColors(),
  );

  if (sequence.length === 0) {
    return null;
  }

  return (
    <InsightCard
      icon="🎡"
      title="Roda Takdir"
    >
      <View style={styles.wheelContainer}>
        <ArcanaWheel
          arcanaSequence={sequence}
        />
      </View>

      <Text
        style={[
          styles.description,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Delapan Arcana utama membentuk pola
        perjalanan jiwa, menunjukkan bagaimana
        energi berkembang dari karakter,
        pengalaman, hingga tujuan spiritual.
      </Text>
    </InsightCard>
  );
}

const styles = StyleSheet.create({
  wheelContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  description: {
    textAlign: 'center',
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
  },
});

export default ArcanaSequenceCard;