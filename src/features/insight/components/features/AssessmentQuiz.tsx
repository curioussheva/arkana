import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { generateAssessmentForTitikE } from '@core/assessment/assessmentEngine';
import type { AssessmentState } from '@core/assessment/assessmentEngine';
import type { ArcanaDefinition } from '@core/arcana/types'; // 💡 KOREKSI IMPOR: Samakan path ke core/arcana/types agar type-safe

interface Props {
  arcanaE: ArcanaDefinition;
  currentState: AssessmentState | null;
  onAnswer: (state: AssessmentState) => void;
}
 
export function AssessmentQuiz({ arcanaE, currentState, onAnswer }: Props) {
  const colors = useThemeStore(s => s.getColors());

  const assessment = useMemo(
    () => generateAssessmentForTitikE(arcanaE),
    [arcanaE]
  );

  const handleSelect = (score: AssessmentState) => {
    // Jalankan haptics secara asinkron tanpa memblokir thread JavaScript utama
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onAnswer(score);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        🔮 {assessment.questionTitle}
      </Text>

      {assessment.options.map((opt, idx) => {
        // Cek apakah opsi ini adalah kondisi yang sedang aktif di state saat ini
        const isSelected = currentState === opt.score;

        return (
          <TouchableOpacity
            key={`opt-${idx}`} // 💡 HINDARI WARNING: Menggunakan prefix string agar unik bagi React Virtual DOM
            style={[
              styles.option, 
              { 
                borderColor: isSelected ? colors.primary : colors.border, 
                backgroundColor: isSelected ? colors.primary + '10' : colors.backgroundLight,
                borderWidth: isSelected ? 2 : 1 
              }
            ]}
            activeOpacity={0.7}
            onPress={() => handleSelect(opt.score)}
          >
            <Text style={[
              styles.optionText, 
              { 
                color: isSelected ? colors.primary : colors.text,
                fontWeight: isSelected ? '700' : '400'
              }
            ]}>
              {opt.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    borderRadius: BORDER_RADIUS.xl, 
    padding: SPACING.lg, 
    borderWidth: 1, 
    ...SHADOWS.md, 
    margin: SPACING.md 
  },
  title: { 
    fontSize: FONT_SIZE.md, 
    fontWeight: '700', 
    marginBottom: SPACING.md, 
    lineHeight: 24 
  },
  option: { 
    borderRadius: BORDER_RADIUS.lg, 
    padding: SPACING.md, 
    marginTop: SPACING.sm 
  },
  optionText: { 
    fontSize: FONT_SIZE.sm, 
    lineHeight: 20 
  },
});
 