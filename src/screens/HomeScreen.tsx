// src/screens/HomeScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { useDestinyMatrix } from '@hooks/use-destiny-matrix';
import { profileManager } from '@db/profile-manager';
import { formatDate, parseDate } from '@core/utils/date-utils';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { DestinyProfile } from '@db/profile-schema';
import type { DestinyMatrixInput } from '@core/destiny-matrix/types';
import type { MainTabParamList } from '../navigation/AppNavigator';

const ID_DATE_FORMAT = 'dd/MM/yyyy';
const DATE_FORMAT = 'yyyy-MM-dd';

export function HomeScreen() {
  const colors = useThemeStore(state => state.getColors());
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  const [birthDateInput, setBirthDateInput] = useState('');
  const [profiles, setProfiles] = useState<DestinyProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDate, setNewProfileDate] = useState('');
  const [showNewProfileInput, setShowNewProfileInput] = useState(false);

  const { calculate, isLoading, error } = useDestinyMatrix();
  const activeProfileId = useAppStore(state => state.activeProfileId);
  const setActiveProfile = useAppStore(state => state.setActiveProfile);

  const loadProfiles = useCallback(async () => {
    const list = await profileManager.listProfiles();
    setProfiles(list);
    if (activeProfileId && activeProfileId !== 'default') {
      setSelectedProfileId(activeProfileId);
      const activeProf = list.find(p => p.id === activeProfileId);
      if (activeProf) {
        setBirthDateInput(formatDate(parseDate(activeProf.birthDate, DATE_FORMAT) || new Date(), ID_DATE_FORMAT));
      }
    }
  }, [activeProfileId]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const formatDateText = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return formatted;
  };

  const handleCalculate = useCallback(async () => {
    if (!birthDateInput.trim()) {
      Alert.alert('Input Diperlukan', 'Masukkan tanggal lahir terlebih dahulu.');
      return;
    }
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(birthDateInput)) {
      Alert.alert('Format Salah', 'Gunakan format DD/MM/YYYY');
      return;
    }
    const parsed = parseDate(birthDateInput, ID_DATE_FORMAT);
    if (!parsed) {
      Alert.alert('Tanggal Tidak Valid', 'Pastikan kalender tanggal lahir benar.');
      return;
    }

    const input: DestinyMatrixInput = {
      birthDate: formatDate(parsed, DATE_FORMAT),
    };

    try {
      await calculate(input, selectedProfileId ?? 'default');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('Matrix');
    } catch {
      Alert.alert('Error', error || 'Gagal menghitung matriks');
    }
  }, [birthDateInput, selectedProfileId, calculate, error, navigation]);

  const handleCreateProfile = async () => {
    if (!newProfileName.trim() || !newProfileDate.trim()) {
      Alert.alert('Data Tidak Lengkap', 'Nama dan tanggal lahir wajib diisi.');
      return;
    }
    const parsed = parseDate(newProfileDate, ID_DATE_FORMAT);
    if (!parsed) {
      Alert.alert('Tanggal Tidak Valid', 'Gunakan format DD/MM/YYYY');
      return;
    }
    try {
      const profile = await profileManager.createProfile(
        newProfileName.trim(),
        formatDate(parsed, DATE_FORMAT)
      );
      setActiveProfile(profile.id, profile.name);
      setSelectedProfileId(profile.id);
      setBirthDateInput(newProfileDate);
      loadProfiles();
      setShowNewProfileInput(false);
      setNewProfileName('');
      setNewProfileDate('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Error', 'Gagal membuat profil baru');
    }
  };

  const handleDeleteProfile = (profile: DestinyProfile) => {
    Alert.alert('Hapus Profil', `Apakah Anda yakin ingin menghapus profil "${profile.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await profileManager.deleteProfile(profile.id);
          if (selectedProfileId === profile.id) {
            setSelectedProfileId(null);
            setBirthDateInput('');
          }
          loadProfiles();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <LinearGradient colors={colors.gradients.headerGradient} style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>🔮 Destiny Matrix</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Temukan blueprint takdir kuno dan potensi esensi jiwamu
          </Text>
        </LinearGradient>

        {/* Main Interactive Card Form */}
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
            <View>
              <Text style={[styles.profileSelectorMainText, { color: selectedProfileId ? colors.text : colors.textMuted }]}>
                {selectedProfileId
                  ? profiles.find(p => p.id === selectedProfileId)?.name || 'Profil Utama'
                  : '🌟 Profil Utama (Default)'}
              </Text>
            </View>
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

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleCalculate}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Menghitung Matrix...' : '✨ Hitung Matriks'}</Text>
          </TouchableOpacity>
        </View>

        {/* Create Profile Trigger Link */}
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
      </ScrollView>

      {/* Modal: Select Profile */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Pilih Profil Jiwa</Text>
            
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.profileItem, !selectedProfileId && { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }, { borderColor: colors.border }]}
                onPress={() => {
                  setSelectedProfileId(null);
                  setShowProfileModal(false);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.profileItemName, { color: colors.text, fontWeight: '700' }]}>🌟 Profil Utama (Default)</Text>
                  <Text style={{ color: colors.textMuted, fontSize: FONT_SIZE.xs }}>Gunakan tanpa basis data eksternal</Text>
                </View>
              </TouchableOpacity>

              {profiles.map(profile => (
                <TouchableOpacity
                  key={profile.id}
                  style={[styles.profileItem, selectedProfileId === profile.id && { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }, { borderColor: colors.border }]}
                  onPress={() => {
                    setSelectedProfileId(profile.id);
                    const parsed = parseDate(profile.birthDate, DATE_FORMAT);
                    if (parsed) setBirthDateInput(formatDate(parsed, ID_DATE_FORMAT));
                    setShowProfileModal(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.profileItemName, { color: colors.text }]}>{profile.name}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: FONT_SIZE.xs }}>
                      {formatDate(parseDate(profile.birthDate, DATE_FORMAT) || new Date(), ID_DATE_FORMAT)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteAction}
                    onPress={() => handleDeleteProfile(profile)}
                  >
                    <Text style={{ color: colors.error, fontSize: FONT_SIZE.md }}>🗑️</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.backgroundLight }]}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Create Profile */}
      <Modal visible={showNewProfileInput} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Buat Profil Baru</Text>
            
            <Text style={[styles.label, { color: colors.textSecondary }]}>Nama Lengkap / Alias</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.backgroundLight, color: colors.text, borderColor: colors.border }]}
              value={newProfileName}
              onChangeText={setNewProfileName}
              placeholder="Masukkan nama pemilik energi"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Tanggal Lahir</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.backgroundLight, color: colors.text, borderColor: colors.border }]}
              value={newProfileDate}
              onChangeText={(text) => setNewProfileDate(formatDateText(text))}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={10}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary, marginTop: SPACING.sm }]}
              onPress={handleCreateProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Simpan Profil Esensi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.backgroundLight, marginTop: SPACING.sm }]}
              onPress={() => setShowNewProfileInput(false)}
            >
              <Text style={{ color: colors.textSecondary }}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
  formCard: {
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.md,
  },
  label: { fontSize: FONT_SIZE.xs, fontWeight: '700', marginBottom: SPACING.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
  },
  profileSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  profileSelectorMainText: { fontSize: FONT_SIZE.md, fontWeight: '600' },
  button: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  buttonText: { color: '#FFFFFF', fontSize: FONT_SIZE.md, fontWeight: '700' },
  linkButton: { alignItems: 'center', marginTop: SPACING.lg, paddingVertical: SPACING.sm },
  linkText: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.md, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.lg,
  },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '800', marginBottom: SPACING.lg, textAlign: 'center' },
  modalList: { maxHeight: 300, marginBottom: SPACING.md },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  profileItemName: { fontSize: FONT_SIZE.md, fontWeight: '600' },
  deleteAction: { padding: SPACING.sm, marginLeft: SPACING.sm },
  modalCloseButton: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, alignItems: 'center' },
});
 