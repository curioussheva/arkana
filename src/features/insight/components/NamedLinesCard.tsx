// src/features/insight-analytics/components/NamedLinesCard.tsx

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemeStore } from '@store/theme-store';

import type { NamedLines } from '@core/destiny-matrix';

import {
  BORDER_RADIUS,
  FONT_SIZE,
  SPACING,
} from '@constants/theme';

import { InsightCard } from './InsightCard';

interface Props {
  lines: NamedLines;
}

export function NamedLinesCard({
  lines,
}: Props) {
  const colors =
    useThemeStore(state => state.getColors());

  return (
    <InsightCard
      icon="🔗"
      title="Garis Energi Kehidupan"
    >
      {/* LOVE LINE */}

      <View
        style={[
          styles.block,
          {
            borderColor: colors.border,
            backgroundColor:
              colors.backgroundLight + '60',
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: '#ec4899',
            },
          ]}
        >
          💖 Love Line
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {lines.loveLine.meaning}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: colors.primary,
            },
          ]}
        >
          Pelajaran Jiwa
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: colors.text,
            },
          ]}
        >
          {lines.loveLine.keyLesson}
        </Text>
      </View>

      {/* MONEY LINE */}

      <View
        style={[
          styles.block,
          {
            borderColor: colors.border,
            backgroundColor:
              colors.backgroundLight + '60',
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: '#f59e0b',
            },
          ]}
        >
          💰 Money Line
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {lines.moneyLine.meaning}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: colors.primary,
            },
          ]}
        >
          Saran Pengembangan
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: colors.text,
            },
          ]}
        >
          {lines.moneyLine.advice}
        </Text>
      </View>
    </InsightCard>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },

  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: 4,
  },

  text: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
  },
});

export default NamedLinesCard;