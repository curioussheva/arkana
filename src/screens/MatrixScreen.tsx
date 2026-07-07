// src/screens/MatrixScreen.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { DestinyDiamond, type DestinyDiamondHandle } from '@components/charts';
import { PointDetailModal } from '@components/ui/PointDetailModal';
import type { DetailablePoint } from '@components/ui/PointDetailModal';
import type { DestinyPoint, DestinyPointKey } from '@core/destiny-matrix/types';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

const POINT_GROUPS: Record<string, DestinyPointKey[]> = {
  'Pusat': ['A', 'B', 'C', 'D', 'E'],
  'Langit': ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'],
  'Bumi': ['C1', 'C2', 'C3', 'D1', 'D2', 'D3'],
  'Personal': ['E1', 'E2'],
};

const GROUP_DESCRIPTIONS: Record<string, string> = {
  'Pusat': 'Titik-titik inti yang membentuk fondasi takdirmu',
  'Langit': 'Jalur Karakter & Potensi Spiritual Tertinggi',
  'Bumi': 'Jalur Finansial & Manifestasi Karma Duniawi',
  'Personal': 'Aspek Keseimbangan Energi Leluhur (Garis Langit & Bumi)',
};

export function MatrixScreen() {
  const colors = useThemeStore(state => state.getColors());
  const [selectedPoint, setSelectedPoint] = useState<DetailablePoint | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Pusat']));
  const [isExporting, setIsExporting] = useState(false);
  
  const diamondRef = useRef<DestinyDiamondHandle>(null);
  const matrix = useAppStore((state) => state.currentMatrix);

  const groupedPoints = useMemo(() => {
    if (!matrix) return {};
    const groups: Record<string, DestinyPoint[]> = {};
    const allPoints = Object.values(matrix.points);
    Object.entries(POINT_GROUPS).forEach(([groupName, keys]) => {
      groups[groupName] = allPoints.filter(point => keys.includes(point.key));
    });
    return groups;
  }, [matrix]);

  const stats = useMemo(() => {
    if (!matrix) return null;
    const allPoints = Object.values(matrix.points);
    const totalValue = allPoints.reduce((sum, p) => sum + p.value, 0);
    const avgValue = Math.round(totalValue / allPoints.length);
    // Safe check untuk element string agar tidak memicu runtime crash
    const elementStr = matrix.points.E?.arcana?.element || 'Earth';
    
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (!diamondRef.current) return;
      const uri = await diamondRef.current.exportAsImage();
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('⚠️ Tidak Didukung', 'Fitur berbagi tidak tersedia');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '💎 Bagikan Destiny Matrix',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('❌ Error', 'Gagal mengekspor diagram');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const dynamicStyles = useMemo(() => ({
    container: { flex: 1, backgroundColor: colors.background },
    headerGradient: {
      padding: SPACING.xl,
      paddingTop: SPACING.xxl,
      borderBottomLeftRadius: BORDER_RADIUS['3xl'],
      borderBottomRightRadius: BORDER_RADIUS['3xl'],
      marginBottom: SPACING.lg,
    },
    headerTitle: { fontSize: FONT_SIZE['3xl'], fontWeight: '800' as const, color: colors.text, marginBottom: SPACING.xs },
    headerSubtitle: { fontSize: FONT_SIZE.sm, color: colors.textSecondary, lineHeight: 20 },
    statsRow: { flexDirection: 'row' as const, gap: SPACING.sm, marginTop: SPACING.md },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface + '80',
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center' as const,
    },
    statNumber: { fontSize: FONT_SIZE.xxl, fontWeight: '800' as const, color: colors.primary },
    statLabel: { fontSize: FONT_SIZE.xs, color: colors.textSecondary, marginTop: 2, textAlign: 'center' as const },
    diamondCard: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS['2xl'],
      padding: SPACING.lg,
      margin: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...SHADOWS.lg,
    },
    diamondTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700' as const, color: colors.text, marginBottom: SPACING.sm },
    diamondHint: { fontSize: FONT_SIZE.xs, color: colors.textMuted, textAlign: 'center' as const, marginBottom: SPACING.md, fontStyle: 'italic' as const },
    exportButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: colors.backgroundLight,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      marginTop: SPACING.md,
      gap: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exportButtonText: { color: colors.textSecondary, fontSize: FONT_SIZE.md, fontWeight: '600' as const },
    groupCard: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      margin: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden' as const,
      ...SHADOWS.md,
    },
    groupHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: SPACING.lg,
    },
    groupHeaderActive: { borderBottomWidth: 1, borderBottomColor: colors.border },
    groupTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700' as const, color: colors.text, marginBottom: 2 },
    groupDescription: { fontSize: FONT_SIZE.xs, color: colors.textMuted },
    groupBadge: { backgroundColor: colors.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, marginRight: SPACING.sm },
    groupBadgeText: { fontSize: FONT_SIZE.xs, color: colors.primary, fontWeight: '600' as const },
    groupToggle: { fontSize: FONT_SIZE.lg, color: colors.textMuted, fontWeight: '600' as const },
    pointRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '50',
    },
    pointRowLast: { borderBottomWidth: 0 },
    pointKeyBadge: {
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS.lg,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: SPACING.md,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    pointKeyText: { fontSize: FONT_SIZE.md, fontWeight: '800' as const, color: colors.primary },
    pointInfo: { flex: 1 },
    pointLabel: { fontSize: FONT_SIZE.sm, color: colors.textSecondary, marginBottom: 2 },
    pointValueRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: SPACING.sm },
    pointValue: { fontSize: FONT_SIZE.md, fontWeight: '600' as const, color: colors.text },
    pointArcana: { fontSize: FONT_SIZE.sm, color: colors.primaryLight, fontWeight: '500' as const },
    pointArrow: { fontSize: FONT_SIZE.md, color: colors.textMuted },
    emptyContainer: { flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const, padding: SPACING.xl },
    emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
    emptyTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700' as const, color: colors.text, marginBottom: SPACING.sm },
    emptyText: { fontSize: FONT_SIZE.md, color: colors.textSecondary, textAlign: 'center' as const, lineHeight: 24, marginBottom: SPACING.xl },
    emptyButton: { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, paddingHorizontal: SPACING.xxl },
    emptyButtonText: { color: '#FFFFFF', fontSize: FONT_SIZE.md, fontWeight: '700' as const },
    instructionsCard: {
      backgroundColor: colors.backgroundLight + '80',
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      margin: SPACING.md,
      marginTop: 0,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed' as const,
    },
    instructionsText: { fontSize: FONT_SIZE.xs, color: colors.textMuted, textAlign: 'center' as const, lineHeight: 18 },
    
    // Additional card untuk Destinies
    destinySection: {
      margin: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS['2xl'],
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...SHADOWS.md,
    },
    destinyGrid: { marginTop: SPACING.md, gap: SPACING.sm },
    destinyRow: { 
      flexDirection: 'row' as const, 
      alignItems: 'center' as const, 
      backgroundColor: colors.backgroundLight + '60', 
      padding: SPACING.md, 
      borderRadius: BORDER_RADIUS.xl,
      borderWidth: 1,
      borderColor: colors.border + '30'
    },
    destinyValueBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: SPACING.md
    },
    lineBlock: {
      backgroundColor: colors.backgroundLight + '40',
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border + '30'
    },
    lineTitle: { fontWeight: '700' as const, color: colors.text, fontSize: 16, marginBottom: 4 }
  }), [colors]);

  if (!matrix) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.emptyContainer}>
          <Animated.View entering={FadeInDown.duration(800).springify()}>
            <Text style={dynamicStyles.emptyIcon}>💎</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(800)}>
            <Text style={dynamicStyles.emptyTitle}>Belum Ada Matriks</Text>
            <Text style={dynamicStyles.emptyText}>
              Hitung Destiny Matrix-mu di Beranda{'\n'}
              untuk melihat visualisasi peta takdir
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <TouchableOpacity style={dynamicStyles.emptyButton} activeOpacity={0.8}>
              <Text style={dynamicStyles.emptyButtonText}>✨ Hitung Matriks</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient colors={colors.gradients.headerGradient} style={dynamicStyles.headerGradient}>
            <Text style={dynamicStyles.headerTitle}>💎 Matriks Takdir</Text>
            <Text style={dynamicStyles.headerSubtitle}>Visualisasi peta takdir & titik-titik energi</Text>
            {stats && (
              <View style={dynamicStyles.statsRow}>
                <View style={dynamicStyles.statCard}>
                  <Text style={dynamicStyles.statNumber}>{stats.totalPoints}</Text>
                  <Text style={dynamicStyles.statLabel}>Titik Energi</Text>
                </View>
                <View style={dynamicStyles.statCard}>
                  <Text style={dynamicStyles.statNumber}>{stats.avgValue}</Text>
                  <Text style={dynamicStyles.statLabel}>Rata-rata Nilai</Text>
                </View>
                <View style={dynamicStyles.statCard}>
                  <Text style={dynamicStyles.statNumber}>{stats.dominantElement}</Text>
                  <Text style={dynamicStyles.statLabel}>Elemen Dominan</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Diamond Chart */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <View style={dynamicStyles.diamondCard}>
            <Text style={dynamicStyles.diamondTitle}>🔷 Diagram Matriks</Text>
            <Text style={dynamicStyles.diamondHint}>💡 Tap titik untuk melihat detail • Pinch untuk zoom</Text>
            <DestinyDiamond ref={diamondRef} matrix={matrix} onPointPress={handlePointPress} />
            <TouchableOpacity style={dynamicStyles.exportButton} onPress={handleExport} disabled={isExporting} activeOpacity={0.8}>
              {isExporting ? (
                <Text style={dynamicStyles.exportButtonText}>⏳ Mengekspor...</Text>
              ) : (
                <>
                  <Text>📤</Text>
                  <Text style={dynamicStyles.exportButtonText}>Bagikan Diagram Peta Takdir</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View entering={FadeIn.delay(400)}>
          <View style={dynamicStyles.instructionsCard}>
            <Text style={dynamicStyles.instructionsText}>
              🖐️ Gunakan dua jari untuk zoom & geser • Tap titik untuk lihat detail lengkap arcana
            </Text>
          </View>
        </Animated.View>

        {/* 🔥 NEW COMPONENT: Destiny Tiga Tahap */}
        {matrix.destinies && (
          <Animated.View entering={FadeInUp.delay(300)} style={dynamicStyles.destinySection}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>⏳ Tujuan Hidup Periodik</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Misi takdir transisi jiwa berdasarkan siklus umur</Text>
            
            <View style={dynamicStyles.destinyGrid}>
              <View style={dynamicStyles.destinyRow}>
                <View style={dynamicStyles.destinyValueBadge}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{matrix.destinies.personal}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.text, fontSize: 14 }}>Takdir Personal (Umur 20 - 40)</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>Membentuk kedewasaan mental ego batiniah diri sendiri.</Text>
                </View>
              </View>

              <View style={dynamicStyles.destinyRow}>
                <View style={dynamicStyles.destinyValueBadge}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{matrix.destinies.social}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.text, fontSize: 14 }}>Takdir Sosial (Umur 40 - 60)</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>Kontribusi silsilah keluarga, anak-cucu, dan komunitas sosial.</Text>
                </View>
              </View>

              <View style={dynamicStyles.destinyRow}>
                <View style={dynamicStyles.destinyValueBadge}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{matrix.destinies.spiritual}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.text, fontSize: 14 }}>Takdir Spiritual Global (&gt; 60)</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>Penyatuan energi murni kosmik menjelang masa tua senja.</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Grouped Points List */}
        {Object.entries(groupedPoints).map(([groupName, points], groupIndex) => {
          const isExpanded = expandedGroups.has(groupName);
          return (
            <Animated.View
              key={groupName}
              entering={SlideInRight.delay(400 + groupIndex * 100)}
              layout={Layout.springify()}
            >
              <View style={dynamicStyles.groupCard}>
                <TouchableOpacity
                  style={[dynamicStyles.groupHeader, isExpanded && dynamicStyles.groupHeaderActive]}
                  onPress={() => toggleGroup(groupName)}
                  activeOpacity={0.7}
                >
                  <View style={dynamicStyles.groupInfo}>
                    <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                      <Text style={dynamicStyles.groupTitle}>
                        {groupName === 'Pusat' && '🎯 '}
                        {groupName === 'Langit' && '⭐ '}
                        {groupName === 'Bumi' && '🌍 '}
                        {groupName === 'Personal' && '💫 '}
                        {groupName}
                      </Text>
                      <View style={dynamicStyles.groupBadge}>
                        <Text style={dynamicStyles.groupBadgeText}>{points.length} titik</Text>
                      </View>
                    </View>
                    <Text style={dynamicStyles.groupDescription}>{GROUP_DESCRIPTIONS[groupName]}</Text>
                  </View>
                  <Text style={dynamicStyles.groupToggle}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isExpanded && points.map((point, index) => (
                  <Animated.View key={point.key} entering={FadeInUp.delay(index * 50)}>
                    <TouchableOpacity
                      style={[dynamicStyles.pointRow, index === points.length - 1 && dynamicStyles.pointRowLast]}
                      activeOpacity={0.6}
                      onPress={() => handlePointPress(point as DetailablePoint)}
                    >
                      <View style={dynamicStyles.pointKeyBadge}>
                        <Text style={dynamicStyles.pointKeyText}>{point.key}</Text>
                      </View>
                      <View style={dynamicStyles.pointInfo}>
                        <Text style={dynamicStyles.pointLabel}>{point.label}</Text>
                        <View style={dynamicStyles.pointValueRow}>
                          <Text style={dynamicStyles.pointValue}>{point.value}</Text>
                          <Text style={dynamicStyles.pointArcana}>{point.arcana.card}</Text>
                        </View>
                      </View>
                      <Text style={dynamicStyles.pointArrow}>→</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          );
        })}

        {/* Named Lines Interpretation Card */}
        {matrix.namedLines && (
          <Animated.View entering={FadeInUp.delay(500)} style={{ margin: 16, backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, ...SHADOWS.md }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 }}>🔗 Analisis Garis Takdir Utama</Text>
            
            {/* Karmic Tail */}
            <View style={dynamicStyles.lineBlock}>
              <Text style={dynamicStyles.lineTitle}>🎭 Karmic Tail {matrix.namedLines.karmicTail.pattern}</Text>
              <Text style={{ fontWeight: '600', color: colors.primary, fontSize: 13, marginBottom: 4 }}>
                Kode Triad: {matrix.namedLines.karmicTail.title}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 6 }}>
                {matrix.namedLines.karmicTail.meaning}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, fontStyle: 'italic', opacity: 0.9 }}>
                💡 Solusi: {matrix.namedLines.karmicTail.resolution}
              </Text>
            </View>

            {/* Love Line */}
            <View style={dynamicStyles.lineBlock}>
              <Text style={dynamicStyles.lineTitle}>💖 Love Line</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 4 }}>
                {matrix.namedLines.loveLine.meaning}
              </Text>
              <Text style={{ color: colors.primaryLight, fontSize: 12, fontWeight: '600' }}>
                🔑 Pelajaran Inti: {matrix.namedLines.loveLine.keyLesson}
              </Text>
            </View>

            {/* Money Line */}
            <View style={[dynamicStyles.lineBlock, { marginBottom: 0 }]}>
              <Text style={dynamicStyles.lineTitle}>💰 Money Line</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 4 }}>
                {matrix.namedLines.moneyLine.meaning}
              </Text>
              <Text style={{ color: '#E2B842', fontSize: 12, fontWeight: '600' }}>
                💼 Nasihat Finansial: {matrix.namedLines.moneyLine.advice}
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <PointDetailModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
});
 