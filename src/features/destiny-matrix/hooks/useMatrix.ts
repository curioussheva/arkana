import { useState, useCallback, useMemo } from 'react';
import { Alert, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@store/app-store';

export function useMatrix() {
  const currentMatrix = useAppStore(state => state.currentMatrix);
  const activeProfileName = useAppStore(state => state.activeProfileName);
  
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = useCallback((groupKey: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  }, []);

  // Menghitung statistik ringkas untuk header komponen visual
  const matrixStats = useMemo(() => {
    if (!currentMatrix) return null;
    
    // Contoh kalkulasi aman nilai rata-rata dari 5 titik dasar utama takdir
    const { primaryPoints } = currentMatrix;
    const avgArcana = primaryPoints 
      ? Math.round((primaryPoints.A + primaryPoints.B + primaryPoints.C + primaryPoints.D + primaryPoints.E) / 5) 
      : 0;

    return {
      title: activeProfileName || 'Profil Utama',
      birthDate: currentMatrix.birthDate,
      averageValue: avgArcana,
    };
  }, [currentMatrix, activeProfileName]);

  const handleExportData = useCallback(async () => {
    if (!currentMatrix) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      await Share.share({
        title: `Destiny Matrix - ${activeProfileName}`,
        message: `Buku blueprint energi jiwaku berdasarkan skema kuno takdir Arkana Numerology. Tanggal Lahir: ${currentMatrix.birthDate}`,
      });
    } catch {
      Alert.alert('Gagal mengekspor', 'Terjadi kesalahan saat membagikan data matriks.');
    }
  }, [currentMatrix, activeProfileName]);

  return {
    matrix: currentMatrix,
    stats: matrixStats,
    expandedGroups,
    toggleGroup,
    handleExportData,
  };
}
