import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';
import { useAppStore } from '@store/app-store';

export function InsightScreen() {
  const insight = useAppStore((state) => state.currentInsight);

  if (!insight) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Belum Ada Insight</Text>
          <Text style={styles.emptyText}>Pergi ke Beranda untuk generate insight AI</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Insight AI</Text>
        <View style={styles.insightCard}>
          <Text style={styles.narrative}>{insight.narrative}</Text>
          <Text style={styles.confidence}>Confidence: {Math.round(insight.confidence * 100)}%</Text>
        </View>
        
        <Text style={styles.subTitle}>Rekomendasi</Text>
        {insight.recommendations.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskType}>{task.type.toUpperCase()}</Text>
            <Text style={styles.taskAction}>{task.action}</Text>
            <Text style={styles.taskDesc}>{task.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  subTitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyTitle: { fontSize: FONT_SIZE.xl, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center' },
  insightCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  narrative: { fontSize: FONT_SIZE.md, color: COLORS.text, lineHeight: 24 },
  confidence: { fontSize: FONT_SIZE.sm, color: COLORS.primaryLight, marginTop: SPACING.sm },
  taskCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  taskType: { fontSize: FONT_SIZE.xs, color: COLORS.primaryLight, fontWeight: '600', marginBottom: SPACING.xs },
  taskAction: { fontSize: FONT_SIZE.md, color: COLORS.text, fontWeight: '600' },
  taskDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
});
