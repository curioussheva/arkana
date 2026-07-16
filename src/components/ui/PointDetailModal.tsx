import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { getArcanaImage } from '@constants/arcana-images';
import type { ArcanaDefinition } from '@core/arcana/types'; // Menggunakan tipe data arcana yang tepat

export interface DetailablePoint {
  key: string;
  label: string;
  value: number;
  arcana: ArcanaDefinition;
}

interface Props {
  point: DetailablePoint | null;
  onClose: () => void;
}

const ELEMENT_EMOJI: Record<string, string> = {
  Fire: '🔥',
  Water: '💧',
  Air: '🌬️',
  Earth: '🌱',
};

// Peta nama cadangan jika properti nama dari database kosong/undefined saat runtime
const ARCANA_NAMES_FALLBACK: Record<number, string> = {
  0: 'The Fool',
  1: 'The Magician',
  2: 'The High Priestess',
  3: 'The Empress',
  4: 'The Emperor',
  5: 'The Hierophant',
  6: 'The Lovers',
  7: 'The Chariot',
  8: 'Justice',
  9: 'The Hermit',
  10: 'Wheel of Fortune',
  11: 'Strength',
  12: 'The Hanged Man',
  13: 'Death',
  14: 'Temperance',
  15: 'The Devil',
  16: 'The Tower',
  17: 'The Star',
  18: 'The Moon',
  19: 'The Sun',
  20: 'Judgement',
  21: 'The World',
  22: 'The Fool', 
};

export function PointDetailModal({ point, onClose }: Props) {
  const { width, height } = useWindowDimensions();
  const colors = useThemeStore(state => state.getColors());

  if (!point) return null;

  // Safe fallback untuk objek arcana jika strukturnya berbeda di tingkat runtime tanpa menggunakan 'any'
  const arcana: ArcanaDefinition = point.arcana || point;

  // 1. RESOLVE ID/VALUE: Menggunakan nullish coalescing agar kartu bernilai 0 (The Fool) tidak hilang
  const rawId: number = point.value ?? arcana.id ?? 0;
  const cardId = String(rawId);

  // 2. RESOLVE NAMA & GAMBAR: 
  // Gunakan tarotName agar pemanggilan asset gambar klop 100% dengan loader getArcanaImage
  const tarotName = arcana.tarotName || ARCANA_NAMES_FALLBACK[rawId] || 'The Fool';
  const displayTitle = arcana.matrixName || tarotName;

  // Ambil gambar berdasarkan tarotName (atau angka ID jika loader-mu mendukung ID)
  const image = getArcanaImage(tarotName);

  // 3. RASIO KARTU TAROT STANDARD: Menggunakan rasio 1:1.5 yang presisi
  const cardWidth = Math.min(width - SPACING.lg * 4, 280);
  const imageHeight = cardWidth * 1.5;

  const parseSafeText = (textData: string | string[] | undefined): string => {
    if (Array.isArray(textData)) return textData.join(' ');
    return textData || '';
  };

  const renderSection = (title: string, items?: string[]) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          {title}
        </Text>
        {items.map((item, index) => (
          <Text key={`${title}-${index}`} style={[styles.item, { color: colors.text }]}>
            • {item}
          </Text>
        ))}
      </View>
    );
  };

  const renderText = (title: string, value?: string | string[]) => {
    const safeText = parseSafeText(value);
    if (!safeText) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {safeText}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              maxHeight: height * 0.85,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* Bagian Visual Gambar Kartu */}
            {image ? (
              <View style={[styles.imageContainer, { width: cardWidth, height: imageHeight, backgroundColor: colors.backgroundLight }]}>
                <Image
                  source={image}
                  style={{ width: cardWidth, height: imageHeight }}
                  resizeMode="contain" 
                />
              </View>
            ) : (
              <View style={[
                styles.placeholder, 
                { 
                  width: cardWidth, 
                  height: imageHeight, 
                  backgroundColor: colors.backgroundLight,
                  borderColor: colors.border + '40',
                  borderWidth: 2
                }
              ]}>
                <Text style={styles.placeholderEmoji}>🃏</Text>
                <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                  {tarotName}
                </Text>
              </View>
            )}

            {/* Judul Utama (Menggunakan nama indah Matrix) */}
            <Text style={[styles.title, { color: colors.text }]}>
              {displayTitle}
            </Text>

            {/* Sub-judul Tarot (Menampilkan "Wheel of Fortune" di bawah nama Matrix) */}
            {arcana.tarotName && arcana.tarotName !== displayTitle ? (
              <Text style={[styles.matrixName, { color: colors.textSecondary, fontStyle: 'italic' }]}>
                {arcana.tarotName}
              </Text>
            ) : null}

            {/* Badges Info */}
            <View style={styles.badges}>
              {cardId !== '' ? (
                <Text style={[styles.badge, { color: colors.primary }]}>
                  #{cardId}
                </Text>
              ) : null}

              {arcana.element ? (
                <Text style={[styles.badge, { color: colors.primary }]}>
                  {ELEMENT_EMOJI[arcana.element] || '✨'} {arcana.element}
                </Text>
              ) : null}

              {arcana.polarity ? (
                <Text style={[styles.badge, { color: colors.primary }]}>
                  {arcana.polarity}
                </Text>
              ) : null}
            </View>

            {/* Konten Interpretasi Tafsir Numerologi */}
            {renderText('Ringkasan', arcana.summary)}
            {renderText('Makna Upright', arcana.uprightMeaning)}
            {renderText('Makna Reversed', arcana.reversedMeaning)}
            {renderText('Nasihat Jiwa', arcana.advice)}
            
            {renderSection('Keywords', arcana.keywords)}
            {renderSection('Karakter Positif', arcana.positiveTraits)}
            {renderSection('Shadow / Tantangan', arcana.shadowTraits)}
            {renderSection('Kekuatan', arcana.strengths)}
            {renderSection('Kelemahan', arcana.weaknesses)}
            {renderSection('Talenta', arcana.talents)}
            {renderSection('Misi Hidup', arcana.lifeMission)}
            {renderSection('Pelajaran Karma', arcana.karmicLessons)}
            {renderSection('Pelajaran Spiritual', arcana.spiritualLessons)}
            
            {renderSection('Karier', arcana.career)}
            {renderSection('Keuangan', arcana.finance)}
            {renderSection('Hubungan', arcana.relationship)}
            {renderSection('Kesehatan', arcana.health)}
            
            {renderSection('Gift', arcana.gifts)}
            {renderSection('Ketakutan', arcana.fears)}
            {renderSection('Afirmasi', arcana.affirmations)}

            {/* Tombol Aksi Tutup */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={onClose}
            >
              <Text style={styles.closeText}>Tutup</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    width: '90%',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  imageContainer: {
    alignSelf: 'center',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  placeholder: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  placeholderEmoji: {
    fontSize: 72,
    marginBottom: SPACING.sm,
  },
  placeholderText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  matrixName: {
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  badge: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  section: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  item: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  closeButton: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});
 