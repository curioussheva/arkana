// src/features/insight-analytics/components/YinYangCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useThemeStore } from '@store/theme-store';

import type { YinYangAnalysis } from '@core/destiny-matrix';

import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '@constants/theme';

import { InsightCard } from './InsightCard';

interface Props {
  analysis: YinYangAnalysis;
}

export function YinYangCard({
  analysis,
}: Props) {
  const colors =
    useThemeStore(state => state.getColors());

  const dominantColor =
    analysis.dominant === 'Yang'
      ? '#ef4444'
      : analysis.dominant === 'Yin'
      ? '#3b82f6'
      : '#10b981';

  const description =
    analysis.dominant === 'Balanced'
      ? 'Energi Yin dan Yang berada dalam keseimbangan yang harmonis. Anda mampu menyeimbangkan intuisi dengan tindakan.'
      : analysis.dominant === 'Yang'
      ? 'Energi Yang lebih dominan. Anda cenderung aktif, logis, berorientasi tindakan, dan nyaman memimpin.'
      : 'Energi Yin lebih dominan. Anda intuitif, reflektif, empatik, dan memiliki kedalaman spiritual yang kuat.';

  return (
    <InsightCard
      icon="☯️"
      title="Profil Yin • Yang"
    >
      <Text
        style={[
          styles.archetype,
          {
            color: dominantColor,
          },
        ]}
      >
        {analysis.archetype}
      </Text>

      <View style={styles.barContainer}>
        <View
          style={[
            styles.yinBar,
            {
              width: `${analysis.yinPercentage}%`,
            },
          ]}
        >
          <Text style={styles.barText}>
            Yin {analysis.yinPercentage}%
          </Text>
        </View>

        <View
          style={[
            styles.yangBar,
            {
              width: `${analysis.yangPercentage}%`,
            },
          ]}
        >
          <Text style={styles.barText}>
            Yang {analysis.yangPercentage}%
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.badge,
          {
            backgroundColor:
              dominantColor + '20',
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: dominantColor,
            },
          ]}
        >
          Dominan : {analysis.dominant}
        </Text>
      </View>

      <Text
        style={[
          styles.description,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {description}
      </Text>
    </InsightCard>
  );
}

const styles = StyleSheet.create({
  archetype: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  barContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.md,
    height: 28,
    marginBottom: SPACING.md,
  },

  yinBar: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    paddingLeft: SPACING.sm,
  },

  yangBar: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: SPACING.sm,
  },

  barText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },

  badge: {
    alignSelf: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginBottom: SPACING.md,
  },

  badgeText: {
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },

  description: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default YinYangCard;