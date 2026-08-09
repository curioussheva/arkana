// Berkas: src/features/destiny-matrix/presentation/MatrixScreen.tsx
// Merged: 37-Node Destiny Matrix Support + Full Groups/Stats/Theme

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator, 
  useWindowDimensions,
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
import { DestinyDiamond, type DestinyDiamondHandle } from '@components/charts';
import { PointDetailModal, type DetailablePoint } from '@components/ui/PointDetailModal';
import { EmptyState } from '@components/ui/EmptyState';
import type { DestinyPoint, DestinyPointKey } from '@core/destiny-matrix/types';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { MainTabParamList } from '@navigation/AppNavigator';

//import { ImportantPoints } from '../components/ImportantPoints';
import { getPositionInterpretation } from '@core/destiny-matrix/analysis/positions';
import { profileManager } from '@db/profile-manager';
import { destinyCacheManager } from '@db/destiny-cache-manager';
import { calculateDominantElement } from '@core/destiny-matrix/utils/element';

// Modul diagram tambahan
import { HealthChakraTable } from '../components/HealthChakraTable';
import { DestinyLevelsList } from '../components/DestinyLevelsList';
import { PurposeSection } from '../components/PurposeSection';
import { LineAncestryCard } from '../components/LineAncestryCard';

import {
  POINT_GROUPS,
  GROUP_DESCRIPTIONS,
  VALID_KEYS,
  getPointLabel,
} from '../constants/MatrixScreenConstants';

// Badge singkat untuk tampilan pill kecil — SENGAJA terpisah dari
// GEOMETRIC_KEY_MAP di core/constants.ts (yang pakai namespace panjang
// untuk reverse-lookup aman, mis. "Main_A"). Di UI kita mau tampil
// pendek ("A"), bukan namespace itu.
const SHORT_BADGE_MAP: Record<string, string> = {
  A: 'A', B: 'B', C: 'C', D: 'D', E: 'E',
  F: 'F', G: 'G', H: 'H', I: 'I',
  A1: 'A1', B1: 'B1', C1: 'C1', D1: 'D1',
  F1: 'F1', G1: 'G1', H1: 'H1', I1: 'I1',
  J: 'J', K: 'K', L: 'L', M: 'M',
  LM_Center: 'LM', Money: '[$]', Love: '[♡]',
  N: 'N', O: 'O', P: 'P',
  SubA: 'sA', SubB: 'sB', SubC: 'sC', SubD: 'sD',
  SubF: 'sF', SubG: 'sG', SubH: 'sH', SubI: 'sI',
  Q: 'eQ', R: 'eR', S: 'eS', T: 'eT',
  T10: '10th', T15: '15th', T20: '20th', T25: '25th', T30: '30th',
  T35: '35th', T40: '40th', T45: '45th', T50: '50th', T55: '55th',
  T60: '60th', T65: '65th', T70: '70th', T75: '75th',
  HeartDesirePhysical: 'HD-P', HeartDesireSpiritual: 'HD-S',
  Heaven: 'Lv1', Earth: 'Lv2', PersonalDestiny: 'Lv3',
  FatherLine: 'Lv4', MotherLine: 'Lv5', SocialDestiny: 'Lv6',
  SpiritualDestiny: 'Lv7', GlobalMission: 'Lv8',
  PersonalCenter: 'PC', FamilyCenter: 'FC', UnifiedCenter: 'UC',
};

export function MatrixScreen() {
  const colors = useThemeStore(state => state.getColors());
  const matrix = useAppStore(state => state.currentMatrix);
  const activeProfileId = useAppStore(state => state.activeProfileId);
  const setMatrix = useAppStore(state => state.setMatrix);
  const isCalculating = useAppStore(state => state.isCalculating);
  const error = useAppStore(state => state.error);
  const activeProfileName = useAppStore(state => state.activeProfileName);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [selectedPoint, setSelectedPoint] = useState<DetailablePoint | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Pusat', 'Rezeki']));
  const [isExporting, setIsExporting] = useState(false);
  const diamondRef = useRef<DestinyDiamondHandle>(null);

  // Sync cache DB → store
  useEffect(() => {
    const loadFromCache = async () => {
      if (matrix) return;
      if (!activeProfileId || activeProfileId === 'default') return;
      try {
        const profile = await profileManager.getProfile(activeProfileId);
        if (profile) {
          const cached = await destinyCacheManager.getCachedMatrix(
            activeProfileId,
            profile.birthDate
          );
          if (cached) setMatrix(cached);
        }
      } catch (err) {
        console.warn('Gagal memuat cache matrix:', err);
      }
    };
    loadFromCache();
  }, [activeProfileId, matrix, setMatrix]);

  // Points murni kunci core
  const safePointsArray = useMemo(() => {
    if (!matrix?.points) return [];
    const arr: DestinyPoint[] = [];
    VALID_KEYS.forEach(key => {
      const pt = matrix.points[key];
      if (pt) arr.push({ ...pt, key });
    });
    return arr;
  }, [matrix]);

  // 5 pilar utama untuk ImportantPoints

  const mainPointsData = useMemo(() => {
    if (!matrix?.points) return [];
    const targetKeys: DestinyPointKey[] = ['A', 'B', 'E', 'C', 'D'];
    return targetKeys
      .map(key => {
        const pt = matrix.points[key];
        if (!pt || !pt.arcana) return null;
        const cardName = pt.arcana.matrixName || pt.arcana.tarotName || 'Arcana';
        const meaningSnippet = pt.arcana.summary || pt.arcana.uprightMeaning || '';
        return {
          key: String(key),
          label: getPointLabel[key] || 'Titik Takdir',
          arcana: {
            ...pt.arcana,
            id: pt.arcana.id === 0 ? 22 : pt.arcana.id,
          },
          interpretation: getPositionInterpretation(key, cardName, meaningSnippet),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [matrix]); 

  // Grouped accordion
  const groupedPoints = useMemo(() => {
    if (safePointsArray.length === 0) return {};
    const groups: Record<string, DestinyPoint[]> = {};
    Object.entries(POINT_GROUPS).forEach(([groupName, keys]) => {
      const filtered = safePointsArray.filter(point =>
        keys.includes(point.key as DestinyPointKey)
      );
      groups[groupName] = filtered;
    });
    return groups;
  }, [safePointsArray]);

  // Stats
  const stats = useMemo(() => {
    if (safePointsArray.length === 0) return null;
    const totalValue = safePointsArray.reduce((sum, p) => sum + (p.value || 0), 0);
    const avgValue = Math.round(totalValue / safePointsArray.length);
    const coreElement = matrix?.points?.E?.arcana?.element || 'Water';
    const pointsByElement: Record<string, DestinyPoint[]> = {
      Fire: [],
      Earth: [],
      Water: [],
      Air: [],
    };
    safePointsArray.forEach(p => {
      const el = p.arcana?.element;
      if (el && pointsByElement[el]) pointsByElement[el].push(p);
    });
    const dominantElement = calculateDominantElement(pointsByElement, coreElement);
    return {
      totalPoints: safePointsArray.length,
      avgValue,
      coreElement,
      dominantElement,
    };
  }, [safePointsArray, matrix]);

  const handlePointPress = useCallback((point: DetailablePoint | DestinyPoint | undefined) => {
  if (!point) return; // baris baru — jaga-jaga kalau DestinyDiamond kirim undefined
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  const displayValue = point.value === 0 ? 22 : point.value;
  const updatedArcana = point.arcana
    ? { ...point.arcana, id: point.arcana.id === 0 ? 22 : point.arcana.id }
    : undefined;
  setSelectedPoint({
    ...point,
    value: displayValue,
    arcana: updatedArcana as any,
  } as DetailablePoint);
}, []);

  const toggleGroup = useCallback((groupName: string) => {
    Haptics.selectionAsync().catch(() => {});
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      const currentRef = diamondRef.current;
      if (!currentRef) {
        Alert.alert('⚠️ Info', 'Diagram belum siap untuk diekspor.');
        return;
      }
      const uri = await currentRef.exportAsImage();
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('⚠️ Tidak Didukung', 'Fitur berbagi tidak tersedia di perangkat ini');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '💎 Bagikan Destiny Diamond Blueprint',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      Alert.alert('❌ Error', 'Gagal memproses gambar peta takdir.');
    } finally {
      setIsExporting(false);
    }
  }, []);

  // ─── Loading ───────────────────────────────────────
  if (isCalculating) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={{ color: colors.textSecondary, marginTop: SPACING.md, fontSize: FONT_SIZE.md }}
        >
             {`Menghubungkan blueprint numerologi (${VALID_KEYS.length} Titik)...`}
        </Text>
      </SafeAreaView>
    );
  }

  // ─── Error ─────────────────────────────────────────
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

  // ─── Empty ─────────────────────────────────────────
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

  // ─── Main ──────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ─── BLOK 1: HEADER & STATISTIK ─── */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient colors={colors.gradients.headerGradient} style={styles.headerGradient}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              💎 Peta Matriks Takdir
            </Text>
            <Text style={{ fontSize: FONT_SIZE.sm, color: colors.textSecondary }}>
              {activeProfileName
                ? `Profil: ${activeProfileName}`
                : 'Struktur visualisasi energi & kalkulasi arkana takdir'}
            </Text>

            {stats && (
              <View style={styles.statsRow}>
                {(
                  [
                    { value: stats.coreElement, label: 'Elemen Inti' },
                    { value: stats.dominantElement, label: 'Dominan' },
                    { value: String(stats.avgValue), label: 'Rata-rata' },
                    { value: `${stats.totalPoints} Titik Takdir`, label: 'Total Titik' },
                  ] as const
                ).map(item => (
                  <View
                    key={item.label}
                    style={[
                      styles.statCard,
                      { backgroundColor: colors.surface + '80', borderColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[styles.statNumber, { color: colors.primary }]}
                      numberOfLines={1}
                    >
                      {item.value}
                    </Text>
                    <Text
                      style={[styles.statLabel, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* ─── BLOK 2: DIAMOND + CHAKRA / ANCESTRY / PURPOSE ─── */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <View style={isTablet ? styles.tabletLayout : styles.mobileLayout}>
            {/* Canvas Destiny Diamond (Points) */}
            <View style={isTablet ? styles.tabletRightCol : styles.fullWidth}>
              <View
                style={[
                  styles.diamondCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.exportRow}>
                  <TouchableOpacity
                    style={[
                      styles.exportButton,
                      {
                        backgroundColor: colors.backgroundLight + 'CC',
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={handleExport}
                    disabled={isExporting}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.exportButtonText, { color: colors.primary }]}>
                      {isExporting ? 'Menyiapkan...' : 'Bagikan diagram'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.diamondWrapper}>
                  <DestinyDiamond
                   ref={diamondRef}
                   matrix={matrix}
                   onPointPress={handlePointPress}
                   userName={activeProfileName || undefined}
                   showCredit={true}
                   showExtraLabels={true}
                  />
                </View>
              </View>
            </View>

            {/* Chakra + Ancestry + Purpose  */}
            <View style={isTablet ? styles.tabletLeftCol : styles.fullWidth}>
              <HealthChakraTable matrix={matrix} />
              <DestinyLevelsList matrix={matrix} />              
              <LineAncestryCard matrix={matrix} />
              <PurposeSection matrix={matrix} />
            </View>
          </View>
        </Animated.View>

        {/* ─── BLOK 3: INTERPRETASI TITIK (ACCORDION) ─── */}
        <View style={styles.blockWrapper}>
          <Text
            style={{
              fontSize: FONT_SIZE.lg,
              fontWeight: '800',
              color: colors.text,
              marginBottom: SPACING.xs,
            }}
          >
   {`📊 Interpretasi ${VALID_KEYS.length} Titik Takdir`}
          </Text>
          <Text
            style={{ fontSize: FONT_SIZE.xs, color: colors.textMuted, marginBottom: SPACING.md }}
          >
            Rujukan matriks energi berdasarkan persilangan jalur numerologi dan koordinat geometris
            arkana.
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
                <View
                  style={[
                    styles.groupCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.groupHeader,
                      isExpanded && { borderBottomWidth: 1, borderBottomColor: colors.border },
                    ]}
                    onPress={() => toggleGroup(groupName)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1, paddingRight: SPACING.md }}>
                      <Text style={[styles.groupTitle, { color: colors.text }]}>
                           {groupName === 'Pusat' && '🎯 '}
   {groupName === 'Leluhur' && '🏛️ '}
   {groupName === 'Chakra' && '🧘 '}
   {groupName === 'Rezeki' && '💎 '}
   {groupName === 'Pendamping' && '🛡️ '}
   {groupName === 'Usia' && '⏳ '}
   {groupName === 'Level Takdir' && '👑 '}
                      </Text>
                      <Text
                        style={{ fontSize: FONT_SIZE.xs, color: colors.textMuted, marginTop: 2 }}
                      >
                        {GROUP_DESCRIPTIONS[groupName]}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.badge, { backgroundColor: colors.primary + '15' }]}>
                        <Text
                          style={{
                            color: colors.primary,
                            fontSize: FONT_SIZE.xs,
                            fontWeight: '600',
                          }}
                        >
                          {points.length} Titik
                        </Text>
                      </View>
                      <Text style={{ color: colors.textMuted, fontSize: FONT_SIZE.md }}>
                        {isExpanded ? '▲' : '▼'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {isExpanded &&
                    points.map(point => {
                      const tarotName = point.arcana?.tarotName || 'Major Arcana';
                      const matrixName = point.arcana?.matrixName;
                      const geometricLabel = SHORT_BADGE_MAP[point.key] || point.key;
                      const displayPointValue = point.value === 0 ? 22 : point.value;

                      return (
                        <TouchableOpacity
                          key={point.key}
                          style={[styles.pointRow, { borderBottomColor: colors.border + '30' }]}
                          activeOpacity={0.6}
                          onPress={() => handlePointPress(point as DetailablePoint)}
                        >
                          <View
                            style={[
                              styles.pointKeyBadge,
                              {
                                backgroundColor: colors.primary + '12',
                                borderColor: colors.primary + '25',
                              },
                            ]}
                          >
                            <Text style={[styles.pointKeyText, { color: colors.primary }]}>
                              {geometricLabel}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: FONT_SIZE.xs,
                                color: colors.textMuted,
                                fontWeight: '600',
                              }}
                            >
                              {point.label || 'Titik Jalur'}{' '}
                              <Text style={{ color: colors.primary }}>

                              </Text>
                            </Text>
                            <Text
                              style={{
                                fontSize: FONT_SIZE.md,
                                fontWeight: '700',
                                color: colors.text,
                                marginTop: 1,
                              }}
                            >
                              Arcana {displayPointValue}{' '}
                              <Text
                                style={{
                                  fontSize: FONT_SIZE.sm,
                                  fontWeight: '400',
                                  color: colors.primaryLight,
                                }}
                              >
                                • {tarotName} {matrixName ? `("${matrixName}")` : ''}
                              </Text>
                            </Text>
                          </View>
                          <Text style={{ color: colors.textMuted, paddingLeft: SPACING.xs }}>
                            →
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </Animated.View>
            );
          })}
        </View>

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>

      <PointDetailModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  headerGradient: {
    padding: SPACING.xl,
    paddingTop: SPACING.md,          // dikurangi dari lg
    borderBottomLeftRadius: BORDER_RADIUS['3xl'],
    borderBottomRightRadius: BORDER_RADIUS['3xl'],
    marginBottom: SPACING.md,        // dikurangi dari lg
  },
  headerTitle: { 
    fontSize: FONT_SIZE.xxl, 
    fontWeight: '800' 
  },

  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: SPACING.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: { 
    fontSize: FONT_SIZE.sm, 
    fontWeight: '800' 
  },
  statLabel: { 
    fontSize: 10, 
    marginTop: 2, 
    textAlign: 'center' 
  },

  // Responsive layout
  mobileLayout: { 
    flexDirection: 'column', 
    gap: 16, 
    paddingHorizontal: SPACING.md 
  },
  tabletLayout: {
    flexDirection: 'row-reverse',
    gap: 16,
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
  },
  tabletLeftCol: { 
    flex: 1 
  },
  tabletRightCol: { 
    flex: 1.2 
  },
  fullWidth: { 
    width: '100%' 
  },

  // ===== Bagian Diamond / Canvas (sudah dinaikkan) =====
  diamondCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,             // sebelumnya 24
    paddingTop: 8,
    paddingBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  diamondWrapper: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
  },
  exportRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 4,                   // sebelumnya 8
    paddingBottom: 2,                // sebelumnya 4
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  exportButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  blockWrapper: { 
    paddingHorizontal: SPACING.md, 
    marginTop: SPACING.xl 
  },
  pilarHeaderContainer: { 
    marginBottom: SPACING.xs 
  },

  groupCard: {
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  groupTitle: { 
    fontSize: FONT_SIZE.md, 
    fontWeight: '700' 
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
  },
  pointKeyBadge: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
  },
  pointKeyText: { 
    fontSize: FONT_SIZE.xs, 
    fontWeight: '800' 
  },
}); 

export default MatrixScreen;