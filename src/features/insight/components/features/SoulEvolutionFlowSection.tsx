// Berkas: src/features/insight/components/features/SoulEvolutionFlowSection.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '@constants/theme';
import type { EvolutionPointsInput } from '@core/destiny-matrix/evolutionEngine';

export type AlignmentLevel = 1 | 2 | 3; // 1: Blocked (Negatif), 2: Aligning (Netral), 3: Flowing (Positif)

interface Props {
  evolutionPoints: EvolutionPointsInput;
  onAlignmentChange?: (level: AlignmentLevel) => void;
  onOpenNarrative?: () => void;
}

export function SoulEvolutionFlowSection({
  evolutionPoints,
  onAlignmentChange,
  onOpenNarrative,
}: Props) {
  const colors = useThemeStore(state => state.getColors());
  const [level, setLevel] = useState<AlignmentLevel>(2);
  const [selectedNodeKey, setSelectedNodeKey] = useState<string>('E');

  const handleLevelSelect = (newLevel: AlignmentLevel) => {
    setLevel(newLevel);
    if (onAlignmentChange) onAlignmentChange(newLevel);
  };

  const steps = [
    { key: 'D', arcana: evolutionPoints.D, name: 'Karma Masa Lalu', color: '#ef4444' },
    { key: 'B', arcana: evolutionPoints.B, name: 'Senjata Mental', color: '#3b82f6' },
    { key: 'A', arcana: evolutionPoints.A, name: 'Ujian Karakter', color: '#f59e0b' },
    { key: 'E', arcana: evolutionPoints.E, name: 'Inti Jiwa', color: '#a855f7' },
    { key: 'C', arcana: evolutionPoints.C, name: 'Puncak Finansial', color: '#22c55e' },
  ];

  const activeNodeData = steps.find(s => s.key === selectedNodeKey);

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      style={[
        styles.cardContainer,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* 1. Header & Quick Interactive Level Switcher */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🌀 Canvas Alur Evolusi Jiwa
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Ketuk node koordinat untuk membedah getaran alur.
          </Text>
        </View>
      </View>

      {/* 2. Interactive Selector State / Dial Level (Tiga Switch Pilihan Kunci) */}
      <View
        style={[
          styles.levelDialContainer,
          { backgroundColor: colors.backgroundLight, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.dialLabel, { color: colors.textMuted }]}>Frekuensi Keselarasan:</Text>
        <View style={styles.dialButtonsRow}>
          <TouchableOpacity
            style={[styles.dialBtn, level === 1 && { backgroundColor: '#ef4444' }]}
            onPress={() => handleLevelSelect(1)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.dialBtnText, { color: level === 1 ? '#FFF' : colors.textSecondary }]}
            >
              🔴 Terhambat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dialBtn, level === 2 && { backgroundColor: '#f59e0b' }]}
            onPress={() => handleLevelSelect(2)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.dialBtnText, { color: level === 2 ? '#FFF' : colors.textSecondary }]}
            >
              🟡 Transisi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dialBtn, level === 3 && { backgroundColor: '#22c55e' }]}
            onPress={() => handleLevelSelect(3)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.dialBtnText, { color: level === 3 ? '#FFF' : colors.textSecondary }]}
            >
              🟢 Mengalir
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Interactive Visual Node Flow Map (Tap Node untuk Highlight) */}
      <View style={styles.flowMapContainer}>
        {steps.map((step, idx) => {
          const isSelected = selectedNodeKey === step.key;
          const displayId = step.arcana?.id === 0 ? 22 : (step.arcana?.id ?? '?');

          // Cek apakah alur terputus berdasarkan frekuensi keselarasan (level)
          const isLocked =
            (level === 1 && (step.key === 'E' || step.key === 'C')) ||
            (level === 2 && step.key === 'C');

          return (
            <React.Fragment key={step.key}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedNodeKey(step.key)}
                style={styles.nodeTouchArea}
              >
                <Animated.View
                  style={[
                    styles.nodeCircle,
                    {
                      borderColor: isSelected
                        ? colors.primary
                        : isLocked
                          ? colors.border
                          : step.color,
                      backgroundColor: isSelected
                        ? colors.primary
                        : isLocked
                          ? colors.backgroundLight
                          : step.color + '20',
                      transform: [{ scale: isSelected ? 1.15 : 1 }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.nodeIdText,
                      { color: isSelected ? '#FFF' : isLocked ? colors.textMuted : colors.text },
                    ]}
                  >
                    #{displayId}
                  </Text>
                </Animated.View>
                <Text
                  style={[
                    styles.nodeKeyLabel,
                    { color: isSelected ? colors.primary : colors.textMuted },
                  ]}
                >
                  {step.key}
                </Text>
              </TouchableOpacity>

              {/* Garis Penghubung Interaktif */}
              {idx < steps.length - 1 && (
                <View
                  style={[
                    styles.flowLine,
                    {
                      backgroundColor:
                        (level === 1 && idx >= 2) || (level === 2 && idx >= 3)
                          ? colors.border + '60'
                          : colors.primary,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* 4. Live Reactive Focus Card (Berubah secara dinamis saat Node diketuk) */}
      {activeNodeData && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          style={[
            styles.reactivePanel,
            { backgroundColor: colors.backgroundLight, borderColor: colors.border },
          ]}
        >
          <View style={styles.panelHeader}>
            <Text style={[styles.panelKeyBadge, { backgroundColor: activeNodeData.color }]}>
              Titik {activeNodeData.key}
            </Text>
            <Text style={[styles.panelTitle, { color: colors.text }]}>{activeNodeData.name}</Text>
          </View>
          <Text style={[styles.panelArcanaName, { color: colors.primary }]}>
            Arcana #{activeNodeData.arcana?.id === 0 ? 22 : activeNodeData.arcana?.id} -{' '}
            {activeNodeData.arcana?.tarotName}
          </Text>
          <Text style={[styles.panelDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {activeNodeData.arcana?.matrixName
              ? `Esensi: ${activeNodeData.arcana.matrixName}. `
              : ''}
            {activeNodeData.arcana?.advice?.[0] ||
              'Gunakan intuisi dan kesadaran murni untuk menyeimbangkan energi ini.'}
          </Text>
        </Animated.View>
      )}

      {/* 5. Minimalist Narrative Trigger */}
      {onOpenNarrative && (
        <TouchableOpacity style={styles.fullNarrativeLink} onPress={onOpenNarrative}>
          <Text style={[styles.fullNarrativeText, { color: colors.primary }]}>
            ✨ Buka Detail Analisis Naratif →
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    ...SHADOWS.sm,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  headerRow: { marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  sectionSubtitle: { fontSize: 11, marginTop: 2 },

  levelDialContainer: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginVertical: SPACING.xs,
  },
  dialLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    marginLeft: 4,
  },
  dialButtonsRow: { flexDirection: 'row', gap: 4 },
  dialBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialBtnText: { fontSize: 10, fontWeight: '800' },

  flowMapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  nodeTouchArea: { alignItems: 'center', zIndex: 2 },
  nodeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeIdText: { fontSize: 11, fontWeight: '800' },
  nodeKeyLabel: { fontSize: 10, fontWeight: '800', marginTop: 4 },
  flowLine: { flex: 1, height: 2, marginTop: -14 },

  reactivePanel: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: 2 },
  panelKeyBadge: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  panelTitle: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  panelArcanaName: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  panelDesc: { fontSize: 11, lineHeight: 16 },

  fullNarrativeLink: { alignSelf: 'center', marginTop: SPACING.sm, paddingVertical: 4 },
  fullNarrativeText: { fontSize: 11, fontWeight: '800' },
});
