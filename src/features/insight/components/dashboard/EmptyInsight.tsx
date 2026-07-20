// src/features/insight/components/dashboard/EmptyInsight.tsx
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { EmptyState } from '@components/ui/EmptyState';
import type { MainTabParamList } from '@navigation/AppNavigator';

export function EmptyInsight() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <EmptyState
      icon="🔮"
      title="Belum Ada Insight"
      description={'Hitung Destiny Matrix terlebih dahulu\nuntuk membuka analisis spiritual, energi,\nchakra, serta blueprint perjalanan jiwamu.'}
      actionLabel="Ke Beranda"
      onAction={() => navigation.navigate('Home')}
    />
  );
}

export default EmptyInsight;