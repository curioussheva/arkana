import React from 'react';
import { Modal, SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { ChakraData } from '@core/destiny-matrix';

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

const CHAKRA_ICON: Record<ChakraData['name'], string> = {
  Crown: '👑',
  'Third Eye': '👁️',
  Throat: '🗣️',
  Heart: '💚',
  'Solar Plexus': '☀️',
  Sacral: '🟠',
  Root: '🌍',
};

export function ChakraDetailModal({ visible, data, onClose }: Props) {
  const colors = useThemeStore(state => state.getColors());
  const chakras = Array.isArray(data) ? data : [];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>🧘 Analisis 7 Chakra</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>Tutup</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {chakras.length > 0 ? (
            chakras.map((chakra, index) => {
              const statusColor = STATUS_COLOR[chakra.status || 'Balanced'];
              return (
                <View
                  key={`chakra-item-${index}-${chakra.name || 'unknown'}`}
                  style={[styles.item, { borderColor: colors.border }]}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.left}>
                      <Text style={styles.icon}>{CHAKRA_ICON[chakra.name]}</Text>
                      <View>
                        <Text style={[styles.name, { color: colors.text }]}>{chakra.name}</Text>
                        <Text style={[styles.values, { color: colors.textMuted }]}>
                          Physical {chakra.physicalValue} • Energy {chakra.energyValue} • Total {chakra.totalValue}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
                      <Text style={[styles.badgeText, { color: statusColor }]}>{chakra.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {chakra.description}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Menunggu kalkulasi chakra...
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
  item: {
    borderWidth: 1, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 26, marginRight: SPACING.md },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700' },
  values: { marginTop: 4, fontSize: FONT_SIZE.xs },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.md },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  description: { marginTop: SPACING.md, fontSize: FONT_SIZE.sm, lineHeight: 22 },
  emptyText: { fontSize: FONT_SIZE.sm, textAlign: 'center', marginTop: SPACING.xl },
});

export default ChakraDetailModal; 