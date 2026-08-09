// src/features/destiny-matrix/hooks/useMatrix.ts

import { useState, useCallback, useMemo } from 'react';
import { Alert, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppStore, selectMatrix, selectActiveProfileName } from '@store/app-store';
import type { DestinyPointKey } from '@core/destiny-matrix/types';

export function useMatrix() {
  const currentMatrix = useAppStore(selectMatrix);
  const activeProfileName = useAppStore(selectActiveProfileName);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Toggle ekspansi grup UI dengan haptik aman
  const toggleGroup = useCallback((groupKey: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      // Mengabaikan error jika perangkat tidak mendukung efek haptik
    });
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  }, []);

  // Menghitung statistik ringkas untuk header komponen visual
  const matrixStats = useMemo(() => {
    if (!currentMatrix || !currentMatrix.points) return null;

    const primaryKeys: DestinyPointKey[] = ['A', 'B', 'C', 'D', 'E'];
    const values = primaryKeys.map(key => currentMatrix.points[key]?.value ?? 0);

    const validValues = values.filter(val => typeof val === 'number' && !isNaN(val));
    const avgArcana = validValues.length
      ? Math.round(validValues.reduce((sum, v) => sum + v, 0) / validValues.length)
      : 0;

    const birthDate =
      currentMatrix.input?.birthDate ?? currentMatrix.birthDate ?? 'Tanggal tidak diketahui';
    const karmicTailCode = currentMatrix.karmicTailCode ?? 'N/A';

    return {
      title: activeProfileName || 'Profil Utama',
      birthDate,
      averageValue: avgArcana,
      karmicTailCode,
      personalDestiny: currentMatrix.destinies?.personal ?? 0,
    };
  }, [currentMatrix, activeProfileName]);

  // Handler ekspor/berbagi blueprint takdir
  const handleExportData = useCallback(async () => {
    if (!currentMatrix) {
      Alert.alert('Data Tidak Tersedia', 'Belum ada data matriks takdir yang dikalkulasi.');
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      const profile = activeProfileName || 'Profil Utama';
      const birthDate = currentMatrix.input?.birthDate ?? currentMatrix.birthDate ?? '???';
      const karmicCode = currentMatrix.karmicTailCode
        ? `\nPola Ekor Karma: ${currentMatrix.karmicTailCode}`
        : '';

      const shareMessage =
        `✨ Destiny Matrix - Blueprint Energi Jiwa (${profile})\n` +
        `📅 Tanggal Lahir: ${birthDate}` +
        `${karmicCode}\n\n` +
        `Dihitung berdasarkan analisis presisi Arcana Numerology Natalia Ladini.`;

      await Share.share({
        title: `Destiny Matrix - ${profile}`,
        message: shareMessage,
      });
    } catch (err) {
      console.warn('[useMatrix] Gagal membagikan data matriks:', err);
      Alert.alert('Gagal Mengekspor', 'Terjadi kesalahan saat membagikan blueprint data matriks.');
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
