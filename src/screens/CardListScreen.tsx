import React, { useState } from 'react';
import { Text, StyleSheet, FlatList, Image, useWindowDimensions, TouchableOpacity, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@store/theme-store';
import { getArcanaByNumber } from '@core/arcana';
import { getArcanaImage } from '@constants/arcana-images';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { ArcanaDefinition } from '@core/arcana/types';

// Import Modal Detail yang sudah diperbaiki sebelumnya
import { PointDetailModal, type DetailablePoint } from '@components/ui/PointDetailModal';

// Membuat array berisi 22 Major Arcana (0 - 21)
const MAJOR_ARCANA = Array.from({ length: 22 }, (_, i) => getArcanaByNumber(i)).filter(Boolean) as ArcanaDefinition[];

export function CardListScreen() {
  const colors = useThemeStore(state => state.getColors());
  const { width } = useWindowDimensions();
  
  // State untuk mengontrol data modal yang aktif
  const [selectedPoint, setSelectedPoint] = useState<DetailablePoint | null>(null);

  const numColumns = width > 400 ? 3 : 2;
  const cardWidth = (width - SPACING.md * (numColumns + 1)) / numColumns;

  // Fungsi saat kartu ditekan untuk memicu modal muncul
  const handleCardPress = (item: ArcanaDefinition) => {
    setSelectedPoint({
      key: item.id.toString(),    // DIPERBAIKI: Menggunakan item.id menggantikan item.number
      label: 'Major Arcana',       // Label info atas modal
      value: item.id,             // DIPERBAIKI: Nilai angka menggunakan item.id
      arcana: item as any,         // Seluruh object data ArcanaDefinition bawaan kartu
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={MAJOR_ARCANA}
        keyExtractor={item => item.tarotName}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          // DIPERBAIKI: Menggunakan item.tarotName menggantikan item.tarotId lama
          const image = getArcanaImage(item.tarotName);
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
              {/* DIPERBAIKI: Menyesuaikan properti komponen teks dengan struktur ArcanaDefinition */}
              <Text style={[styles.cardNumber, { color: colors.primary }]}>#{item.id}</Text>
              <Text style={[styles.tarotName, { color: colors.text }]} numberOfLines={1}>{item.tarotName}</Text>
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
    ...(SHADOWS.md as ViewStyle), // DIPERBAIKI: Casting aman ke ViewStyle
  },
  image: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xs,
  },
  cardNumber: { fontSize: FONT_SIZE.xs, fontWeight: '700', marginBottom: 2 },
  tarotName: { fontSize: FONT_SIZE.sm, fontWeight: '600', textAlign: 'center' }, // DIPERBAIKI: Rename style dari cardName ke tarotName
  keywords: { fontSize: 10, textAlign: 'center', marginTop: 2 },
});
 