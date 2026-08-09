// src/features/destiny-matrix/components/DestinyLevelsList.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import type { DestinyMatrix } from '@core/destiny-matrix/types';

interface DestinyLevelsListProps {
  matrix: DestinyMatrix;
}

// Nama tampilan bahasa Indonesia + istilah resmi (bahasa Inggris) hasil
// cross-check terhadap kalkulator resmi matricaladini.ru — lihat
// point-registry.ts untuk deskripsi formula masing-masing.
const LEVEL_ROWS: Array<{
  key: keyof DestinyMatrix['destinies'];
  labelId: string;
  labelEn: string;
}> = [
  { key: 'heaven', labelId: 'Takdir Surgawi', labelEn: 'Heaven' },
  { key: 'earth', labelId: 'Takdir Duniawi', labelEn: 'Earth' },
  { key: 'personal', labelId: 'Takdir Personal Integral', labelEn: 'Personal purpose' },
  { key: 'fatherLine', labelId: 'Garis Ayah', labelEn: "Father's line" },
  { key: 'motherLine', labelId: 'Garis Ibu', labelEn: "Mother's line" },
  { key: 'social', labelId: 'Takdir Sosial / Keluarga', labelEn: 'Family destiny' },
  { key: 'spiritual', labelId: 'Takdir Ilahi Pribadi', labelEn: 'Spiritual Purpose' },
  { key: 'globalMission', labelId: 'Misi Ilahi Global', labelEn: 'Planetary destiny' },
];

const POWER_CENTER_ROWS: Array<{ key: keyof DestinyMatrix['destinies']; labelId: string }> = [
  { key: 'personalCenter', labelId: 'Pusat Kekuatan Pribadi' },
  { key: 'familyCenter', labelId: 'Pusat Kekuatan Keluarga' },
  { key: 'unifiedCenter', labelId: 'Pusat Kekuatan Gabungan' },
];

export function DestinyLevelsList({ matrix }: DestinyLevelsListProps) {
  // Theme-aware — sebelumnya hardcode #FFFFFF/#1E293B dkk, bikin kartu
  // putih nyeruak di dark mode (bug yang sama seperti LegendItem dulu).
  const colors = useThemeStore(state => state.getColors());

  const destinies = matrix.destinies;
  if (!destinies) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>8 Level Takdir</Text>

      {LEVEL_ROWS.map((row, idx) => (
        <View key={row.key} style={[styles.row, { borderBottomColor: colors.border + '30' }]}>
          <View style={[styles.levelBadge, { backgroundColor: colors.border + '30' }]}>
            <Text style={[styles.levelBadgeText, { color: colors.textMuted }]}>{idx + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.labelId, { color: colors.text }]}>{row.labelId}</Text>
            <Text style={[styles.labelEn, { color: colors.textMuted }]}>{row.labelEn}</Text>
          </View>
          <Text style={[styles.value, { color: colors.primary }]}>{destinies[row.key]}</Text>
        </View>
      ))}

      <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>3 Pusat Kekuatan</Text>
      {POWER_CENTER_ROWS.map(row => (
        <View key={row.key} style={[styles.row, { borderBottomColor: colors.border + '30' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.labelId, { color: colors.text }]}>{row.labelId}</Text>
          </View>
          <Text style={[styles.value, { color: colors.primary }]}>{destinies[row.key]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
  },
  levelBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadgeText: { fontSize: 11, fontWeight: '700' },
  labelId: { fontSize: 13, fontWeight: '700' },
  labelEn: { fontSize: 10, fontStyle: 'italic' },
  value: { fontSize: 16, fontWeight: '800', minWidth: 32, textAlign: 'right' },
});
