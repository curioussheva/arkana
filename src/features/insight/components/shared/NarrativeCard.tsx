// Berkas: src/features/insight/components/shared/NarrativeCard.tsx

import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

import { useThemeStore } from '@store/theme-store';

import type { DestinyInsight } from '@core/destiny-matrix';

import {
  BORDER_RADIUS,
  FONT_SIZE,
  SPACING
} from '@constants/theme';

// 🎯 KOREKSI PATH: Jika InsightCard berada di folder yang sama (components/shared/)
import { InsightCard } from './InsightCard'; 

// 💡 CATATAN HINT: Jika Metro bundler masih protes setelah kode di atas, 
// artinya InsightCard berada di folder luar (components/). Ubah baris 33 menjadi:
// import { InsightCard } from '../InsightCard';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface Props {
  insight?: DestinyInsight;
  customText?: string;
  title?: string;
}

export function NarrativeCard({
  insight,
  customText,
  title = 'Narasi Spiritual',
}: Props) {
  const colors = useThemeStore(s => s.getColors());
  const [expanded, setExpanded] = useState(false);

  const glow = useSharedValue(0.25);

  React.useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 1800 }),
        withTiming(0.15, { duration: 1800 }),
      ),
      -1,
      true,
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const fullText = customText ?? insight?.narrative ?? '';

  const text = useMemo(() => {
    if (expanded || fullText.length < 320) {
      return fullText;
    }
    return fullText.slice(0, 320) + '...';
  }, [expanded, fullText]);

  const showButton = fullText.length > 320;

  return (
    <InsightCard title={title} icon="✨">
      <AnimatedGradient
        pointerEvents="none"
        colors={[colors.primary + '18', 'transparent', colors.primary + '08']}
        style={[StyleSheet.absoluteFillObject, styles.glow, glowStyle]}
      />

      <Text style={[styles.text, { color: colors.text }]}>
        {text}
      </Text>

      {showButton && (
        <TouchableOpacity style={styles.button} onPress={() => setExpanded(!expanded)}>
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            {expanded ? '▲ Tampilkan Lebih Sedikit' : '▼ Baca Selengkapnya'}
          </Text>
        </TouchableOpacity>
      )}
    </InsightCard>
  );
}

const styles = StyleSheet.create({
  glow: {
    borderRadius: BORDER_RADIUS['2xl'],
  },
  text: {
    fontSize: FONT_SIZE.md,
    lineHeight: 28,
  },
  button: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
});
 
export default NarrativeCard;
