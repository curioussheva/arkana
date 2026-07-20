// Berkas: src/features/insight/components/features/ArcanaSequenceGridCard.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View, 
  TouchableOpacity,
} from 'react-native';
import { useThemeStore } from '@store/theme-store';
import { FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import type { ArcanaDefinition } from '@core/arcana/types';

interface Props {
  data?: ArcanaDefinition[]; // Menerima deretan urutan arketipe takdir (Array)
  onPress?: () => void;
}

export function ArcanaSequenceGridCard({ data, onPress }: Props) {
  const colors = useThemeStore(state => state.getColors());

  const primaryTriad = Array.isArray(data) ? data.slice(0, 3) : [];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={styles.icon}>🔢</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
          <Text style={[styles.tagText, { color: colors.primary }]}>MATRIKS</Text>
        </View>
      </View>

      <View>
        <Text style={[styles.title, { color: colors.text }]}>Urutan Kodifikasi</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Tiga Pilar Arketipe</Text>
      </View>

      {primaryTriad.length > 0 ? (
        <View style={styles.sequenceRow}>
          {primaryTriad.map((arcana, idx) => (
            <React.Fragment key={arcana?.id || idx}>
              <View style={[styles.node, { backgroundColor: colors.backgroundLight, borderColor: colors.primary + '30' }]}>
                <Text style={[styles.nodeValue, { color: colors.primary }]}>
                  {arcana?.id ?? '—'}
                </Text>
                <Text style={[styles.nodeLabel, { color: colors.textMuted }]} numberOfLines={1}>
                  {idx === 0 ? 'Mental' : idx === 1 ? 'Spiritual' : 'Siklus'}
                </Text>
              </View>

              {idx < primaryTriad.length - 1 && (
                <Text style={[styles.arrow, { color: colors.border }]}>➔</Text>
              )}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <View style={styles.emptyRow}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            —  —  —
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textMuted }]}>
            Menunggu kalkulasi...
          </Text>
        </View>
      )}

      <Text style={[styles.actionPrompt, { color: colors.primary }]}>
        Buka narasi kepribadian →
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 185,
    marginHorizontal: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  sequenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
    gap: 4,
    paddingBottom: 10,
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    position: 'relative',
  },
  nodeValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  nodeLabel: {
    fontSize: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
    position: 'absolute',
    bottom: -16,
    width: 50,
    textAlign: 'center',
  },
  arrow: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    paddingBottom: 2,
    marginHorizontal: 2,
  },
  emptyRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    letterSpacing: 4,
  },
  emptySubText: {
    fontSize: 9,
    marginTop: 2,
  },
  actionPrompt: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
});

export default ArcanaSequenceGridCard;
