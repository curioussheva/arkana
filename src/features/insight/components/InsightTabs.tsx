// src/features/insight/components/InsightTabs.tsx

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Haptics from 'expo-haptics';

import { useThemeStore } from '@store/theme-store';

import {
  FONT_SIZE,
} from '@constants/theme';

import type { InsightTab } from '../types';

interface InsightTabsProps {
  value: InsightTab;
  onChange(tab: InsightTab): void;
}

export function InsightTabs({
  value,
  onChange,
}: InsightTabsProps) {
  const colors = useThemeStore(state => state.getColors());

  const handlePress = (tab: InsightTab) => {
    if (tab === value) return;

    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    onChange(tab);
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          height: 52,

          backgroundColor: colors.surface,

          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },

        tab: {
          flex: 1,

          justifyContent: 'center',
          alignItems: 'center',
        },

        activeTab: {
          borderBottomWidth: 3,
          borderBottomColor: colors.primary,
        },

        label: {
          fontSize: FONT_SIZE.sm,
          fontWeight: '500',
          color: colors.textMuted,
        },

        activeLabel: {
          color: colors.primary,
          fontWeight: '700',
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress('blueprint')}
        style={[
          styles.tab,
          value === 'blueprint' &&
            styles.activeTab,
        ]}
      >
        <Text
          style={[
            styles.label,
            value === 'blueprint' &&
              styles.activeLabel,
          ]}
        >
          Blueprint
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  activeOpacity={0.8}
  onPress={() => handlePress('energy')}
  style={[styles.tab, value === 'energy' && styles.activeTab]}
>
  <Text style={[styles.label, value === 'energy' && styles.activeLabel]}>
    Energi
  </Text>
</TouchableOpacity>

{/* 👇 Tambahkan blok ini */}
<TouchableOpacity
  activeOpacity={0.8}
  onPress={() => handlePress('evolution')}
  style={[styles.tab, value === 'evolution' && styles.activeTab]}
>
  <Text style={[styles.label, value === 'evolution' && styles.activeLabel]}>
    Evolusi
  </Text>
</TouchableOpacity>
    </View>
  );
}

export default InsightTabs;