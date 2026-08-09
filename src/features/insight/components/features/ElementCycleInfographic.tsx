// Berkas: src/features/insight/components/features/ElementCycleInfographic.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import {
  ELEMENT_BASE_DATA,
  getElementRelation,
  ElementType,
} from '@core/destiny-matrix/utils/element';

interface Props {
  dominant: ElementType;
  secondary?: ElementType;
}

export function ElementCycleInfographic({ dominant, secondary }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const relation = getElementRelation(dominant, secondary);
  const domData = ELEMENT_BASE_DATA[dominant];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>🔄 Infografis Siklus Kosmik</Text>

      {/* Grid 4 Elemen Visual */}
      <View style={styles.grid}>
        {(Object.keys(ELEMENT_BASE_DATA) as ElementType[]).map(el => {
          const item = ELEMENT_BASE_DATA[el];
          const isDominant = el === dominant;
          const isSecondary = el === secondary;

          return (
            <View
              key={el}
              style={[
                styles.elementBadge,
                {
                  backgroundColor: isDominant
                    ? item.color + '25'
                    : isSecondary
                      ? item.color + '15'
                      : colors.backgroundLight,
                  borderColor: isDominant
                    ? item.color
                    : isSecondary
                      ? item.color + '80'
                      : 'transparent',
                  borderWidth: isDominant || isSecondary ? 2 : 1,
                },
              ]}
            >
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              <Text style={[styles.elementName, { color: colors.text }]}>{el}</Text>
              {isDominant && (
                <Text style={[styles.tag, { backgroundColor: item.color }]}>DOMINAN</Text>
              )}
              {isSecondary && (
                <Text style={[styles.tag, { backgroundColor: colors.primary }]}>PENDUKUNG</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Kartu Dinamika Hubungan */}
      {relation && (
        <View style={[styles.relationBox, { backgroundColor: colors.backgroundLight }]}>
          <Text style={[styles.relationTitle, { color: colors.primary }]}>{relation.title}</Text>
          <Text style={[styles.relationDesc, { color: colors.textSecondary }]}>
            {relation.description}
          </Text>
          <Text style={[styles.adviceText, { color: colors.text }]}>💡 {domData.cycleAdvice}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.md, fontWeight: '800', marginBottom: SPACING.md },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  elementBadge: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.xs,
    marginHorizontal: 2,
    borderRadius: BORDER_RADIUS.lg,
  },
  elementName: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  tag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 4,
  },
  relationBox: { padding: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  relationTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800', marginBottom: 4 },
  relationDesc: { fontSize: 12, lineHeight: 18, marginBottom: SPACING.xs },
  adviceText: { fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
});
