// Berkas: src/features/insight/components/features/detail-modals/ChakraDetailModal.tsx

import React, { useMemo } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import type { ChakraData } from '@core/destiny-matrix';
import { useAppStore } from '@store/app-store';
import { getRandomDailyCard } from '@core/destiny-matrix/daily-card'; // 🃏 Impor kartu harian
import { getChakraImpactFromDailyCard } from '@core/destiny-matrix/utils/chakra-transformer'; // 🧠 Impor transformer dampak

interface Props {
  visible: boolean;
  data?: ChakraData[];
  onClose: () => void;
}

const STATUS_COLOR = {
  Balanced: '#10b981',
  Overactive: '#f59e0b',
  Blocked: '#ef4444',
} as const;

const CHAKRA_ICON: Record<string, string> = {
  Crown: '👑',
  'Third Eye': '👁️',
  Throat: '🗣️',
  Heart: '💚',
  'Solar Plexus': '☀️',
  Sacral: '🟠',
  Root: '🌍',
};

const CHAKRA_ELEMENTS: Record<string, 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit'> = {
  Crown: 'Spirit',
  'Third Eye': 'Spirit',
  Throat: 'Air',
  Heart: 'Air',
  'Solar Plexus': 'Fire',
  Sacral: 'Water',
  Root: 'Earth',
};

export function ChakraDetailModal({ visible, data, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const matrix = useAppStore(state => state.currentMatrix);
  const rawChakras = Array.isArray(data) ? data : [];

  // 🃏 1. Ambil kartu harian saat ini dan kalkulasi dampak dinamisnya
  const dailyChakraImpact = useMemo(() => {
    try {
      const currentCard = getRandomDailyCard();
      if (!currentCard) return null;
      return getChakraImpactFromDailyCard(currentCard);
    } catch (e) {
      return null;
    }
  }, [visible]); // Recalculate setiap kali modal dibuka agar selaras dengan state aplikasi luar

  // 🔄 2. OVERRIDE ENGINE: Suntikkan status fluktuatif harian ke dalam array chakra bawaan lahir
  const chakras = useMemo(() => {
    if (!dailyChakraImpact) return rawChakras;

    return rawChakras.map(chakra => {
      if (chakra.name === dailyChakraImpact.chakraName) {
        return {
          ...chakra,
          status: dailyChakraImpact.status, // Paksa status berubah mengikuti kartu tarot harian!
        };
      }
      return chakra;
    });
  }, [rawChakras, dailyChakraImpact]);

  // 🌀 DETEKSI RESONANSI: Cek keberadaan Arkana #10 di 20 titik inti geometri takdir
  const hasWheelOfFortune = useMemo(() => {
    if (!matrix?.points) return false;
    const rawPoints = matrix.points as Record<string, any>;
    const VALID_20_KEYS = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
    ];

    return VALID_20_KEYS.some(key => {
      const pt = rawPoints[key];
      const id = pt?.arcana?.id ?? pt?.value ?? 0;
      return id === 10;
    });
  }, [matrix]);

  // 🌀 DYNAMIC NODAL ENGINE: Mencari Arkana yang paling dominan di 20 titik batin
  const dominantArcanaInfo = useMemo(() => {
    if (!matrix?.points) return null;
    const rawPoints = matrix.points as Record<string, any>;
    const VALID_20_KEYS = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
    ];

    // 1. Hitung frekuensi kemunculan setiap ID Arkana
    const frequencyMap: Record<number, number> = {};
    let maxCount = 0;
    let mostDominantId = 0;

    VALID_20_KEYS.forEach(key => {
      const pt = rawPoints[key];
      const id = pt?.arcana?.id ?? pt?.value ?? 0;
      const finalId = id === 0 ? 22 : id; // Interseptor ID 0 menjadi 22

      frequencyMap[finalId] = (frequencyMap[finalId] || 0) + 1;

      if (frequencyMap[finalId] > maxCount) {
        maxCount = frequencyMap[finalId];
        mostDominantId = finalId;
      }
    });

    // Jika tidak ada data valid atau matrix kosong, matikan banner
    if (maxCount === 0) return null;

    // 2. Kamus Data Lengkap Kamus Struktur 22 Arkana Makrokosmos
    const arcanaNames: Record<number, { name: string; icon: string }> = {
      1: { name: 'The Magician (Sang Penyihir)', icon: '✨' },
      2: { name: 'The High Priestess (Pendeta Agung)', icon: '🌙' },
      3: { name: 'The Empress (Permaisuri)', icon: '👑' },
      4: { name: 'The Emperor (Kaisar)', icon: '🦅' },
      5: { name: 'The Hierophant (Sang Guru Spiritual)', icon: '📜' },
      6: { name: 'The Lovers (Sang Pencinta)', icon: '💕' },
      7: { name: 'The Chariot (Kereta Perang)', icon: '⚔️' },
      8: { name: 'Justice (Keadilan)', icon: '⚖️' },
      9: { name: 'The Hermit (Sang Pertapa)', icon: '🕯️' },
      10: { name: 'Wheel of Fortune (Roda Takdir)', icon: '🪐' },
      11: { name: 'Strength (Kekuatan Batin)', icon: '🦁' },
      12: { name: 'The Hanged Man (Pengorbanan)', icon: '⏳' },
      13: { name: 'Death (Transformasi Radikal)', icon: '💀' },
      14: { name: 'Temperance (Keseimbangan Alkimia)', icon: '🧪' },
      15: { name: 'The Devil (Pelepasan Bayangan)', icon: '🔥' },
      16: { name: 'The Tower (Rekonstruksi Total)', icon: '⚡' },
      17: { name: 'The Star (Bintang Harapan)', icon: '⭐' },
      18: { name: 'The Moon (Misteri Bawah Sadar)', icon: '🔮' },
      19: { name: 'The Sun (Vitalitas Puncak)', icon: '☀️' },
      20: { name: 'Judgement (Kebangkitan Jiwa)', icon: '🔔' },
      21: { name: 'The World (Semesta Sempurna)', icon: '🌍' },
      22: { name: 'The Fool (Kebebasan Murni)', icon: '🌀' },
    };

    const defaultMeta = { name: `Arkana #${mostDominantId}`, icon: '🔱' };
    const meta = arcanaNames[mostDominantId] || defaultMeta;

    return {
      id: mostDominantId,
      name: meta.name,
      icon: meta.icon,
      count: maxCount,
    };
  }, [matrix]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>🧘 Analisis 7 Chakra</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.border + '40' }]}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.text, fontWeight: '700' }}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* ─── DYNAMIC RESONANCE BANNER ─── */}
          {dominantArcanaInfo && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resonanceGlobalBanner}>
              <Text style={styles.resonanceGlobalIcon}>{dominantArcanaInfo.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.resonanceGlobalTitle}>
                  Resonansi {dominantArcanaInfo.name} Terdeteksi
                </Text>
                <Text style={styles.resonanceGlobalBody}>
                  Getaran inti Arkana #{dominantArcanaInfo.id} —{' '}
                  <Text style={{ fontWeight: '700' }}>{dominantArcanaInfo.name}</Text> mendominasi{' '}
                  {dominantArcanaInfo.count} titik geometri. Energi ini mempercepat mutasi pada roda
                  spiritual jiwamu!
                </Text>
              </View>
            </Animated.View>
          )}

          {chakras.length > 0 ? (
            chakras.map((chakra, index) => {
              const chakraName = chakra.name || 'unknown';
              const statusColor = STATUS_COLOR[chakra.status || 'Balanced'];
              const chakraElement = CHAKRA_ELEMENTS[chakraName];

              // Pengecekan status cross-buff spesifik per chakra
              const isSolarPlexusHome = chakraName === 'Solar Plexus' && hasWheelOfFortune;
              const isEarthConflict = chakraElement === 'Earth' && hasWheelOfFortune;

              // Cek apakah chakra ini yang sedang terkena dampak cuaca harian dari Daily Card
              const isCurrentlyImpactedByTarot = dailyChakraImpact?.chakraName === chakraName;

              return (
                <Animated.View
                  layout={LinearTransition.springify()}
                  entering={FadeInDown.delay(index * 60).duration(450)}
                  key={`chakra-item-${index}-${chakraName}`}
                  style={[
                    styles.item,
                    {
                      borderColor: isCurrentlyImpactedByTarot
                        ? statusColor
                        : isSolarPlexusHome
                          ? '#ffd700'
                          : isEarthConflict
                            ? '#ef444450'
                            : colors.border,
                      backgroundColor: isSolarPlexusHome ? '#ffd70008' : colors.surface,
                      borderLeftColor: isCurrentlyImpactedByTarot
                        ? statusColor
                        : isSolarPlexusHome
                          ? '#ffd700'
                          : isEarthConflict
                            ? '#ef4444'
                            : colors.border,
                      borderLeftWidth:
                        isCurrentlyImpactedByTarot || isSolarPlexusHome || isEarthConflict ? 5 : 1,
                    },
                  ]}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.left}>
                      <Text style={styles.icon}>{CHAKRA_ICON[chakraName] || '✨'}</Text>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Text style={[styles.name, { color: colors.text }]}>{chakraName}</Text>
                          {isSolarPlexusHome && (
                            <View style={styles.miniBuffBadge}>
                              <Text style={styles.miniBuffText}>🔥 HOME NODAL</Text>
                            </View>
                          )}
                          {isCurrentlyImpactedByTarot && (
                            <View
                              style={[
                                styles.miniBuffBadge,
                                { backgroundColor: statusColor + '20', borderColor: statusColor },
                              ]}
                            >
                              <Text style={[styles.miniBuffText, { color: statusColor }]}>
                                🃏 DAILY IMPACT
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.values, { color: colors.textMuted }]}>
                          Fisik {chakra.physicalValue} • Energi {chakra.energyValue} • Total{' '}
                          {chakra.totalValue}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: statusColor + '15' }]}>
                      <Text style={[styles.badgeText, { color: statusColor }]}>
                        {chakra.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {chakra.description}
                  </Text>

                  {/* ─── EXPANSION NOTIFICATION PANEL (Saran 3 Buff / Debuff / Daily Impact) ─── */}
                  {isCurrentlyImpactedByTarot && dailyChakraImpact && (
                    <Animated.View
                      entering={FadeInDown.duration(200)}
                      style={[
                        styles.innerNoticeBox,
                        { backgroundColor: statusColor + '08', borderColor: statusColor + '40' },
                      ]}
                    >
                      <Text style={[styles.noticeTitle, { color: statusColor }]}>
                        🔮 Pengaruh Transmutasi Harian Kartu
                      </Text>
                      <Text style={[styles.noticeBody, { color: colors.textSecondary }]}>
                        {dailyChakraImpact.reason}
                      </Text>
                    </Animated.View>
                  )}

                  {isSolarPlexusHome && !isCurrentlyImpactedByTarot && (
                    <View
                      style={[
                        styles.innerNoticeBox,
                        { backgroundColor: '#ffd70012', borderColor: '#ffd70040' },
                      ]}
                    >
                      <Text style={styles.noticeTitle}>
                        🪐 Resonansi Roda Keberuntungan (+35% Kapasitas Aksi)
                      </Text>
                      <Text style={[styles.noticeBody, { color: colors.textSecondary }]}>
                        Pusat api kehendakmu sedang didorong oleh siklus keberuntungan makrokosmos.
                        Waktunya mengeksekusi visi bisnis, investasi, dan kepemimpinan secara berani
                        tanpa ragu!
                      </Text>
                    </View>
                  )}

                  {isEarthConflict && (
                    <View
                      style={[
                        styles.innerNoticeBox,
                        { backgroundColor: '#ef444408', borderColor: '#ef444430' },
                      ]}
                    >
                      <Text style={[styles.noticeTitle, { color: '#ef4444' }]}>
                        ⚠️ Turbulensi Elemen Bumi (Hambatan Siklus Kaku)
                      </Text>
                      <Text style={[styles.noticeBody, { color: colors.textSecondary }]}>
                        Kontras energi terjadi antara fleksibilitas Roda Takdir dengan kekakuan
                        elemen Bumi di {chakraName}. Singkirkan rutinitas yang terlalu monoton yang
                        menghambat keberanianmu berkembang.
                      </Text>
                    </View>
                  )}
                </Animated.View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Menunggu kalkulasi penyelarasan chakra...
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: FONT_SIZE.md, fontWeight: '800' },
  closeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },

  resonanceGlobalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffd70010',
    borderColor: '#ffd70035',
    borderWidth: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
  },
  resonanceGlobalIcon: { fontSize: 24 },
  resonanceGlobalTitle: { fontSize: 12, fontWeight: '800', color: '#b69100' },
  resonanceGlobalBody: { fontSize: 11, color: '#555', lineHeight: 15, marginTop: 1 },

  item: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 28, marginRight: SPACING.md },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700' },
  values: { marginTop: 4, fontSize: FONT_SIZE.xs },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.md },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  description: { marginTop: SPACING.md, fontSize: FONT_SIZE.sm, lineHeight: 22 },

  miniBuffBadge: {
    backgroundColor: '#ffd70030',
    borderColor: '#ffd700',
    borderWidth: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  miniBuffText: { fontSize: 8, fontWeight: '900', color: '#b69100' },

  innerNoticeBox: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 0.5,
    borderLeftWidth: 3,
  },
  noticeTitle: { fontSize: 11, fontWeight: '800', color: '#b69100', marginBottom: 4 },
  noticeBody: { fontSize: 11, lineHeight: 16, fontWeight: '500' },

  emptyText: { fontSize: FONT_SIZE.sm, textAlign: 'center', marginTop: SPACING.xl },
});

export default ChakraDetailModal;
