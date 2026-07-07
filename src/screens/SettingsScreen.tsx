// src/screens/SettingsScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { THEMES } from '@constants/themes';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { destinyCacheManager } from '@db/destiny-cache-manager';
import type { ThemeVariant } from '../types/theme';

// ─── Styles ───────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.md,
  },
  section: {
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  sectionDescription: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  modeBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  modeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  switchInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  switchLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: FONT_SIZE.xs,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  themeCard: {
    width: '31%',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  themePreview: {
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  themeIcon: {
    fontSize: 24,
  },
  selectedBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  themeName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  themeColors: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  detailCard: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  detailIcon: {
    fontSize: 32,
  },
  detailTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  detailDescription: {
    fontSize: FONT_SIZE.sm,
  },
  detailClose: {
    marginLeft: 'auto',
    padding: SPACING.sm,
  },
  detailCloseText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  detailInfo: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  detailInfoItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONT_SIZE.xs,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1.5,
    gap: SPACING.md,
  },
  dangerIcon: {
    fontSize: 24,
  },
  dangerContent: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.error,
  },
  dangerDescription: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  dangerAction: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    padding: SPACING.xl,
    fontSize: FONT_SIZE.xs,
    lineHeight: 20,
  },
});

// ─── Theme Detail Card ────────────────────────────────
function ThemeDetailCard({ 
  themeId, 
  onClose, 
  colors 
}: { 
  themeId: ThemeVariant; 
  onClose: () => void; 
  colors: ThemeColors;
}) {
  const theme = THEMES[themeId];
  const meta = theme.metadata;

  return (
    <BlurView intensity={20} style={styles.detailCard}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailIcon}>{meta.icon}</Text>
        <View>
          <Text style={[styles.detailTitle, { color: colors.text }]}>
            {theme.name}
          </Text>
          <Text style={[styles.detailDescription, { color: colors.textSecondary }]}>
            {meta.description}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.detailClose}>
          <Text style={[styles.detailCloseText, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.detailInfo}>
        <View style={styles.detailInfoItem}>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Planet</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{meta.planet}</Text>
        </View>
        <View style={styles.detailInfoItem}>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Kristal</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{meta.crystal}</Text>
        </View>
        <View style={styles.detailInfoItem}>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Mode</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {theme.mode === 'dark' ? '🌙 Gelap' : '☀️ Terang'}
          </Text>
        </View>
      </View>
    </BlurView>
  );
}

// ─── Main Screen ──────────────────────────────────────
export function SettingsScreen() {
 // const { width } = useWindowDimensions();
  const { currentTheme, setTheme, useSystemTheme, toggleUseSystemTheme, isDark } = useThemeStore();
  const resetStore = useAppStore((state) => state.reset);
  const [showThemeDetail, setShowThemeDetail] = useState<ThemeVariant | null>(null);
  
  const theme = THEMES[currentTheme];
  const colors = theme.colors;
  const themeEntries = Object.entries(THEMES) as [ThemeVariant, typeof theme][];
  
  const handleThemeSelect = useCallback((themeId: ThemeVariant) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTheme(themeId);
  }, [setTheme]);
  
  const handleClearCache = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      '🗑️ Hapus Cache',
      'Semua hasil Destiny Matrix yang tersimpan akan dihapus permanen. Anda perlu menghitung ulang.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await destinyCacheManager.clearAllCache();
              resetStore();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('✅ Berhasil', 'Cache berhasil dibersihkan.');
            } catch (err) {
              const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
              Alert.alert('❌ Gagal', message);
            }
          },
        },
      ]
    );
  }, [resetStore]);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={colors.gradients.headerGradient}
          style={styles.header}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            ⚙️ Pengaturan
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Sesuaikan pengalaman spiritual Anda
          </Text>
        </LinearGradient>
        
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🎨 Tema
              </Text>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                Pilih aura yang sesuai dengan energimu
              </Text>
            </View>
            <View style={[styles.modeBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.modeText, { color: colors.primary }]}>
                {isDark() ? '🌙 Dark' : '☀️ Light'}
              </Text>
            </View>
          </View>
          
          <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                📱 Ikuti Tema Sistem
              </Text>
              <Text style={[styles.switchDescription, { color: colors.textMuted }]}>
                Otomatis sesuai pengaturan perangkat
              </Text>
            </View>
            <Switch
              value={useSystemTheme}
              onValueChange={toggleUseSystemTheme}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={useSystemTheme ? colors.primary : colors.textSecondary}
            />
          </View>
          
          <View style={styles.themeGrid}>
            {themeEntries.map(([themeId, themeData]) => {
              const isSelected = currentTheme === themeId;
              const themeColors = themeData.colors;
              
              return (
                <TouchableOpacity
                  key={themeId}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: themeColors.backgroundLight,
                      borderColor: isSelected ? themeColors.primary : 'transparent',
                      borderWidth: isSelected ? 2 : 0,
                    },
                  ]}
                  onPress={() => handleThemeSelect(themeId)}
                  onLongPress={() => setShowThemeDetail(themeId)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={themeColors.gradients.cardGradient}
                    style={styles.themePreview}
                  >
                    <Text style={styles.themeIcon}>
                      {themeData.metadata.icon}
                    </Text>
                    {isSelected && (
                      <View style={[styles.selectedBadge, { backgroundColor: themeColors.primary }]}>
                        <Text style={styles.selectedText}>✓</Text>
                      </View>
                    )}
                  </LinearGradient>
                  
                  <Text style={[styles.themeName, { color: themeColors.text }]} numberOfLines={1}>
                    {themeData.name}
                  </Text>
                  
                  <View style={styles.themeColors}>
                    {[
                      themeColors.primary,
                      themeColors.secondary,
                      themeColors.accent,
                      themeColors.text,
                    ].map((color, i) => (
                      <View
                        key={i}
                        style={[styles.colorDot, { backgroundColor: color }]}
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {showThemeDetail && (
            <ThemeDetailCard
              themeId={showThemeDetail}
              onClose={() => setShowThemeDetail(null)}
              colors={colors}
            />
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            ℹ️ Tentang
          </Text>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Versi</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Dibuat dengan</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>❤️ & ✨</Text>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            💾 Data
          </Text>
          
          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: colors.error }]}
            onPress={handleClearCache}
            activeOpacity={0.8}
          >
            <Text style={styles.dangerIcon}>⚠️</Text>
            <View style={styles.dangerContent}>
              <Text style={styles.dangerTitle}>Hapus Semua Cache</Text>
              <Text style={[styles.dangerDescription, { color: colors.textMuted }]}>
                Hapus hasil kalkulasi yang tersimpan
              </Text>
            </View>
            <Text style={[styles.dangerAction, { color: colors.error }]}>→</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.footer, { color: colors.textMuted }]}>
          Arkana Numerology Engine {'\n'}
          Made with mystical energy ✨
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}