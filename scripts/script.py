
project_root = "/data/data/com.termux/files/home/arkana/numerology-engine" 
# 4. Fix HomeScreen.tsx - proper imports and ScrollView placement
home_screen = """import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@store/app-store';
import { useNumerology } from '@hooks/use-numerology';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { formatDate } from '@core/utils/date-utils';
import { MatrixGrid } from '@components/charts/MatrixGrid';
import { ArkanaCard } from '@components/ui/ArkanaCard';
import type { NumerologyInput } from '@core/numerology/types';

export function HomeScreen() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const { calculateWithInsight, isLoading, matrix, insight, error } = useNumerology();

  const handleCalculate = async () => {
    if (!name.trim() || !birthDate.trim()) {
      Alert.alert('Input Required', 'Mohon isi nama dan tanggal lahir');
      return;
    }

    const dateRegex = /^\\d{4}-\\d{2}-\\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      Alert.alert('Format Salah', 'Tanggal lahir harus format YYYY-MM-DD');
      return;
    }

    try {
      const input: NumerologyInput = {
        birthDate,
        name: name.trim(),
      };
      await calculateWithInsight(input);
    } catch (err) {
      Alert.alert('Error', error || 'Terjadi kesalahan');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Numerology Engine</Text>
            <Text style={styles.subtitle}>Jelajahi energi numerologi Anda</Text>
          </View>

          {/* Input Form */}
          <View style={styles.formCard}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="words"
              editable={!isLoading}
            />

            <Text style={styles.label}>Tanggal Lahir (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="Contoh: 1995-08-15"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleCalculate}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.buttonText}>Hitung Matriks Energi</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Results */}
          {matrix && (
            <View style={styles.resultsContainer}>
              {/* Core Numbers */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Angka Utama</Text>
                <View style={styles.numbersGrid}>
                  <NumberCard label="Life Path" value={matrix.matrix.lifePath} />
                  <NumberCard label="Destiny" value={matrix.matrix.destiny} />
                  <NumberCard label="Soul Urge" value={matrix.matrix.soulUrge} />
                  <NumberCard label="Personality" value={matrix.matrix.personality} />
                  <NumberCard label="Expression" value={matrix.matrix.expression} />
                  <NumberCard label="Birthday" value={matrix.matrix.birthday} />
                </View>
              </View>

              {/* Personal Cycle */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Siklus Personal</Text>
                <View style={styles.cycleRow}>
                  <CycleCard label="Personal Year" value={matrix.matrix.personalYear} />
                  <CycleCard label="Personal Month" value={matrix.matrix.personalMonth} />
                  <CycleCard label="Personal Day" value={matrix.matrix.personalDay} />
                </View>
              </View>

              {/* Energy Grid */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Grid Energi</Text>
                <MatrixGrid matrix={matrix} />
              </View>

              {/* Arkana */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Kartu Arkana</Text>
                <ArkanaCard arkana={matrix.arkana} />
              </View>

              {/* AI Insight */}
              {insight && (
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Insight AI</Text>
                  <View style={styles.insightCard}>
                    <Text style={styles.insightText}>{insight.narrative}</Text>
                    <View style={styles.confidenceBadge}>
                      <Text style={styles.confidenceText}>
                        Confidence: {Math.round(insight.confidence * 100)}%
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.subSectionTitle}>Rekomendasi Hari Ini</Text>
                  {insight.recommendations.map((task) => (
                    <View key={task.id} style={styles.taskCard}>
                      <View style={styles.taskHeader}>
                        <Text style={styles.taskType}>{task.type.toUpperCase()}</Text>
                        <Text style={styles.taskPriority}>{task.priority}</Text>
                      </View>
                      <Text style={styles.taskAction}>{task.action}</Text>
                      <Text style={styles.taskDescription}>{task.description}</Text>
                      <Text style={styles.taskDuration}>⏱ {task.duration}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Calculated At */}
              <Text style={styles.timestamp}>
                Dihitung: {formatDate(matrix.calculatedAt)}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Sub Components ─────────────────────────────────────────────

function NumberCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.numberCard}>
      <Text style={styles.numberValue}>{value}</Text>
      <Text style={styles.numberLabel}>{label}</Text>
    </View>
  );
}

function CycleCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.cycleCard}>
      <Text style={styles.cycleValue}>{value}</Text>
      <Text style={styles.cycleLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  resultsContainer: {
    gap: SPACING.lg,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subSectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  numberCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
  },
  numberValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  numberLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  cycleRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cycleCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
  },
  cycleValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  cycleLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  insightCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  insightText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  confidenceBadge: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
  taskCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  taskType: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  taskPriority: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.accent,
    fontWeight: '500',
  },
  taskAction: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  taskDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  taskDuration: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  timestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
"""

with open(f"{project_root}/src/screens/HomeScreen.tsx", "w") as f:
    f.write(home_screen)

# 5. Fix MatrixScreen.tsx - proper ScrollView import
matrix_screen = """import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '@constants/theme';
import { useAppStore } from '@store/app-store';
import { MatrixGrid } from '@components/charts/MatrixGrid';

export function MatrixScreen() {
  const matrix = useAppStore((state) => state.currentMatrix);

  if (!matrix) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Belum Ada Matriks</Text>
          <Text style={styles.emptyText}>Pergi ke Beranda untuk menghitung matriks energi Anda</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Matriks Energi</Text>
        <MatrixGrid matrix={matrix} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyTitle: { fontSize: FONT_SIZE.xl, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center' },
});
"""

with open(f"{project_root}/src/screens/MatrixScreen.tsx", "w") as f:
    f.write(matrix_screen)

# 6. Fix SettingsScreen.tsx - proper ScrollView import
settings_screen = """import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { useAppStore } from '@store/app-store';

export function SettingsScreen() {
  const { options, setOptions } = useAppStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pengaturan</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perhitungan</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Master Numbers</Text>
            <Switch
              value={options.includeMasterNumbers}
              onValueChange={(v) => setOptions({ includeMasterNumbers: v })}
              trackColor={{ false: COLORS.backgroundLight, true: COLORS.primary }}
            />
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Karmic Debt</Text>
            <Switch
              value={options.includeKarmicDebt}
              onValueChange={(v) => setOptions({ includeKarmicDebt: v })}
              trackColor={{ false: COLORS.backgroundLight, true: COLORS.primary }}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bahasa</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setOptions({ language: options.language === 'id' ? 'en' : 'id' })}
          >
            <Text style={styles.buttonText}>
              {options.language === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  label: { fontSize: FONT_SIZE.md, color: COLORS.text },
  button: { backgroundColor: COLORS.backgroundLight, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  buttonText: { fontSize: FONT_SIZE.md, color: COLORS.text, fontWeight: '500' },
});
"""

with open(f"{project_root}/src/screens/SettingsScreen.tsx", "w") as f:
    f.write(settings_screen)

print("✅ All screens fixed for SDK 54")