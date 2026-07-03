import React from 'react';
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
