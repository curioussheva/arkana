import React from 'react';
import { Modal, SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { NamedLines } from '@core/destiny-matrix';

interface Props {
  visible: boolean;
  data?: NamedLines;
  onClose: () => void;
}

export function NamedLinesDetailModal({ visible, data, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>🔗 Garis Energi Kehidupan</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {data ? (
            <>
              <View style={[styles.block, { borderColor: colors.border, backgroundColor: colors.backgroundLight + '60' }]}>
                <Text style={[styles.blockTitle, { color: '#ec4899' }]}>💖 Love Line</Text>
                <Text style={[styles.text, { color: colors.textSecondary }]}>{data.loveLine.meaning}</Text>
                <Text style={[styles.label, { color: colors.primary }]}>Pelajaran Jiwa</Text>
                <Text style={[styles.text, { color: colors.text }]}>{data.loveLine.keyLesson}</Text>
              </View>

              <View style={[styles.block, { borderColor: colors.border, backgroundColor: colors.backgroundLight + '60' }]}>
                <Text style={[styles.blockTitle, { color: '#f59e0b' }]}>💰 Money Line</Text>
                <Text style={[styles.text, { color: colors.textSecondary }]}>{data.moneyLine.meaning}</Text>
                <Text style={[styles.label, { color: colors.primary }]}>Saran Pengembangan</Text>
                <Text style={[styles.text, { color: colors.text }]}>{data.moneyLine.advice}</Text>
              </View>
            </>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Menunggu kalkulasi garis energi...
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800' },
  closeButton: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  closeText: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  block: {
    borderWidth: 1, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  blockTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', marginBottom: SPACING.sm },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '700', marginTop: SPACING.md, marginBottom: 4 },
  text: { fontSize: FONT_SIZE.sm, lineHeight: 22 },
  emptyText: { fontSize: FONT_SIZE.sm, textAlign: 'center', marginTop: SPACING.xl },
});

export default NamedLinesDetailModal; 