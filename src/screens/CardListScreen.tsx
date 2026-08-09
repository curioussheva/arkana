import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@store/theme-store';
import { getArcanaByNumber } from '@core/arcana';
import { getArcanaImage } from '@constants/arcana-images';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { ArcanaDefinition } from '@core/arcana/types';

// Import Modal Detail yang sudah diperbaiki sebelumnya
import { PointDetailModal, type DetailablePoint } from '@components/ui/PointDetailModal';

// Membuat array berisi 22 Major Arcana (0 - 21)
const MAJOR_ARCANA = Array.from({ length: 22 }, (_, i) => getArcanaByNumber(i)).filter(
  Boolean
) as ArcanaDefinition[];

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
      key: item.id.toString(),
      label: 'Major Arcana',
      value: item.id === 0 ? 22 : item.id, // 🔮 INTERSEPTOR: Kirim ID 22 ke modal jika aslinya 0
      arcana: item as any,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <FlatList
        // 🛡️ AMAN GESTURE: Mengubah key secara dinamis saat kolom berganti agar FlatList me-remount grid tanpa crash
        key={`flatlist-grid-${numColumns}`}
        data={MAJOR_ARCANA}
        keyExtractor={item => item.tarotName}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const image = getArcanaImage(item.tarotName);

          // 🔮 INTERSEPTOR VISUAL: Ubah ID 0 (The Fool) menjadi nomor tampilan #22 agar ramah dibaca pengguna
          const displayId = item.id === 0 ? 22 : item.id;

          return (
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
              <Text style={[styles.cardNumber, { color: colors.primary }]}>#{displayId}</Text>
              <Text style={[styles.tarotName, { color: colors.text }]} numberOfLines={1}>
                {item.tarotName}
              </Text>
              <Text style={[styles.keywords, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.keywords.slice(0, 3).join(', ')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Tampilkan modal secara kondisional tepat di bawah list */}
      <PointDetailModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
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
    ...(SHADOWS.md as ViewStyle),
  },
  image: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xs,
  },
  cardNumber: { fontSize: FONT_SIZE.xs, fontWeight: '700', marginBottom: 2 },
  tarotName: { fontSize: FONT_SIZE.sm, fontWeight: '600', textAlign: 'center' },
  keywords: { fontSize: 10, textAlign: 'center', marginTop: 2 },
});
