// src/screens/CompatibilityScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { getDestinyMatrixEngine } from '@core/destiny-matrix/engine';
import { calculateCompatibility } from '@core/destiny-matrix/compatibility';
import type { CompatibilityResult } from '@core/destiny-matrix/compatibility';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

export function CompatibilityScreen() {
  const colors = useThemeStore(state => state.getColors());
  const currentMatrix = useAppStore(state => state.currentMatrix);

  const [birthDate2, setBirthDate2] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Dinamisasi warna indikator berdasarkan status tema (Dark/Light)
  const LEVEL_COLORS: Record<CompatibilityResult['level'], string> = useMemo(() => ({
    'Sangat Harmonis': '#4ade80',
    'Harmonis': '#22c55e',
    'Cukup': '#fbbf24',
    'Tantangan': '#f97316',
    'Kontras': colors.notification || '#ef4444',
  }), [colors]);

  const handleCalculate = async () => {
    if (!currentMatrix) {
      Alert.alert('Belum Ada Matrix', 'Hitung matrix Anda terlebih dahulu di Beranda.');
      return;
    }
    if (!birthDate2 || birthDate2.length !== 10) {
      Alert.alert('Format Salah', 'Gunakan format DD/MM/YYYY (contoh: 15/03/1995)');
      return;
    }

    setIsCalculating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const engine = getDestinyMatrixEngine();
      const matrix2 = engine.calculate({ birthDate: birthDate2 });
      const compResult = calculateCompatibility(currentMatrix, matrix2);
      setResult(compResult);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Gagal menghitung kecocokan.');
    } finally {
      setIsCalculating(false);
    }
  };

  const clearAll = () => {
    setResult(null);
    setBirthDate2('');
  };

  const shareResult = async () => {
    if (!result) return;
    try {
      await Sharing.shareAsync({
        message: `💑 Hasil Kompatibilitas Destiny Matrix\n\nSkor: ${result.totalScore}%\nLevel: ${result.level}\n\n${result.narrative}`,
        title: 'Compatibility Result',
      });
    } catch {}
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <LinearGradient colors={colors.gradients.headerGradient} style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>💑 Compatibility</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Cek kecocokan energi makrokosmos dengan pasangan
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Input Section */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Tanggal Lahir Pasangan</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundLight, color: colors.text, borderColor: colors.border }]}
            placeholder="DD/MM/YYYY (contoh: 15/03/1995)"
            placeholderTextColor={colors.textMuted}
            value={birthDate2}
            onChangeText={setBirthDate2}
            keyboardType="number-pad"
            maxLength={10}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleCalculate}
            disabled={isCalculating || !birthDate2}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isCalculating ? 'Menghitung Energi...' : '🔥 Hitung Kecocokan'}
            </Text>
          </TouchableOpacity>

          {birthDate2.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
              <Text style={{ color: colors.textMuted, fontWeight: '500' }}>Reset Input</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hasil Analisis Lengkap */}
        {result && (
          <Animated.View entering={FadeInUp.duration(600).springify()} style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.score, { color: colors.primary }]}>{result.totalScore}%</Text>
            <Text style={[styles.level, { color: LEVEL_COLORS[result.level] }]}>
              {result.level}
            </Text>
            
            {/* Tampilan Elemen Dominan Pasangan */}
            <View style={styles.elementRowContainer}>
              <View style={[styles.elementBadge, { backgroundColor: colors.backgroundLight }]}>
                <Text style={[styles.elementBadgeLabel, { color: colors.textMuted }]}>Anda</Text>
                <Text style={[styles.elementBadgeValue, { color: colors.primary }]}>{result.dominantElements.person1}</Text>
              </View>
              <Text style={{ color: colors.textMuted, fontWeight: 'bold' }}>×</Text>
              <View style={[styles.elementBadge, { backgroundColor: colors.backgroundLight }]}>
                <Text style={[styles.elementBadgeLabel, { color: colors.textMuted }]}>Pasangan</Text>
                <Text style={[styles.elementBadgeValue, { color: colors.primary }]}>{result.dominantElements.person2}</Text>
              </View>
            </View>

            <Text style={[styles.narrative, { color: colors.textSecondary }]}>
              {result.narrative}
            </Text>

            {/* Arcana yang Sama / Selaras */}
            {result.sharedArcanas.length > 0 && (
              <View style={styles.sharedArcanasContainer}>
                <Text style={[styles.detailsTitle, { color: colors.text, textAlign: 'left' }]}>✨ Arcana yang Beresonansi:</Text>
                <View style={styles.chipGroup}>
                  {result.sharedArcanas.map((card, idx) => (
                    <View key={idx} style={[styles.chip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                      <Text style={[styles.chipText, { color: colors.primary }]}>{card}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Detail per dimensi rincian skor */}
            {result.details && result.details.length > 0 && (
              <View style={[styles.detailsContainer, { backgroundColor: colors.backgroundLight }]}>
                <Text style={[styles.detailsTitle, { color: colors.text }]}>📊 Rincian Sinkronisasi Energi</Text>
                {result.details.map((detail, idx) => (
                  <View key={idx} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                    <View style={{ flex: 1, paddingRight: SPACING.sm }}>
                      <Text style={[styles.detailCategory, { color: colors.text }]}>
                        {detail.category}
                      </Text>
                      <Text style={[styles.detailDescription, { color: colors.textMuted }]}>
                        {detail.description}
                      </Text>
                    </View>
                    <Text style={[styles.detailScore, { color: colors.primary }]}>
                      {detail.score}<Text style={{ color: colors.textMuted }}>/{detail.maxScore}</Text>
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity style={[styles.shareBtn, { borderColor: colors.border }]} onPress={shareResult}>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: FONT_SIZE.md }}>📤 Bagikan Hasil Energi</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: SPACING.xxl },
  header: { padding: SPACING.lg, paddingTop: 60, borderBottomLeftRadius: BORDER_RADIUS['3xl'], borderBottomRightRadius: BORDER_RADIUS['3xl'] },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: '800' },
  subtitle: { fontSize: FONT_SIZE.sm, marginTop: SPACING.xs },
  card: { margin: SPACING.md, borderRadius: BORDER_RADIUS['2xl'], padding: SPACING.lg, borderWidth: 1, ...SHADOWS.md },
  label: { fontSize: FONT_SIZE.sm, marginBottom: SPACING.sm, fontWeight: '600' },
  input: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, fontSize: FONT_SIZE.md, borderWidth: 1.5, marginBottom: SPACING.lg },
  button: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: FONT_SIZE.md, fontWeight: '700' },
  clearButton: { marginTop: SPACING.md, alignItems: 'center' },
  resultCard: { margin: SPACING.md, borderRadius: BORDER_RADIUS['2xl'], padding: SPACING.lg, alignItems: 'center', borderWidth: 1, ...SHADOWS.lg },
  score: { fontSize: FONT_SIZE['4xl'], fontWeight: '800', marginBottom: SPACING.xs },
  level: { fontSize: FONT_SIZE.xl, fontWeight: '700', marginBottom: SPACING.md },
  elementRowContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  elementBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, alignItems: 'center', minWidth: 80 },
  elementBadgeLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  elementBadgeValue: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  narrative: { fontSize: FONT_SIZE.md, textAlign: 'center', marginBottom: SPACING.lg, lineHeight: 24 },
  sharedArcanasContainer: { width: '100%', marginBottom: SPACING.lg },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.xs },
  chip: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm, borderWidth: 1 },
  chipText: { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  detailsContainer: { width: '100%', borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.lg },
  detailsTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', marginBottom: SPACING.md, textAlign: 'center' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  detailCategory: { fontSize: FONT_SIZE.sm, fontWeight: '600' },
  detailDescription: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  detailScore: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  shareBtn: { marginTop: SPACING.sm, padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, width: '100%', alignItems: 'center' },
});
 