// src/features/insight-analytics/components/ChakraList.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useThemeStore } from '@store/theme-store';

import type { ChakraData } from '@core/destiny-matrix';

import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '@constants/theme';

import { InsightCard } from './InsightCard';

interface Props {
  chakras: ChakraData[];
}

const STATUS_COLOR = {
  Balanced: '#10b981',
  Overactive: '#f59e0b',
  Blocked: '#ef4444',
} as const;

const CHAKRA_ICON: Record<ChakraData['name'], string> = {
  Crown: '👑',
  'Third Eye': '👁️',
  Throat: '🗣️',
  Heart: '💚',
  'Solar Plexus': '☀️',
  Sacral: '🟠',
  Root: '🌍',
};

export function ChakraList({
  chakras,
}: Props) {
  const colors =
    useThemeStore(state => state.getColors());

  return (
    <InsightCard
      icon="🧘"
      title="Analisis 7 Chakra"
    >
      {chakras.map((chakra, index) => {
  const statusColor = STATUS_COLOR[chakra.status || 'Balanced']; // Fallback jika status kosong

  return (
    <View
      key={`chakra-item-${index}-${chakra.name || 'unknown'}`} // 🚀 Kombinasi index menjamin keunikan 100%
      style={[
        styles.item,
        {
          borderColor: colors.border,
        },
      ]}
    > 
            <View style={styles.header}>
              <View style={styles.left}>
                <Text style={styles.icon}>
                  {CHAKRA_ICON[chakra.name]}
                </Text>

                <View>
                  <Text
                    style={[
                      styles.name,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {chakra.name}
                  </Text>

                  <Text
                    style={[
                      styles.values,
                      {
                        color:
                          colors.textMuted,
                      },
                    ]}
                  >
                    Physical {chakra.physicalValue}
                    {' • '}
                    Energy {chakra.energyValue}
                    {' • '}
                    Total {chakra.totalValue}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      statusColor + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: statusColor,
                    },
                  ]}
                >
                  {chakra.status}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.description,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {chakra.description}
            </Text>
          </View>
        );
      })}
    </InsightCard>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  icon: {
    fontSize: 26,
    marginRight: SPACING.md,
  },

  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },

  values: {
    marginTop: 4,
    fontSize: FONT_SIZE.xs,
  },

  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  description: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
  },
});

export default ChakraList;