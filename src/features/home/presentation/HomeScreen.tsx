// src/features/home/HomeScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useThemeStore } from '@store/theme-store';
import { useDestinyMatrix } from '@hooks/useDestinyMatrix';
import { formatDate, parseDate } from '@core/utils/date-utils';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { DestinyMatrixInput } from '@core/destiny-matrix/types';
import type { MainTabParamList } from '@navigation/AppNavigator';
import { useProfileList } from '../hooks/useProfileList';
import { SelectProfileModal } from '../components/SelectProfileModal';
import { CreateProfileModal } from '../components/CreateProfileModal';
import { destinyCacheManager } from '@db/destiny-cache-manager';

export function HomeScreen() {
  const colors = useThemeStore(state => state.getColors());
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  // ─── State & Hooks ─────────────────────────────────
  const [birthDateInput, setBirthDateInput] = useState(''); // diset hanya dari profil
  const [isCheckingCache, setIsCheckingCache] = useState(false);
  const [isMatrixCached, setIsMatrixCached] = useState(false);

  const { calculate, isLoading, error } = useDestinyMatrix();

  const {
    profiles,
    selectedProfileId,
    showProfileModal,
    setShowProfileModal,
    showNewProfileInput,
    setShowNewProfileInput,
    newProfileName,
    setNewProfileName,
    newProfileDate,
    setNewProfileDate,
    handleSelectProfile,
    handleCreateProfile,
    handleDeleteProfile,
  } = useProfileList(setBirthDateInput); // hook menerima setter untuk mengisi tanggal

  // ─── Profil aktif ──────────────────────────────────
  const activeProfile = profiles.find(p => p.id === selectedProfileId);
  const isDefaultProfile = !selectedProfileId || selectedProfileId === 'default';
  const profileDisplayName = activeProfile?.name ?? 'Profil Utama';

  // ─── Sinkronisasi tanggal dari profil ─────────────
  useEffect(() => {
    if (activeProfile) {
      const formatted = formatDate(new Date(activeProfile.birthDate), 'dd/MM/yyyy');
      setBirthDateInput(formatted);
    } else {
      setBirthDateInput(''); // tidak ada profil -> tidak ada tanggal
    }
  }, [activeProfile]);

  // ─── Cek cache matrix ──────────────────────────────
  const checkCache = useCallback(async () => {
    if (!activeProfile || !birthDateInput) {
      setIsMatrixCached(false);
      return;
    }
    try {
      setIsCheckingCache(true);
      const cached = await destinyCacheManager.getCachedMatrix(
        selectedProfileId ?? 'default',
        activeProfile.birthDate
      );
      setIsMatrixCached(!!cached);
    } catch {
      setIsMatrixCached(false);
    } finally {
      setIsCheckingCache(false);
    }
  }, [activeProfile, birthDateInput, selectedProfileId]);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  // ─── Kalkulasi / Lihat Matriks ────────────────────
  const handleCalculate = useCallback(async () => {
    if (!birthDateInput) {
      // Seharusnya tidak terjadi karena tombol sudah disabled
      return;
    }

    const parsed = parseDate(birthDateInput, 'dd/MM/yyyy');
    if (!parsed) {
      Alert.alert('Tanggal Tidak Valid', 'Silakan periksa kembali profil yang dipilih.');
      return;
    }

    if (isMatrixCached) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate('Matrix');
      return;
    }

    const input: DestinyMatrixInput = { birthDate: formatDate(parsed, 'yyyy-MM-dd') };

    try {
      await calculate(input, selectedProfileId ?? 'default');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('Matrix');
    } catch {
      Alert.alert('Error', error || 'Gagal menghitung matriks');
    }
  }, [birthDateInput, isMatrixCached, selectedProfileId, calculate, error, navigation]);

  // ─── Tombol utama ─────────────────────────────────
  const renderMainAction = () => {
    // Jika belum ada tanggal sama sekali → ajak buat profil
    if (!birthDateInput) {
      return (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setNewProfileDate(''); // kosongkan dulu
            setNewProfileName('');
            setShowNewProfileInput(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>➕ Buat Profil Baru</Text>
        </TouchableOpacity>
      );
    }

    // Jika tanggal sudah ada → tombol aksi (cache / hitung)
    if (isCheckingCache) {
      return <ActivityIndicator color={colors.primary} style={{ marginTop: SPACING.md }} />;
    }

    return (
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isMatrixCached ? colors.success : colors.primary },
        ]}
        onPress={handleCalculate}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Menghitung...' : isMatrixCached ? '📖 Lihat Matriks' : '✨ Hitung Matriks'}
        </Text>
      </TouchableOpacity>
    );
  };

  // ─── Render ────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={colors.gradients.headerGradient} style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>🔮 Destiny Matrix</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Temukan blueprint takdir kuno dan potensi esensi jiwamu
          </Text>
        </LinearGradient>

        {/* Kartu Profil */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.profileCardTop}>
            <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>PROFIL AKTIF</Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowProfileModal(true);
              }}
              style={styles.profileSwitchButton}
            >
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>
                {profiles.length > 0 ? 'Ganti' : 'Pilih'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.profileName, { color: colors.text }]}>{profileDisplayName}</Text>

          <View style={styles.profileDateRow}>
            <Text style={[styles.profileDateLabel, { color: colors.textSecondary }]}>📅</Text>
            <Text style={[styles.profileDateValue, { color: colors.text }]}>
              {birthDateInput || 'Belum diatur'}
            </Text>
          </View>

          {!isDefaultProfile && (
            <View style={styles.cacheStatus}>
              <Text
                style={{ color: isMatrixCached ? colors.success : colors.textMuted, fontSize: 11 }}
              >
                {isMatrixCached ? '✅ Matriks tersedia' : '⏳ Belum dihitung'}
              </Text>
            </View>
          )}
        </View>

        {/* Link sekunder (tetap bisa untuk menambah profil meskipun sudah ada) */}
        {birthDateInput ? (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setNewProfileDate('');
              setNewProfileName('');
              setShowNewProfileInput(true);
            }}
            activeOpacity={0.6}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>+ Buat Profil Baru</Text>
          </TouchableOpacity>
        ) : null}

        {/* Area aksi utama */}
        <View style={styles.actionContainer}>{renderMainAction()}</View>

        {/* Dashboard Hub Energi */}
        <View style={styles.dashboardSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hub Energi Jiwa</Text>
          <View style={styles.widgetRow}>
            <TouchableOpacity
              style={[
                styles.widgetCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => navigation.navigate('DailyCard')}
              activeOpacity={0.7}
            >
              <Text style={styles.widgetIcon}>🃏</Text>
              <Text style={[styles.widgetTitle, { color: colors.text }]}>Kartu Harian</Text>
              <Text style={[styles.widgetDesc, { color: colors.textMuted }]}>
                Ramalan esensi arketipe makrokosmos hari ini
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.widgetCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => navigation.navigate('Timeline')}
              activeOpacity={0.7}
            >
              <Text style={styles.widgetIcon}>⏳</Text>
              <Text style={[styles.widgetTitle, { color: colors.text }]}>Tahun Personal</Text>
              <Text style={[styles.widgetDesc, { color: colors.textMuted }]}>
                Navigasi peta siklus numerologi tahun berjalan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <SelectProfileModal
        visible={showProfileModal}
        profiles={profiles}
        selectedId={selectedProfileId}
        onSelect={handleSelectProfile}
        onDelete={handleDeleteProfile}
        onClose={() => setShowProfileModal(false)}
        colors={colors}
      />

      <CreateProfileModal
        visible={showNewProfileInput}
        name={newProfileName}
        date={newProfileDate}
        onNameChange={setNewProfileName}
        onDateChange={setNewProfileDate}
        onSave={handleCreateProfile}
        onClose={() => setShowNewProfileInput(false)}
        colors={colors}
      />
    </SafeAreaView>
  );
}

// ─── Styles (tidak banyak berubah) ────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: SPACING.xxl },
  header: {
    padding: SPACING.lg,
    paddingTop: 52,
    borderBottomLeftRadius: BORDER_RADIUS['3xl'],
    borderBottomRightRadius: BORDER_RADIUS['3xl'],
    marginBottom: SPACING.xl,
  },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: '800', marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
  profileCard: {
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.md,
    marginBottom: SPACING.md,
  },
  profileCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  profileLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileSwitchButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  profileName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  profileDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDateLabel: { fontSize: FONT_SIZE.sm, marginRight: 8 },
  profileDateValue: { fontSize: FONT_SIZE.sm, fontWeight: '500', flex: 1 },
  cacheStatus: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
  },
  actionContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  button: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  buttonText: { color: '#FFFFFF', fontSize: FONT_SIZE.md, fontWeight: '700' },
  dashboardSection: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', marginBottom: SPACING.md },
  widgetRow: { flexDirection: 'row', gap: SPACING.md },
  widgetCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  widgetIcon: { fontSize: 24, marginBottom: SPACING.xs },
  widgetTitle: { fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: 4 },
  widgetDesc: { fontSize: 11, lineHeight: 14 },
  linkButton: { alignItems: 'center', marginTop: SPACING.sm, paddingVertical: SPACING.lg },
  linkText: { fontSize: FONT_SIZE.md, fontWeight: '900' },
});
