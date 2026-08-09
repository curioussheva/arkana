import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function PurposeSection() {
  return (
    <View style={styles.container}>
      {/* Line Ancestry & Sky/Earth */}
      <View style={styles.gridRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Socialization</Text>
          <Text style={styles.cardSub}>
            Mix of male and female. Building relationships, skills.
          </Text>
          <View style={styles.badgeGroup}>
            <View style={styles.circleBadge}>
              <Text style={styles.badgeText}>13</Text>
            </View>
            <Text style={styles.plus}>+</Text>
            <View style={styles.circleBadge}>
              <Text style={styles.badgeText}>19</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spiritual Knowledge</Text>
          <Text style={styles.cardSub}>Spiritual exam. Who am I for the God?</Text>
          <View style={styles.circleBadgePrimary}>
            <Text style={styles.badgeTextWhite}>12</Text>
          </View>
        </View>
      </View>

      {/* Male & Female Line Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.lineRow}>
          <Text style={styles.lineLabel}>Male Generation Line:</Text>
          <View style={styles.rowBadges}>
            <Text style={styles.pillText}>20</Text>
            <Text style={styles.pillText}>8</Text>
            <Text style={styles.pillText}>10</Text>
          </View>
        </View>

        <View style={styles.lineRow}>
          <Text style={styles.lineLabel}>Female Generation Line:</Text>
          <View style={styles.rowBadges}>
            <Text style={styles.pillText}>11</Text>
            <Text style={styles.pillText}>17</Text>
            <Text style={styles.pillText}>10</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, marginTop: 16 },
  gridRow: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  cardSub: { fontSize: 10, color: '#64748B', marginTop: 2, marginBottom: 8 },
  badgeGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  circleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderBottomWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBadgePrimary: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  badgeTextWhite: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  plus: { fontSize: 12, color: '#94A3B8' },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
  rowBadges: { flexDirection: 'row', gap: 6 },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
});
