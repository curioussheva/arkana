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
import { useDestinyMatrix } from '@hooks/use-destiny-matrix';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { formatDate, parseDate, DATE_FORMAT } from '@core/utils/date-utils';
import { ArkanaCard } from '@components/ui/ArkanaCard';
import { PointDetailModal, type DetailablePoint } from '@components/ui/PointDetailModal';
import { DestinyDiamond } from '@components/charts';
import { calculatePersonalYearArcana } from '@core/destiny-matrix/personal-year';
import type { DestinyMatrixInput, DestinyPoint } from '@core/destiny-matrix/types';

const ID_DATE_FORMAT = 'dd/MM/yyyy';

export function HomeScreen() {
  const [birthDateInput, setBirthDateInput] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<DetailablePoint | null>(null);
  const { calculate, isLoading, matrix, error } = useDestinyMatrix();

  const handleBirthDateChange = (text: string) => {
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
    if (!birthDateInput.trim()) {
      Alert.alert('Input Required', 'Mohon isi tanggal lahir');
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
      const input: DestinyMatrixInput = {
        birthDate: formatDate(parsedDate, DATE_FORMAT),
      };
      await calculate(input);
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
          <View style={styles.header}>
            <Text style={styles.title}>Destiny Matrix</Text>
            <Text style={styles.subtitle}>Jelajahi peta takdir Anda</Text>
          </View>

          <View style={styles.formCard}>
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
                <Text style={styles.buttonText}>Hitung Matriks Takdir</Text>
              )}
            </TouchableOpacity>
          </View>

          {matrix && (
            <View style={styles.resultsContainer}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Diagram Matriks</Text>
                <DestinyDiamond matrix={matrix} onPointPress={setSelectedPoint} />
              </View>

              {(() => {
                const personalYear = calculatePersonalYearArcana(matrix.input.birthDate);
                return (
                  <TouchableOpacity
                    style={styles.sectionCard}
                    activeOpacity={0.7}
                    onPress={() =>
                      setSelectedPoint({
                        key: 'PY',
                        label: `Arcana Tahun ${personalYear.year}`,
                        value: personalYear.personalYearValue,
                        arcana: personalYear.arcana,
                      })
                    }
                  >
                    <Text style={styles.sectionTitle}>Arcana Tahun {personalYear.year}</Text>
                    <Text style={styles.pointValue}>
                      {personalYear.personalYearValue} — {personalYear.arcana.card}
                    </Text>
                    <Text style={styles.pointLabel}>Tap untuk detail lengkap</Text>
                  </TouchableOpacity>
                );
              })()}

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>13 Titik Matriks</Text>
                {Object.values(matrix.points).map((point: DestinyPoint) => (
                  <TouchableOpacity
                    key={point.key}
                    style={styles.pointRow}
                    activeOpacity={0.7}
                    onPress={() => setSelectedPoint(point)}
                  >
                    <View style={styles.pointKeyBadge}>
                      <Text style={styles.pointKeyText}>{point.key}</Text>
                    </View>
                    <View style={styles.pointInfo}>
                      <Text style={styles.pointLabel}>{point.label}</Text>
                      <Text style={styles.pointValue}>
                        {point.value} — {point.arcana.card}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Esensi Jiwa (Titik E)</Text>
                <ArkanaCard arkana={matrix.points.E.arcana} />
              </View>

              <Text style={styles.timestamp}>
                Dihitung: {formatDate(matrix.calculatedAt)}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <PointDetailModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </SafeAreaView>
  );
}

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
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pointKeyBadge: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  pointKeyText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pointInfo: {
    flex: 1,
  },
  pointLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  pointValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
