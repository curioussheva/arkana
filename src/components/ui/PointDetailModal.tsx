import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  LayoutAnimation,
  Platform,
} from 'react-native';

import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { getArcanaImage } from '@constants/arcana-images';
import type { ArcanaDefinition } from '@core/arcana/types';

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = useCallback((sectionKey: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  }, []);

  if (!point?.arcana) return null;

  const arcana = point.arcana;
  const rawId = point.value ?? arcana.id ?? 0;
  const cardId = String(rawId);

  const tarotName = arcana.tarotName || ARCANA_NAMES_FALLBACK[rawId] || 'The Fool';
  const displayTitle = arcana.matrixName || tarotName;
  const image = getArcanaImage(tarotName);

  const cardWidth = Math.min(width - SPACING.lg * 4, 280);
  const imageHeight = cardWidth * 1.5;

  // ===================== RENDER HELPERS =====================

  const renderSummary = (text?: string) => {
    if (!text) return null;
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Ringkasan</Text>
        <Text style={[styles.description, { color: colors.text }]}>{text}</Text>
      </View>
    );
  };

  const renderDropdownText = (sectionKey: string, title: string, text?: string) => {
    if (!text) return null;
    const isOpen = !!openSections[sectionKey];

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
          <Text style={[styles.chevron, { color: colors.primary }]}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownContent}>
            <Text style={[styles.description, { color: colors.text }]}>{text}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDropdownList = (sectionKey: string, title: string, items?: string[]) => {
    if (!items || items.length === 0) return null;
    const isOpen = !!openSections[sectionKey];

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
          <Text style={[styles.chevron, { color: colors.primary }]}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownContent}>
            {items.map((item, index) => (
              <Text
                key={`item-\( {sectionKey}- \){index}-${item.slice(0, 12)}`} // ← key lebih unik
                style={[styles.item, { color: colors.text }]}
              >
                • {item}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  // ===================== MAIN RENDER =====================

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              maxHeight: height * 0.85,
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Gambar Kartu */}
            {image ? (
              <View
                style={[
                  styles.imageContainer,
                  {
                    width: cardWidth,
                    height: imageHeight,
                    backgroundColor: colors.backgroundLight,
                  },
                ]}
              >
                <Image
                  source={image}
                  style={{ width: cardWidth, height: imageHeight }}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View
                style={[
                  styles.placeholder,
                  {
                    width: cardWidth,
                    height: imageHeight,
                    backgroundColor: colors.backgroundLight,
                    borderColor: (colors.border || '#ccc') + '40',
                    borderWidth: 2,
                  },
                ]}
              >
                <Text style={styles.placeholderEmoji}>🃏</Text>
                <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                  {tarotName}
                </Text>
              </View>
            )}

            {/* Judul */}
            <Text style={[styles.title, { color: colors.text }]}>{displayTitle}</Text>

            {arcana.tarotName && arcana.tarotName !== displayTitle && (
              <Text
                style={[styles.matrixName, { color: colors.textSecondary, fontStyle: 'italic' }]}
              >
                {arcana.tarotName}
              </Text>
            )}

            {/* Badges */}
            <View style={styles.badges}>
              <Text style={[styles.badge, { color: colors.primary }]}>#{cardId}</Text>

              {!!arcana.element && (
                <Text style={[styles.badge, { color: colors.primary }]}>
                  {ELEMENT_EMOJI[arcana.element] || '✨'} {arcana.element}
                </Text>
              )}

              {!!arcana.polarity && (
                <Text style={[styles.badge, { color: colors.primary }]}>{arcana.polarity}</Text>
              )}

              {!!arcana.planet && (
                <Text style={[styles.badge, { color: colors.primary }]}>{arcana.planet}</Text>
              )}

              {!!arcana.chakra && (
                <Text style={[styles.badge, { color: colors.primary }]}>{arcana.chakra}</Text>
              )}
            </View>

            {/* ===== RINGKASAN (selalu terbuka) ===== */}
            {renderSummary(arcana.summary || arcana.narrative?.overview)}

            {/* ===== DROPDOWN SECTIONS ===== */}
            {renderDropdownText('upright', 'Makna Upright', arcana.uprightMeaning)}
            {renderDropdownText('reversed', 'Makna Reversed', arcana.reversedMeaning)}

            {renderDropdownText('personality', 'Kepribadian', arcana.narrative?.personality)}
            {renderDropdownText('challenge', 'Tantangan', arcana.narrative?.challenge)}
            {renderDropdownText('potential', 'Potensi', arcana.narrative?.potential)}

            {renderDropdownList('keywords', 'Keywords', arcana.keywords)}
            {renderDropdownList('positive', 'Karakter Positif', arcana.positiveTraits)}
            {renderDropdownList('shadow', 'Shadow / Tantangan', arcana.shadowTraits)}
            {renderDropdownList('strengths', 'Kekuatan', arcana.strengths)}
            {renderDropdownList('weaknesses', 'Kelemahan', arcana.weaknesses)}
            {renderDropdownList('gifts', 'Gift', arcana.gifts)}
            {renderDropdownList('fears', 'Ketakutan', arcana.fears)}

            {renderDropdownList('talents', 'Talenta', arcana.talents)}
            {renderDropdownList('mission', 'Misi Hidup', arcana.lifeMission)}
            {renderDropdownList('karmic', 'Pelajaran Karma', arcana.karmicLessons)}
            {renderDropdownList('spiritual', 'Pelajaran Spiritual', arcana.spiritualLessons)}

            {renderDropdownList('career', 'Karier', arcana.career)}
            {renderDropdownList('finance', 'Keuangan', arcana.finance)}
            {renderDropdownList('relationship', 'Hubungan', arcana.relationship)}
            {renderDropdownList('family', 'Keluarga', arcana.family)}
            {renderDropdownList('friendship', 'Persahabatan', arcana.friendship)}
            {renderDropdownList('health', 'Kesehatan', arcana.health)}

            {renderDropdownList('advice', 'Nasihat', arcana.advice)}
            {renderDropdownList('affirmations', 'Afirmasi', arcana.affirmations)}
            {renderDropdownList('meditation', 'Meditasi', arcana.meditation)}
            {renderDropdownList('daily', 'Praktik Harian', arcana.dailyPractice)}

            {/* Tombol Tutup */}
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
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 12,
    fontWeight: '700',
  },
  dropdownContent: {
    marginTop: 4,
    paddingLeft: 4,
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
