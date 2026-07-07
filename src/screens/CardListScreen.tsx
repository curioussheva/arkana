// src/screens/CardListScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@store/theme-store';
import { getArkanaByNumber } from '@core/numerology/arkana';
import { getArkanaImage } from '@constants/arkana-images';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

// Import Modal Detail yang sudah diperbaiki sebelumnya
import { PointDetailModal, type DetailablePoint } from '@components/ui/PointDetailModal';

const MAJOR_ARCANA = Array.from({ length: 22 }, (_, i) => getArkanaByNumber(i));

export function CardListScreen() {
  const colors = useThemeStore(state => state.getColors());
  const { width } = useWindowDimensions();
  
  // State untuk mengontrol data modal yang aktif
  const [selectedPoint, setSelectedPoint] = useState<DetailablePoint | null>(null);

  const numColumns = width > 400 ? 3 : 2;
  const cardWidth = (width - SPACING.md * (numColumns + 1)) / numColumns;

  // Fungsi saat kartu ditekan untuk memicu modal muncul
  const handleCardPress = (item: any) => {
    setSelectedPoint({
      key: item.number.toString(), // Menggunakan nomor arcananya sebagai Key Badge
      label: 'Major Arcana',       // Label info atas modal
      value: item.number,          // Nilai numerologi/nomor kartu
      arcana: item,                // Seluruh object data ArkanaInfo bawaan kartu
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={MAJOR_ARCANA}
        keyExtractor={item => item.card}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const image = getArkanaImage(item.card);
          return (
            /* Membungkus item dengan TouchableOpacity agar bisa ditap */
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => handleCardPress(item)}
              style={[styles.card, { width: cardWidth, backgroundColor: colors.surface }]}
            >
              {image && (
                <Image 
                  source={image} 
                  style={[styles.image, { width: cardWidth - 16, height: (cardWidth - 16) / 0.6 }]} 
                  resizeMode="contain" 
                />
              )}
              <Text style={[styles.cardNumber, { color: colors.primary }]}>#{item.number}</Text>
              <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>{item.card}</Text>
              <Text style={[styles.keywords, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.keywords.slice(0, 3).join(', ')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Tampilkan modal secara kondisional tepat di bawah list */}
      <PointDetailModal 
        point={selectedPoint} 
        onClose={() => setSelectedPoint(null)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: SPACING.sm },
  row: { gap: SPACING.sm, marginBottom: SPACING.sm },
  card: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  image: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xs,
  },
  cardNumber: { fontSize: FONT_SIZE.xs, fontWeight: '700', marginBottom: 2 },
  cardName: { fontSize: FONT_SIZE.sm, fontWeight: '600', textAlign: 'center' },
  keywords: { fontSize: 10, textAlign: 'center', marginTop: 2 },
});
 