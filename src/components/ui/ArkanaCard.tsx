import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { ArkanaInfo } from '@core/numerology/types';

interface Props {
  arkana: ArkanaInfo;
}

const ELEMENT_COLORS = {
  Fire: COLORS.fire,
  Water: COLORS.water,
  Air: COLORS.air,
  Earth: COLORS.earth,
};

export function ArkanaCard({ arkana }: Props) {
  return (
    <View style={[styles.card, { borderColor: ELEMENT_COLORS[arkana.element] }]}>
      <View style={styles.header}>
        <Text style={styles.number}>#{arkana.number}</Text>
        <View style={[styles.elementBadge, { backgroundColor: ELEMENT_COLORS[arkana.element] + '30' }]}>
          <Text style={[styles.elementText, { color: ELEMENT_COLORS[arkana.element] }]}>
            {arkana.element}
          </Text>
        </View>
      </View>
      
      <Text style={styles.name}>{arkana.card}</Text>
      
      <View style={styles.keywords}>
        {arkana.keywords.map((keyword, i) => (
          <View key={i} style={styles.keywordBadge}>
            <Text style={styles.keywordText}>{keyword}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.meaning}>{arkana.uprightMeaning}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    ...SHADOWS.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  number: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, fontWeight: '600' },
  elementBadge: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  elementText: { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  name: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm },
  keywords: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  keywordBadge: { backgroundColor: COLORS.backgroundLight, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.md },
  keywordText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  meaning: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, lineHeight: 22 },
});
