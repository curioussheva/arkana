// src/components/charts/DestinyDiamond/components/LegendItem.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface LegendItemProps {
  color: string;
  label: string;
  isHighlighted: boolean;
  onPress: () => void;
  textMuted: string;
  goldPrimary: string;
  goldGlow: string;
  // Ditambahkan supaya pill legend ikut tema (bukan hardcode gelap
  // permanen) — akar masalah kontras jelek di mode terang.
  pillBackground: string;
  pillBorder: string;
  textOnPill: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({
  color,
  label,
  isHighlighted,
  onPress,
  textMuted,
  goldPrimary,
  goldGlow,
  pillBackground,
  pillBorder,
  textOnPill,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.item,
        { backgroundColor: pillBackground, borderColor: pillBorder },
        isHighlighted && {
          backgroundColor: goldGlow,
          borderColor: goldPrimary,
        },
      ]}
    >
      <View style={[styles.dotBorder, isHighlighted && { borderColor: goldPrimary }]}>
        <View style={[styles.dotInner, { backgroundColor: color }]} />
      </View>
      <Text
        style={[
          styles.text,
          { color: textOnPill },
          isHighlighted && { color: '#FFFFFF', fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 0.8,
  },
  dotBorder: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInner: { width: 5, height: 5, borderRadius: 2.5 },
  text: { fontSize: 10 },
});
