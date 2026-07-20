// Berkas: src/features/insight/components/features/TotemSanctuarySection.tsx

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '@constants/theme';

interface TotemData {
  key: string;
  icon: string;
  name: string;
  element: string;
  zodiac: string;
  color: string;
  trait: string;
  advice: string;
  pointsCount: number;
  pointsLabels: string[]; // Contoh format dari parent: ["A (Hari Lahir) - Arcana 10", "B (Masa Lalu) - Arcana 3"]
}

interface Props {
  totemAlliance: TotemData[];
}

export function TotemSanctuarySection({ totemAlliance }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const [selectedTotem, setSelectedTotem] = useState<string | null>(null);

  const activeTotemInfo = totemAlliance.find(t => t.key === selectedTotem);

  // 🌀 ENGINE CROSS-BUFF: Hitung apakah ada manifestasi Roda Takdir (Arcana 10) di dalam aliansi totem ini
  const resonanceAnalysis = useMemo(() => {
    if (!activeTotemInfo) return null;

    // Deteksi string "Arcana 10" atau "10" dari label titik terikat
    const wheelPoints = activeTotemInfo.pointsLabels.filter(label => 
      label.includes('Arcana 10') || label.includes(' 10')
    );

    const hasWheelOfFortune = wheelPoints.length > 0;
    
    // Jika ada Arkana 10 menduduki elemen totem ini, berikan lonjakan energi +35% per titik
    const basePower = activeTotemInfo.pointsCount * 10;
    const buffPercentage = wheelPoints.length * 35;
    const totalPower = hasWheelOfFortune ? Math.round(basePower * (1 + buffPercentage / 100)) : basePower;

    return {
      hasWheelOfFortune,
      wheelPoints,
      buffPercentage,
      totalPower,
    };
  }, [activeTotemInfo]);

  return (
    <Animated.View layout={LinearTransition.springify()} style={styles.container}>
      <View style={[styles.headerWrapper, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>🦅 Puncak Integrasi: Aliansi 4 Totem</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manifestasi pilar tertinggi Arkana #21 (The World) dalam gerbang 20 koordinat jiwamu.
        </Text>
      </View>

      {/* Grid 4 Totem Penjaga */}
      <View style={styles.grid}>
        {totemAlliance.map((totem, index) => {
          const isSelected = selectedTotem === totem.key;
          
          // Deteksi awal di level grid untuk menyalakan indikator sinyal berkedip/pulsing lembut
          const isResonatingWithWheel = totem.pointsLabels.some(l => l.includes('Arcana 10') || l.includes(' 10'));

          return (
            <Animated.View
              entering={FadeInDown.delay(index * 75).duration(400)}
              key={totem.key}
              style={[
                styles.card,
                { 
                  borderColor: isSelected ? totem.color : isResonatingWithWheel ? '#ffd700' : totem.color + '30', 
                  backgroundColor: isSelected ? totem.color + '12' : colors.surface,
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => setSelectedTotem(prev => prev === totem.key ? null : totem.key)}
                activeOpacity={0.7}
                style={styles.clickableArea}
              >
                {isResonatingWithWheel && (
                  <View style={styles.miniPulseBadge}>
                    <Text style={styles.miniPulseText}>🌀 SINKRON</Text>
                  </View>
                )}
                <Text style={styles.icon}>{totem.icon}</Text>
                <Text style={[styles.totemName, { color: colors.text }]}>{totem.name}</Text>
                <Text style={[styles.zodiacText, { color: colors.textMuted }]}>⚖️ {totem.zodiac}</Text>
                
                <View style={[styles.badge, { backgroundColor: totem.color + '20' }]}>
                  <Text style={[styles.badgeText, { color: totem.color }]}>
                    {totem.pointsCount} Titik Energi
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Panel Detail Ekspansi Batin Interaktif + Analisis Resonansi */}
      {activeTotemInfo && (
        <Animated.View 
          entering={FadeInDown.duration(250)} 
          style={[styles.detailBox, { backgroundColor: colors.surface, borderColor: activeTotemInfo.color }]}
        >
          <View style={styles.detailHeader}>
            <Text style={[styles.detailTitle, { color: colors.text }]}>
              {activeTotemInfo.icon} Penjaga {activeTotemInfo.name} ({activeTotemInfo.element})
            </Text>
            <Text style={[styles.detailZodiac, { color: activeTotemInfo.color }]}>{activeTotemInfo.zodiac}</Text>
          </View>

          {/* ─── BANNER RESONANSI ARTIFAK (CROSS-BUFF ENGINE) ─── */}
          {resonanceAnalysis?.hasWheelOfFortune && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.resonanceBanner}>
              <Text style={styles.resonanceIcon}>🌀</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.resonanceTitle}>Resonansi Roda Takdir Aktif!</Text>
                <Text style={styles.resonanceBody}>
                  Arkana #10 menduduki pilar ini. Energi transisi berputar lebih cepat, memicu lonjakan kapasitas batin sebesar <Text style={{ fontWeight: '800' }}>+{resonanceAnalysis.buffPercentage}%</Text>.
                </Text>
              </View>
            </Animated.View>
          )}
          
          <Text style={[styles.detailTrait, { color: colors.text }]}>
            <Text style={{ fontWeight: '700', color: colors.primary }}>Arketipe Gerbang: </Text>
            {activeTotemInfo.trait}
          </Text>

          <Text style={[styles.detailAdvice, { color: colors.textSecondary }]}>
            <Text style={{ fontWeight: '700', color: colors.primary }}>Pesan Penyelaras: </Text>
            {activeTotemInfo.advice}
          </Text>

          {/* Render Chips Titik Terikat */}
          {activeTotemInfo.pointsLabels?.length > 0 && (
            <View style={styles.pointsChipContainer}>
              <Text style={[styles.chipTitle, { color: colors.textMuted }]}>Titik Jangkar Terikat:</Text>
              <View style={styles.chipsWrapper}>
                {activeTotemInfo.pointsLabels.map(label => {
                  const isWheelPoint = label.includes('Arcana 10') || label.includes(' 10');
                  return (
                    <View 
                      key={label} 
                      style={[
                        styles.pointChip, 
                        { 
                          backgroundColor: isWheelPoint ? '#ffd70018' : colors.backgroundLight, 
                          borderColor: isWheelPoint ? '#ffd700' : colors.border 
                        }
                      ]}
                    >
                      <Text style={[styles.chipText, { color: isWheelPoint ? '#b69100' : colors.text }]}>
                        {isWheelPoint ? `🔮 ${label} (Amplified)` : label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.xl, paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },
  headerWrapper: { paddingBottom: SPACING.sm, borderBottomWidth: 0.5, marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  subtitle: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  card: { flex: 1, minWidth: '45%', borderRadius: BORDER_RADIUS.xl, borderWidth: 1, ...SHADOWS.sm, overflow: 'hidden', position: 'relative' },
  clickableArea: { padding: SPACING.md, alignItems: 'center', width: '100%' },
  icon: { fontSize: 36, marginBottom: 2 },
  totemName: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  zodiacText: { fontSize: 10, marginVertical: 4, fontWeight: '500' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, marginTop: 4 },
  badgeText: { fontSize: 10, fontWeight: '800' },

  miniPulseBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#ffd70030', borderColor: '#ffd700', borderWidth: 0.5, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  miniPulseText: { fontSize: 8, fontWeight: '900', color: '#b69100' },

  detailBox: { marginTop: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, borderLeftWidth: 5, ...SHADOWS.sm },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  detailTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  detailZodiac: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  detailTrait: { fontSize: FONT_SIZE.sm, lineHeight: 20, marginBottom: 6 },
  detailAdvice: { fontSize: FONT_SIZE.sm, lineHeight: 20, marginBottom: 4 },
  
  resonanceBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffd70012', borderColor: '#ffd70040', borderWidth: 1, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, gap: SPACING.sm, marginBottom: SPACING.md },
  resonanceIcon: { fontSize: 24 },
  resonanceTitle: { fontSize: 12, fontWeight: '800', color: '#b69100' },
  resonanceBody: { fontSize: 11, color: '#555', lineHeight: 15, marginTop: 1 },

  pointsChipContainer: { marginTop: SPACING.sm, borderTopWidth: 0.5, borderTopColor: '#e5e7eb40', paddingTop: SPACING.sm },
  chipTitle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pointChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, borderWidth: 0.5 },
  chipText: { fontSize: 10, fontWeight: '700' }
});
 