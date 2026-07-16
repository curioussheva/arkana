import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
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

// Impor Infrastruktur Fitur Baru
import { useProfileList } from '../hooks/useProfileList';
// If it's a default export, remove the curly braces:
import { SelectProfileModal } from '../components/SelectProfileModal';

 
import { CreateProfileModal } from '../components/CreateProfileModal';

export function HomeScreen() {
  console.log("👉 Sub-components checking:", { 
    SelectProfileModal, 
    CreateProfileModal, 
    useProfileList 
  });
  const colors = useThemeStore(state => state.getColors());
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const [birthDateInput, setBirthDateInput] = useState('');

  const { calculate, isLoading, error } = useDestinyMatrix();
  
  // Mengintegrasikan Custom Hooks
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
  } = useProfileList(setBirthDateInput);

  const formatDateText = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleCalculate = useCallback(async () => {
    if (!birthDateInput.trim()) {
      Alert.alert('Input Diperlukan', 'Masukkan tanggal lahir terlebih dahulu.');
      return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDateInput)) {
      Alert.alert('Format Salah', 'Gunakan format DD/MM/YYYY');
      return;
    }
    const parsed = parseDate(birthDateInput, 'dd/MM/yyyy');
    if (!parsed) {
      Alert.alert('Tanggal Tidak Valid', 'Pastikan kalender tanggal lahir benar.');
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
  }, [birthDateInput, selectedProfileId, calculate, error, navigation]);

  const activeProfileName = profiles.find(p => p.id === selectedProfileId)?.name || '🌟 Profil Utama (Default)';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <LinearGradient colors={colors.gradients.headerGradient} style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>🔮 Destiny Matrix</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Temukan blueprint takdir kuno dan potensi esensi jiwamu
          </Text>
        </LinearGradient>

        {/* Form Komponen Utama */}
        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>👤 Profil Aktif</Text>
          <TouchableOpacity
            style={[styles.profileSelector, { backgroundColor: colors.backgroundLight, borderColor: colors.border }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowProfileModal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.profileSelectorMainText, { color: colors.text }]}>{activeProfileName}</Text>
            <Text style={{ color: colors.primary, fontSize: FONT_SIZE.xs }}>▼</Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: colors.textSecondary }]}>📅 Tanggal Lahir</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundLight, color: colors.text, borderColor: colors.border }]}
            value={birthDateInput}
            onChangeText={(text) => setBirthDateInput(formatDateText(text))}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={10}
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCalculate} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{isLoading ? 'Menghitung Matrix...' : '✨ Hitung Matriks'}</Text>
          </TouchableOpacity>
        </View>

        {/* Modul Hub Tautan Cepat */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowNewProfileInput(true);
          }}
          activeOpacity={0.6}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>+ Buat Manifes Profil Baru</Text>
        </TouchableOpacity>

        {/* ─── FITUR BARU: PANEL DASHBOARD INTEGRASI (Saran Perbaikan UX) ─── */}
        {birthDateInput.length === 10 && (
          <View style={styles.dashboardSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hub Energi Jiwa</Text>
            
            <View style={styles.widgetRow}>
              {/* Widget Kartu Harian */}
              <TouchableOpacity 
                style={[styles.widgetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation.navigate('DailyCard')}
              >
                <Text style={styles.widgetIcon}>🃏</Text>
                <Text style={[styles.widgetTitle, { color: colors.text }]}>Kartu Harian</Text>
                <Text style={[styles.widgetDesc, { color: colors.textMuted }]}>Ramalan esensi arketipe makrokosmos hari ini</Text>
              </TouchableOpacity>

              {/* Widget Siklus Tahun */}
              <TouchableOpacity 
                style={[styles.widgetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Timeline')}
              >
                <Text style={styles.widgetIcon}>⏳</Text>
                <Text style={[styles.widgetTitle, { color: colors.text }]}>Tahun Personal</Text>
                <Text style={[styles.widgetDesc, { color: colors.textMuted }]}>Navigasi peta siklus numerologi tahun berjalan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Sub-Komponen Terisolasi */}
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
        formatDateText={formatDateText}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: SPACING.xxl },
  header: { padding: SPACING.lg, paddingTop: 52, borderBottomLeftRadius: BORDER_RADIUS['3xl'], borderBottomRightRadius: BORDER_RADIUS['3xl'], marginBottom: SPACING.xl },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: '800', marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT_SIZE.sm, lineHeight: 20 },
  formCard: { marginHorizontal: SPACING.md, borderRadius: BORDER_RADIUS['2xl'], padding: SPACING.lg, borderWidth: 1, ...SHADOWS.md },
  label: { fontSize: FONT_SIZE.xs, fontWeight: '700', marginBottom: SPACING.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, fontSize: FONT_SIZE.md, marginBottom: SPACING.md, borderWidth: 1.5 },
  profileSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, borderWidth: 1.5, marginBottom: SPACING.md },
  profileSelectorMainText: { fontSize: FONT_SIZE.md, fontWeight: '600' },
  button: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.xs },
  buttonText: { color: '#FFFFFF', fontSize: FONT_SIZE.md, fontWeight: '700' },
  linkButton: { alignItems: 'center', marginTop: SPACING.lg, paddingVertical: SPACING.sm },
  linkText: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  
  // Dashboard Styles
  dashboardSection: { marginTop: SPACING.xl, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', marginBottom: SPACING.md },
  widgetRow: { flexDirection: 'row', gap: SPACING.md },
  widgetCard: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, ...SHADOWS.sm },
  widgetIcon: { fontSize: 24, marginBottom: SPACING.xs },
  widgetTitle: { fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: 4 },
  widgetDesc: { fontSize: 11, lineHeight: 14 },
});
