// Berkas: src/features/insight/components/features/detail-modals/ArcanaSequenceDetailModal.tsx
import React from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { ArcanaWheel } from '@components/charts/ArcanaWheel';
import type { ArcanaDefinition } from '@core/arcana/types';

interface Props {
  visible: boolean;
  data?: ArcanaDefinition[];
  onClose: () => void;
}

export function ArcanaSequenceDetailModal({ visible, data, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const sequence = Array.isArray(data) ? data : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            🎡 Roda Takdir
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {sequence.length > 0 ? (
            <>
              <View style={styles.wheelContainer}>
                <ArcanaWheel arcanaSequence={sequence} />
              </View>

              <Text style={[styles.description, { color: colors.textSecondary }]}>
                Delapan Arcana utama membentuk pola perjalanan jiwa, menunjukkan
                bagaimana energi berkembang dari karakter, pengalaman, hingga
                tujuan spiritual.
              </Text>

              {/* Rincian per-node */}
              <View style={styles.listSection}>
                {sequence.map((arcana, idx) => (
                  <View
                    key={arcana?.id ?? idx}
                    style={[
                      styles.listItem,
                      { borderBottomColor: colors.border + '40' },
                    ]}
                  >
                    <View style={[styles.listBadge, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.listBadgeText, { color: colors.primary }]}>
                        {arcana?.id ?? '—'}
                      </Text>
                    </View>
                    <Text style={[styles.listName, { color: colors.text }]}>
                      {arcana?.matrixName || arcana?.tarotName || 'Arcana'}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Menunggu kalkulasi urutan arketipe...
              </Text>
            </View>
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  closeButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  closeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  wheelContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  description: {
    textAlign: 'center',
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  listSection: {
    marginTop: SPACING.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  listBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  listBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
  listName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
  },
});

export default ArcanaSequenceDetailModal; 