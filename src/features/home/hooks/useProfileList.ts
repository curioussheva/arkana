import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { profileManager } from '@db/profile-manager';
import { useAppStore } from '@store/app-store';
import { formatDate, parseDate } from '@core/utils/date-utils';
import type { DestinyProfile } from '@db/profile-schema';

const ID_DATE_FORMAT = 'dd/MM/yyyy';
const DATE_FORMAT = 'yyyy-MM-dd';

export function useProfileList(onProfileSelected: (dateStr: string) => void) {
  const [profiles, setProfiles] = useState<DestinyProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNewProfileInput, setShowNewProfileInput] = useState(false);
  
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDate, setNewProfileDate] = useState('');

  const activeProfileId = useAppStore(state => state.activeProfileId);
  const setActiveProfile = useAppStore(state => state.setActiveProfile);

  const loadProfiles = useCallback(async () => {
    try {
      const list = await profileManager.listProfiles();
      setProfiles(list);
      if (activeProfileId && activeProfileId !== 'default') {
        setSelectedProfileId(activeProfileId);
        const activeProf = list.find(p => p.id === activeProfileId);
        if (activeProf) {
          onProfileSelected(formatDate(parseDate(activeProf.birthDate, DATE_FORMAT) || new Date(), ID_DATE_FORMAT));
        }
      }
    } catch (err) {
      console.error('Gagal memuat profil:', err);
    }
  }, [activeProfileId, onProfileSelected]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleSelectProfile = useCallback((profileId: string | null) => {
    setSelectedProfileId(profileId);
    if (!profileId) {
      onProfileSelected('');
    } else {
      const profile = profiles.find(p => p.id === profileId);
      const parsed = profile ? parseDate(profile.birthDate, DATE_FORMAT) : null;
      if (parsed) onProfileSelected(formatDate(parsed, ID_DATE_FORMAT));
    }
    setShowProfileModal(false);
  }, [profiles, onProfileSelected]);

  const handleCreateProfile = useCallback(async () => {
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
      onProfileSelected(newProfileDate);
      await loadProfiles();
      setShowNewProfileInput(false);
      setNewProfileName('');
      setNewProfileDate('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Error', 'Gagal membuat profil baru');
    }
  }, [newProfileName, newProfileDate, setActiveProfile, onProfileSelected, loadProfiles]);

  const handleDeleteProfile = useCallback((profile: DestinyProfile) => {
    Alert.alert('Hapus Profil', `Apakah Anda yakin ingin menghapus profil "${profile.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await profileManager.deleteProfile(profile.id);
            if (selectedProfileId === profile.id) {
              setSelectedProfileId(null);
              onProfileSelected('');
            }
            await loadProfiles();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch {
            Alert.alert('Error', 'Gagal menghapus profil');
          }
        },
      },
    ]);
  }, [selectedProfileId, onProfileSelected, loadProfiles]);

  return {
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
  };
}
