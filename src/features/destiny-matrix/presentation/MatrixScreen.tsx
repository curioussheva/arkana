import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';

import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { DestinyDiamond } from '@components/charts';
import { PointDetailModal, type DetailablePoint } from '@components/ui/PointDetailModal';
import type { DestinyPoint, DestinyPointKey } from '@core/destiny-matrix/types';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

// 🔄 REUSE: Impor komponen interpretasi standar dari fitur Insight
import { ImportantPoints } from '../../insight/components/ImportantPoints';
import { getPositionInterpretation } from '@core/destiny-matrix/analysis/positions';

const POINT_GROUPS: Record<string, DestinyPointKey[]> = {
  'Pusat': ['A', 'B', 'C', 'D', 'E'],
  'Langit': ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'],
  'Bumi': ['C1', 'C2', 'C3', 'D1', 'D2', 'D3'],
  'Personal': ['E1', 'E2'],
};

const GROUP_DESCRIPTIONS: Record<string, string> = {
  'Pusat': 'Titik inti yang membentuk fondasi cetak biru takdirmu.',
  'Langit': 'Jalur ekspresi karakter & potensi spiritual tertinggi.',
  'Bumi': 'Jalur realisasi finansial & manifestasi karma duniawi.',
  'Personal': 'Aspek keseimbangan energi leluhur garis keturunan.',
};

// Peta label penamaan titik utama
const MAIN_POINT_LABELS: Record<string, string> = {
  A: 'Hari Lahir (Karakter / Mental)',
  B: 'Bulan Lahir (Spiritual / Malaikat Pelindung)',
  E: 'Pusat Jiwa (Comfort Zone)',
  C: 'Tahun Lahir (Material / Finansial)',
  D: 'Ekor Karma (Pelajaran Masa Lalu)',
};

export function MatrixScreen() {
  const colors = useThemeStore((state) => state.getColors());
  const matrix = useAppStore((state) => state.currentMatrix);

  const [selectedPoint, setSelectedPoint] = useState<DetailablePoint | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Pusat']));
  const [isExporting, setIsExporting] = useState(false);

  const diamondRef = useRef<any>(null);

// 🎯 TRANSFORMASI: Ubah data DestinyMatrix menjadi struktur ImportantPointItem[] dengan tafsir kontekstual
const mainPointsData = useMemo(() => {
  if (!matrix?.points) return [];
  
  const targetKeys: DestinyPointKey[] = ['A', 'B', 'E', 'C', 'D'];
  
  return targetKeys.map((key) => {
    const pt = matrix.points[key];
    if (!pt || !pt.arcana) return null;

    // Ambil nama tampilan yang ramah
    const cardName = pt.arcana.matrixName || pt.arcana.tarotName || 'Arcana';
    
    // Ambil cuplikan makna dasar
    const meaningSnippet = pt.arcana.summary || pt.arcana.uprightMeaning || '';

    return {
      key: String(key),
      label: MAIN_POINT_LABELS[key] || 'Titik Takdir',
      arcana: pt.arcana,
      // 💡 SEKARANG SELESAI: Menggunakan fungsi tafsir kontekstual yang sama dengan InsightScreen!
      interpretation: getPositionInterpretation(key, cardName, meaningSnippet),
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
}, [matrix]);

 
  // Memetakan struktur grup titik secara aman untuk akordeon bawah
  const groupedPoints = useMemo(() => {
    if (!matrix?.points) return {};
    const groups: Record<string, DestinyPoint[]> = {};
    const allPoints = Object.values(matrix.points);
    
    Object.entries(POINT_GROUPS).forEach(([groupName, keys]) => {
      groups[groupName] = allPoints.filter((point) => 
        keys.includes(point.key as DestinyPointKey)
      );
    });
    return groups;
  }, [matrix]);

  // Statistik ringkasan untuk header profil takdir
  const stats = useMemo(() => {
    if (!matrix?.points) return null;
    const allPoints = Object.values(matrix.points);
    const totalValue = allPoints.reduce((sum, p) => sum + (p.value || 0), 0);
    const avgValue = allPoints.length ? Math.round(totalValue / allPoints.length) : 0;
    const elementStr = matrix.points.E?.arcana?.element || 'Murni';

    return {
      totalPoints: allPoints.length,
      avgValue,
      dominantElement: elementStr,
    };
  }, [matrix]);

  const handlePointPress = useCallback((point: DetailablePoint) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPoint(point);
  }, []);

  const toggleGroup = useCallback((groupName: string) => {
    Haptics.selectionAsync();
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const currentRef = diamondRef.current;
      if (!currentRef?.exportAsImage) {
        Alert.alert('⚠️ Info', 'Fungsi ekspor diagram belum didukung komponen ini.');
        return;
      }

      const uri = await currentRef.exportAsImage();
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('⚠️ Tidak Didukung', 'Fitur berbagi dokumen tidak tersedia di perangkat ini');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '💎 Bagikan Destiny Diamond Blueprint',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('❌ Error', 'Gagal memproses gambar peta takdir.');
    } finally {
      setIsExporting(false);
    }
  }, []);

  if (!matrix || !matrix.points) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: SPACING.md, fontSize: FONT_SIZE.md }}>
          Menghubungkan blueprint numerologi...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Header Profil Statistik */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient colors={colors.gradients.headerGradient} style={styles.headerGradient}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>💎 Peta Geometri Jiwa</Text>
            <Text style={{ fontSize: FONT_SIZE.sm, color: colors.textSecondary }}>Struktur visualisasi energi & kalkulasi arcana takdir</Text>
            
            {stats && (
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: colors.surface + '80', borderColor: colors.border }]}>
                  <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalPoints}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Titik Energi</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface + '80', borderColor: colors.border }]}>
                  <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.avgValue}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rata-rata Arcana</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface + '80', borderColor: colors.border }]}>
                  <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.dominantElement}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Elemen Inti</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* 2. Visual Kartu Destiny Diamond */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <View style={[styles.diamondCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <DestinyDiamond ref={diamondRef} matrix={matrix} onPointPress={handlePointPress} />
            
            <TouchableOpacity 
              style={[styles.exportButton, { backgroundColor: colors.backgroundLight, borderColor: colors.border }]} 
              onPress={handleExport} 
              disabled={isExporting} 
              activeOpacity={0.8}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>
                {isExporting ? '⏳ Mengolah Gambar...' : '📤 Bagikan Blueprint Visual'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 3. PEMBARUAN: Menggunakan komponen ImportantPoints terpadu dari layar insight */}
        {mainPointsData.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300).duration(700)}>
            <View style={{ paddingHorizontal: SPACING.md }}>
              <ImportantPoints points={mainPointsData} />
            </View>
          </Animated.View>
        )}

        {/* 4. Struktur Titik Koordinat Lengkap (Accordion) */}
        <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.lg }}>
          <Text style={{ fontSize: FONT_SIZE.lg, fontWeight: '800', color: colors.text, marginBottom: SPACING.md }}>
            📊 Rincian Konfigurasi Energi
          </Text>

          {Object.entries(groupedPoints).map(([groupName, points], groupIndex) => {
            const isExpanded = expandedGroups.has(groupName);
            if (points.length === 0) return null;

            return (
              <Animated.View 
                key={groupName} 
                entering={SlideInRight.delay(groupIndex * 80)} 
                layout={Layout.springify()}
              >
                <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TouchableOpacity 
                    style={[styles.groupHeader, isExpanded && { borderBottomWidth: 1, borderBottomColor: colors.border }]} 
                    onPress={() => toggleGroup(groupName)} 
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1, paddingRight: SPACING.md }}>
                      <Text style={[styles.groupTitle, { color: colors.text }]}>
                        {groupName === 'Pusat' && '🎯 '}
                        {groupName === 'Langit' && '⭐ '}
                        {groupName === 'Bumi' && '🌍 '}
                        {groupName === 'Personal' && '💫 '}
                        {groupName}
                      </Text>
                      <Text style={{ fontSize: FONT_SIZE.xs, color: colors.textMuted, marginTop: 2 }}>
                        {GROUP_DESCRIPTIONS[groupName]}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.badge, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={{ color: colors.primary, fontSize: FONT_SIZE.xs, fontWeight: '600' }}>
                          {points.length} Titik
                        </Text>
                      </View>
                      <Text style={{ color: colors.textMuted, fontSize: FONT_SIZE.md }}>
                        {isExpanded ? '▲' : '▼'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && points.map((point) => {
  // Ambil nama kartu Tarot asli dengan fallback yang aman
  const tarotName = point.arcana?.tarotName || 'Major Arcana';
  // Ambil nama energi versi Matrix jika tersedia
  const matrixName = point.arcana?.matrixName;

  return (
    <TouchableOpacity 
      key={point.key} 
      style={[styles.pointRow, { borderBottomColor: colors.border + '30' }]} 
      activeOpacity={0.6} 
      onPress={() => handlePointPress(point as DetailablePoint)}
    >
      <View style={[styles.pointKeyBadge, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '25' }]}>
        <Text style={[styles.pointKeyText, { color: colors.primary }]}>{point.key}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: FONT_SIZE.xs, color: colors.textMuted }}>{point.label || 'Titik Energi'}</Text>
        <Text style={{ fontSize: FONT_SIZE.md, fontWeight: '700', color: colors.text, marginTop: 1 }}>
          Arcana {point.value}{' '}
          <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: '400', color: colors.primaryLight }}>
            • {tarotName} {matrixName ? `("${matrixName}")` : ''}
          </Text>
        </Text>
      </View>
      <Text style={{ color: colors.textMuted, paddingLeft: SPACING.xs }}>→</Text>
    </TouchableOpacity>
  );
})}

                </View>
              </Animated.View>
            );
          })}
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <PointDetailModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  headerGradient: { padding: SPACING.xl, paddingBottom: SPACING.xl, borderBottomLeftRadius: BORDER_RADIUS['3xl'], borderBottomRightRadius: BORDER_RADIUS['3xl'], marginBottom: SPACING.md },
  headerTitle: { fontSize: FONT_SIZE['3xl'], fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  statCard: { flex: 1, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, borderWidth: 1, alignItems: 'center' },
  statNumber: { fontSize: FONT_SIZE.xl, fontWeight: '800' },
  statLabel: { fontSize: FONT_SIZE.xs, marginTop: 2, textAlign: 'center' },
  diamondCard: { borderRadius: BORDER_RADIUS['2xl'], padding: SPACING.lg, margin: SPACING.md, marginTop: 0, borderWidth: 1, ...SHADOWS.md },
  exportButton: { alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1 },
  groupCard: { borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.md, borderWidth: 1, overflow: 'hidden', ...SHADOWS.sm },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  groupTitle: { fontSize: FONT_SIZE.md, fontWeight: '700' },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  pointRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 1 },
  pointKeyBadge: { width: 38, height: 38, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md, borderWidth: 1 },
  pointKeyText: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
});
 