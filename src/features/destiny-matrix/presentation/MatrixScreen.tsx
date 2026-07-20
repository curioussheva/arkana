// Berkas: src/features/destiny-matrix/presentation/MatrixScreen.tsx

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
  LinearTransition,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { DestinyDiamond } from '@components/charts';
import { PointDetailModal, type DetailablePoint } from '@components/ui/PointDetailModal';
import { EmptyState } from '@components/ui/EmptyState';
import type { DestinyPoint, DestinyPointKey } from '@core/destiny-matrix/types';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { MainTabParamList } from '@navigation/AppNavigator';

import { ImportantPoints } from '../../insight/components/ImportantPoints';
import { getPositionInterpretation } from '@core/destiny-matrix/analysis/positions';

// 🎯 FILTER UTAMA: Ambil daftar murni 20 kunci core asli agar terhindar dari duplikasi prototype objek
const VALID_20_KEYS: DestinyPointKey[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
];

// 🎯 FILOSOFI CORE: Kunci isi grup hanya menggunakan alfabet murni sesuai engine layout.ts
const POINT_GROUPS: Record<string, DestinyPointKey[]> = {
  'Pusat': ['A', 'B', 'C', 'D', 'E'],
  'Langit': ['Q', 'J', 'I', 'R', 'K', 'F'],  // Pengganti fungsional dari A1, A2, A3, B1, B2, B3
  'Bumi': ['S', 'L', 'G', 'T', 'M', 'H'],   // Pengganti fungsional dari C1, C2, C3, D1, D2, D3
  'Personal': ['N', 'O', 'P'],              // Murni klaster pengaman bawah-kiri yang tergambar di Skia
};

const GROUP_DESCRIPTIONS: Record<string, string> = {
  'Pusat': 'Pilar getaran utama yang membentuk fondasi cetak biru takdirmu.',
  'Langit': 'Jalur ekspresi karakter mental & potensi spiritual tertinggi.',
  'Bumi': 'Jalur realisasi finansial & manifestasi tantangan karma duniawi.',
  'Personal': 'Klaster perlindungan spiritual dan detoksifikasi utang karma masa lalu.',
};

const MAIN_POINT_LABELS: Record<string, string> = {
  A: 'Hari Lahir (Karakter / Mental)',
  B: 'Bulan Lahir (Spiritual / Malaikat Pelindung)',
  E: 'Pusat Jiwa (Zona Nyaman)',
  C: 'Tahun Lahir (Material / Finansial)',
  D: 'Ekor Karma (Pelajaran Masa Lalu)',
};

const GEOMETRIC_KEY_MAP: Record<string, string> = {
  'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E',
  'J': 'A2', 'K': 'B2', 'L': 'C2', 'M': 'D2',
  'I': 'A3', 'F': 'B3', 'G': 'C3', 'H': 'D3',
  'Q': 'A1', 'R': 'B1', 'S': 'C1', 'T': 'D1',
  'N': 'N',  'O': 'O',  'P': 'P',
}; 

export function MatrixScreen() {
  const colors = useThemeStore((state) => state.getColors());
  const matrix = useAppStore((state) => state.currentMatrix);
  const isCalculating = useAppStore((state) => state.isCalculating);
  const error = useAppStore((state) => state.error);
  const activeProfileName = useAppStore((state) => state.activeProfileName);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const [selectedPoint, setSelectedPoint] = useState<DetailablePoint | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Pusat']));
  const [isExporting, setIsExporting] = useState(false);
  const diamondRef = useRef<any>(null);

  // Menyaring objek points murni berbasis 20 kunci Core
  const safePointsArray = useMemo(() => {
    if (!matrix?.points) return [];
    const arr: DestinyPoint[] = [];
    VALID_20_KEYS.forEach(key => {
      const pt = matrix.points[key];
      if (pt) {
        arr.push({ ...pt, key });
      }
    });
    return arr;
  }, [matrix]);

  const mainPointsData = useMemo(() => {
    if (!matrix?.points) return [];
    const targetKeys: DestinyPointKey[] = ['A', 'B', 'E', 'C', 'D'];
    return targetKeys.map((key) => {
      const pt = matrix.points[key];
      if (!pt || !pt.arcana) return null;
      const cardName = pt.arcana.matrixName || pt.arcana.tarotName || 'Arcana';
      const meaningSnippet = pt.arcana.summary || pt.arcana.uprightMeaning || '';
      return {
        key: String(key),
        label: MAIN_POINT_LABELS[key] || 'Titik Takdir',
        arcana: {
          ...pt.arcana,
          id: pt.arcana.id === 0 ? 22 : pt.arcana.id
        },
        interpretation: getPositionInterpretation(key, cardName, meaningSnippet),
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [matrix]);

  const groupedPoints = useMemo(() => {
    if (safePointsArray.length === 0) return {};
    const groups: Record<string, DestinyPoint[]> = {};

    Object.entries(POINT_GROUPS).forEach(([groupName, keys]) => {
      const filtered = safePointsArray.filter((point) =>
        keys.includes(point.key as DestinyPointKey)
      );

      filtered.sort((a, b) => {
        const labelA = GEOMETRIC_KEY_MAP[a.key] || a.key;
        const labelB = GEOMETRIC_KEY_MAP[b.key] || b.key;
        return labelA.localeCompare(labelB, undefined, { numeric: true, sensitivity: 'base' });
      });

      groups[groupName] = filtered;
    });

    return groups;
  }, [safePointsArray]);

  const stats = useMemo(() => {
    if (safePointsArray.length === 0) return null;
    const totalValue = safePointsArray.reduce((sum, p) => sum + (p.value || 0), 0);
    const avgValue = Math.round(totalValue / safePointsArray.length);
    const elementStr = matrix?.points?.E?.arcana?.element || 'Murni';
    return {
      totalPoints: safePointsArray.length,
      avgValue,
      dominantElement: elementStr,
    };
  }, [safePointsArray, matrix]);

  const handlePointPress = useCallback((point: DetailablePoint) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const displayValue = point.value === 0 ? 22 : point.value;
    const updatedArcana = point.arcana ? { ...point.arcana, id: point.arcana.id === 0 ? 22 : point.arcana.id } : undefined;

    setSelectedPoint({
      ...point,
      value: displayValue,
      arcana: updatedArcana as any,
    });
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

  if (isCalculating) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: SPACING.md, fontSize: FONT_SIZE.md }}>
          Menghubungkan blueprint numerologi...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <EmptyState
          icon="⚠️"
          title="Gagal Memuat Blueprint"
          description={error}
          actionLabel="Coba Lagi"
          onAction={() => {
            useAppStore.getState().clearError();
            navigation.navigate('Home');
          }}
        />
      </SafeAreaView>
    );
  }

  if (!matrix || !matrix.points) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <EmptyState
          icon="💎"
          title="Blueprint Belum Tersedia"
          description={`Hitung Destiny Matrix untuk profil "${activeProfileName}" terlebih dahulu untuk melihat peta matriks takdirmu.`}
          actionLabel="Ke Beranda"
          onAction={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ─── BLOK 1: HEADER & STATISTIK PROFILE ─── */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient colors={colors.gradients.headerGradient} style={styles.headerGradient}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>💎 Peta Matriks Takdir</Text>
            <Text style={{ fontSize: FONT_SIZE.sm, color: colors.textSecondary }}>Struktur visualisasi energi &amp; kalkulasi arkana takdir</Text>

            {stats && (
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: colors.surface + '80', borderColor: colors.border }]}>
                  <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalPoints}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Titik Matriks</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface + '80', borderColor: colors.border }]}>
                  <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.avgValue}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rata-rata Arcana</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface + '80', borderColor: colors.border }]}>
                  <Text style={[styles.statNumber, { color: colors.primary || colors.text }]}>{stats.dominantElement}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Elemen Inti</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* ─── BLOK 2: KANVAS GEOMETRI DESTINY DIAMOND ─── */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <View style={[styles.diamondCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.diamondWrapper}>
              <DestinyDiamond ref={diamondRef} matrix={matrix} onPointPress={handlePointPress} />
              <TouchableOpacity
                style={[styles.floatingExportButton, { backgroundColor: colors.backgroundLight + 'CC', borderColor: colors.border }]}
                onPress={handleExport}
                disabled={isExporting}
                activeOpacity={0.7}
              >
                <Text style={[styles.floatingExportText, { color: colors.primary }]}>
                  {isExporting ? '⏳' : '📤 Share'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ─── BLOK 3: INTERPRETASI TITIK TAKDIR (Daftar Akordion Bawah) ─── */}
        <View style={styles.blockWrapper}>
          <Text style={{ fontSize: FONT_SIZE.lg, fontWeight: '800', color: colors.text, marginBottom: SPACING.xs }}>
            📊 Interpretasi Titik Takdir
          </Text>
          <Text style={{ fontSize: FONT_SIZE.xs, color: colors.textMuted, marginBottom: SPACING.md }}>
            Rujukan matriks energi berdasarkan persilangan jalur numerologi dan koordinat geometris arkana.
          </Text>

          {Object.entries(groupedPoints).map(([groupName, points], groupIndex) => {
            const isExpanded = expandedGroups.has(groupName);
            if (points.length === 0) return null;

            return (
              <Animated.View
                key={groupName}
                entering={SlideInRight.delay(groupIndex * 80)}
                layout={LinearTransition.springify()}
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
                    const tarotName = point.arcana?.tarotName || 'Major Arcana';
                    const matrixName = point.arcana?.matrixName;
                    
                    // 🎯 LAPISAN PRESENTASI: Translasi kunci fisik (Q, J, N) menjadi label kosmetik batin (A1, A2, N)
                    const geometricLabel = GEOMETRIC_KEY_MAP[point.key] || point.key;
                    const displayPointValue = point.value === 0 ? 22 : point.value;

                    return (
                      <TouchableOpacity
                        key={point.key}
                        style={[styles.pointRow, { borderBottomColor: colors.border + '30' }]}
                        activeOpacity={0.6}
                        onPress={() => handlePointPress(point as DetailablePoint)}
                      >
                        {/* Bulatan badge kiri sekarang konsisten menampilkan identitas kosmetik kompas (A1, B2, dll) */}
                        <View style={[styles.pointKeyBadge, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '25' }]}>
                          <Text style={[styles.pointKeyText, { color: colors.primary }]}>{geometricLabel}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: FONT_SIZE.xs, color: colors.textMuted, fontWeight: '600' }}>
                            {point.label || 'Titik Jalur'}{' '}
                            <Text style={{ color: colors.primary }}>• Posisi Peta: [{geometricLabel}]</Text>
                          </Text>
                          <Text style={{ fontSize: FONT_SIZE.md, fontWeight: '700', color: colors.text, marginTop: 1 }}>
                            Arcana {displayPointValue}{' '}
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

        {/* ─── BLOK 4: PEMBACAAN PILAR UTAMA JIWA ─── */}
        {mainPointsData.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300).duration(700)}>
            <View style={styles.blockWrapper}>
              <View style={styles.pilarHeaderContainer}>
                <Text style={{ fontSize: FONT_SIZE.lg, fontWeight: '800', color: colors.text }}>
                  🧭 Pembacaan Pilar Utama Jiwa
                </Text>
                <Text style={{ fontSize: FONT_SIZE.xs, color: colors.textMuted, marginTop: 4, marginBottom: SPACING.xs }}>
                  Analisis sintesis terdalam mengenai lima jangkar takdir spiritual dan kehidupan nyata Anda.
                </Text>
              </View>
              <ImportantPoints points={mainPointsData} />
            </View>
          </Animated.View>
        )}

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>

      <PointDetailModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  headerGradient: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS['3xl'],
    borderBottomRightRadius: BORDER_RADIUS['3xl'],
    marginBottom: SPACING.lg,
  },
  headerTitle: { fontSize: FONT_SIZE['xxl'], fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  statCard: { flex: 1, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, borderWidth: 1, alignItems: 'center' },
  statNumber: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  statLabel: { fontSize: FONT_SIZE.xs, marginTop: 2, textAlign: 'center' },
  diamondCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    marginHorizontal: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  diamondWrapper: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
  },
  blockWrapper: { paddingHorizontal: SPACING.md, marginTop: SPACING.xl },
  pilarHeaderContainer: {
    marginBottom: SPACING.xs,
  },
  groupCard: { borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.md, borderWidth: 1, overflow: 'hidden', ...SHADOWS.sm },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  groupTitle: { fontSize: FONT_SIZE.md, fontWeight: '700' },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  pointRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 1 },
  pointKeyBadge: { width: 38, height: 38, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md, borderWidth: 1 },
  pointKeyText: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  floatingExportButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  floatingExportText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default MatrixScreen;
 