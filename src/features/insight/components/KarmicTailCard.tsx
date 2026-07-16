import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useThemeStore } from '@store/theme-store';
import type { KarmicTailAnalysis } from '@core/destiny-matrix';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';
import { InsightCard } from './InsightCard';

interface Props {
  analysis: KarmicTailAnalysis;
}

export function KarmicTailCard({ analysis }: Props) {
  const colors = useThemeStore(state => state.getColors());

  return (
    <InsightCard icon="🎭" title="Karmic Tail">
      
      {/* 1. Aliran Kode Triad */}
      <View style={[styles.codeContainer, { backgroundColor: colors.primary + '12' }]}>
        <Text style={[styles.code, { color: colors.primary }]}>
          {analysis.values.C}{'  →  '}{analysis.values.C1}{'  →  '}{analysis.values.C2}
        </Text>
      </View>

      {/* 2. Judul Pola Karma */}
      <Text style={[styles.title, { color: colors.error }]}>
        {analysis.title}
      </Text>

      {/* 3. Akar Masalah Masa Lalu (Past Life Debt) - BARU */}
      {analysis.pastLifeDebt && (
        <View style={[styles.block, { borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            ⏳ Akar Hutang Karma (Masa Lalu)
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary, fontStyle: 'italic' }]}>
            {analysis.pastLifeDebt}
          </Text>
        </View>
      )} 

      {/* 4. Manifestasi Kehidupan Sekarang */}
      <View style={[styles.block, { borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.primary }]}>
          👁️ Manifestasi Saat Ini
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          {analysis.manifestation}
        </Text>
      </View>

      {/* 5. Jebakan / Pemicu Bayangan (Current Triggers) - BARU */}
      {analysis.currentTriggers && (
        <View style={[styles.block, { borderColor: colors.error + '30', backgroundColor: colors.error + '05' }]}>
          <Text style={[styles.label, { color: colors.error }]}>
            ⚠️ Jebakan Harian (Shadow Triggers)
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            {analysis.currentTriggers}
          </Text>
        </View>
      )}

      {/* 6. Jalan Penyembuhan (Healing Way) */}
      <View style={[styles.block, { borderColor: colors.border }]}>
        <Text style={[styles.label, { color: '#10b981' }]}>
          🌱 Jalan Penyembuhan
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          {analysis.healingWay}
        </Text>
      </View>

      {/* 7. Mantra Afirmasi (Affirmation) - BARU */}
      {analysis.affirmation && (
        <View style={[styles.quoteBox, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '40' }]}>
          <Text style={[styles.quoteTitle, { color: colors.primary }]}>✨ Mantra Penyelaras Jiwa</Text>
          <Text style={[styles.quoteText, { color: colors.text }]}>
            "{analysis.affirmation}"
          </Text>
        </View>
      )}

    </InsightCard>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    alignSelf: 'center',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  code: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  block: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
  },
  quoteBox: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderLeftWidth: 4,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  quoteTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  quoteText: {
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    lineHeight: 22,
  },
});

export default KarmicTailCard;
