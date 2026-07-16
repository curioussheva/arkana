import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useThemeStore } from '@store/theme-store';
import { useAppStore } from '@store/app-store';
import { calculatePersonalYearArcana } from '@core/destiny-matrix/personal-year';
import { ArcanaCard } from '@components/ui/ArcanaCard';


type ParamList = {
  PersonalYear: { year: number };
};

export function PersonalYearScreen() {
  const route = useRoute<RouteProp<ParamList, 'PersonalYear'>>();
  const navigation = useNavigation();
  const { year } = route.params;
  const colors = useThemeStore(state => state.getColors());
  const matrix = useAppStore(state => state.currentMatrix);

  const personalYear = useMemo(() => {
    if (!matrix) return null;
    return calculatePersonalYearArcana(matrix.input.birthDate, year);
  }, [matrix, year]);

  if (!personalYear) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.text }}>Data tidak tersedia</Text>
      </SafeAreaView>
    );
  }

  // Interpretasi tambahan (contoh sederhana, bisa diperkaya)
  const interpretation = getYearInterpretation(personalYear.arcana.id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={colors.gradients.headerGradient} style={styles.header}>
          <Text style={[styles.year, { color: colors.text }]}>{year}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Tahun Personal Anda</Text>
        </LinearGradient>
        
        <View style={styles.cardContainer}>
          <ArcanaCard arcana={personalYear.arcana} variant="full" showMeaning showKeywords />
        </View>
        
        <View style={[styles.interpretationBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.interpretationTitle, { color: colors.primary }]}>✨ Makna Tahun Ini</Text>
          <Text style={[styles.interpretationText, { color: colors.text }]}>{interpretation}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>Kembali ke Timeline</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Fungsi interpretasi dasar (nantinya bisa diganti dengan AI atau template lebih kaya)
function getYearInterpretation(cardNumber: number): string {
  const interpretations: Record<number, string> = {
    1: 'Tahun ini adalah awal baru. Ambil inisiatif, jangan ragu. Proyek yang dimulai sekarang akan bertumbuh.',
    2: 'Tahun untuk bersabar dan mendengarkan intuisi. Kerja sama dan diplomasi lebih efektif daripada aksi solo.',
    3: 'Tahun penuh kreativitas dan kelimpahan. Ekspresikan diri, nikmati keindahan, dan jangan takut untuk tampil.',
    // ... isi sampai 22
    22: 'Tahun kebebasan dan penyelesaian. Selesaikan siklus lama, bersiaplah untuk petualangan baru.',
  };
  return interpretations[cardNumber] || 'Tahun yang penuh potensi. Tetap fokus pada tujuan jiwa Anda.';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  header: {
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 24,
    alignItems: 'center',
  },
  year: { fontSize: 48, fontWeight: '800' },
  subtitle: { fontSize: 16, marginTop: 4 },
  cardContainer: { marginHorizontal: 24, marginBottom: 24 },
  interpretationBox: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  interpretationTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  interpretationText: { fontSize: 16, lineHeight: 24 },
  backButton: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});