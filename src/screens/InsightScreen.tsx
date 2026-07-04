import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '@constants/theme';

// TODO: Destiny Matrix insight/narrative generator not built yet — this
// needs a different approach than the old classical onnx-engine.ts
// (which was keyed to CoreMatrix fields like lifePath/personalDay that
// don't exist here). Placeholder until that's designed.
export function InsightScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Segera Hadir</Text>
        <Text style={styles.emptyText}>
          Insight naratif untuk Destiny Matrix sedang dalam pengembangan.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyTitle: { fontSize: FONT_SIZE.xl, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center' },
});
