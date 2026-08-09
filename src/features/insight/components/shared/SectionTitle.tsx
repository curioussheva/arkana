// Berkas: src/features/insight/components/SectionTitle.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeStore } from '@store/theme-store';

import { FONT_SIZE, SPACING } from '@constants/theme';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: string;
  centered?: boolean;
}

export function SectionTitle({ title, subtitle, icon, centered = false }: SectionTitleProps) {
  const colors = useThemeStore(state => state.getColors());

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: SPACING.md,
          paddingHorizontal: SPACING.md, // 🎯 Solusi: Jarak aman horizontal agar tidak menempel ke tepi layar
          alignItems: centered ? 'center' : 'flex-start',
          width: '100%',
        },

        row: {
          flexDirection: 'row',
          alignItems: 'center',
        },

        icon: {
          fontSize: 20,
          marginRight: 8,
        },

        title: {
          fontSize: FONT_SIZE.xl,
          fontWeight: '700',
          color: colors.text,
        },

        subtitle: {
          marginTop: 4,
          fontSize: FONT_SIZE.sm,
          color: colors.textSecondary,
          lineHeight: 20,
          textAlign: centered ? 'center' : 'left',
        },
      }),
    [colors, centered]
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {!!icon && <Text style={styles.icon}>{icon}</Text>}

        <Text style={styles.title}>{title}</Text>
      </View>

      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

export default SectionTitle;
