import React, { useState } from 'react';
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
import { useNumerology } from '@hooks/use-numerology';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { formatDate, parseDate, DATE_FORMAT } from '@core/utils/date-utils';
import { MatrixGrid } from '@components/charts/MatrixGrid';
import { ArkanaCard } from '@components/ui/ArkanaCard';
import type { NumerologyInput } from '@core/numerology/types';

const ID_DATE_FORMAT = 'dd/MM/yyyy';

export function HomeScreen() {
  const [name, setName] = useState('');
  const [birthDateInput, setBirthDateInput] = useState(''); // DD/MM/YYYY as typed
  const { calculateWithInsight, isLoading, matrix, insight, error } = useNumerology();

  const handleBirthDateChange = (text: string) => {
    // Strip everything but digits, cap at 8 (ddmmyyyy), then auto-insert
    // slashes as the user types — standard Indonesian dd/mm/yyyy UX.
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setBirthDateInput(formatted);
  };

  const handleCalculate = async () => {
    if (!name.trim() || !birthDateInput.trim()) {
      Alert.alert('Input Required', 'Mohon isi nama dan tanggal lahir');
      return;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(birthDateInput)) {
      Alert.alert('Format Salah', 'Tanggal lahir harus format DD/MM/YYYY, contoh: 15/08/1995');
      return;
    }

    const parsedDate = parseDate(birthDateInput, ID_DATE_FORMAT);
    if (!parsedDate) {
      Alert.alert('Tanggal Tidak Valid', 'Periksa kembali tanggal lahir yang dimasukkan');
      return;
    }

    try {
      const input: NumerologyInput = {
        birthDate: formatDate(parsedDate, DATE_FORMAT), // convert to ISO YYYY-MM-DD internally
        name: name.trim(),
      };
      await calculateWithInsight(input);
    } catch {
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

            <Text style={styles.label}>Tanggal Lahir (DD/MM/YYYY)</Text>
            <TextInput
              style={styles.input}
              value={birthDateInput}
              onChangeText={handleBirthDateChange}
              placeholder="Contoh: 15/08/1995"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
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
 