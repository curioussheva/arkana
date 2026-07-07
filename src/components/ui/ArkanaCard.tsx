// src/components/ui/ArkanaCard.tsx
import React, { memo, useMemo } from 'react';
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { getArkanaImage } from '@constants/arkana-images';
import type { ArkanaInfo } from '@core/numerology/types';

interface Props {
  arkana: ArkanaInfo;
  variant?: 'compact' | 'full' | 'preview';
  onPress?: () => void;
  showImage?: boolean;
  showKeywords?: boolean;
  showMeaning?: boolean;
  imageWidth?: number;
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#FF6B35',
  Water: '#4ECDC4',
  Air: '#FFE66D',
  Earth: '#6B8E23',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ArkanaCard = memo(function ArkanaCard({
  arkana,
  variant = 'full',
  onPress,
  showImage = true,
  showKeywords = true,
  showMeaning = true,
  imageWidth: customImageWidth,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const colors = useThemeStore(state => state.getColors());
  const scale = useSharedValue(1);

  const elementColor = ELEMENT_COLORS[arkana.element] || colors.primary;

  const imageDimensions = useMemo(() => {
    if (!showImage) return null;
    if (variant === 'compact') return { width: 60, height: 100 };
    if (variant === 'preview') return { width: 120, height: 200 };
    
    const maxWidth = customImageWidth || Math.min(screenWidth - SPACING.lg * 2, 280);
    return { width: maxWidth, height: maxWidth / 0.6 };
  }, [variant, showImage, customImageWidth, screenWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) scale.value = withSpring(0.97);
  };
  const handlePressOut = () => {
    if (onPress) scale.value = withSpring(1);
  };

  const imageSource = getArkanaImage(arkana.card);

  const content = (
    <View
      style={[
        styles.card,
        variant === 'compact' ? styles.compactCard : styles.fullCard,
        { borderColor: elementColor, backgroundColor: colors.surface },
      ]}
    >
      {showImage && imageDimensions && (
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={[styles.cardImage, { width: imageDimensions.width, height: imageDimensions.height }]}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { width: imageDimensions.width, height: imageDimensions.height },
              ]}
            >
              <Text style={{ color: colors.textMuted }}>🃏</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.header}>
        <Text style={[styles.number, { color: colors.textMuted }]}>#{arkana.number}</Text>
        <View style={[styles.elementBadge, { backgroundColor: elementColor + '30' }]}>
          <Text style={[styles.elementText, { color: elementColor }]}>{arkana.element}</Text>
        </View>
      </View>
      <Text
        style={[styles.name, { color: colors.text }]}
        numberOfLines={variant === 'compact' ? 1 : undefined}
      >
        {arkana.card}
      </Text>
      {showKeywords && variant !== 'compact' && (
        <View style={styles.keywords}>
          {arkana.keywords.map((keyword, i) => (
            <View key={i} style={[styles.keywordBadge, { backgroundColor: colors.backgroundLight }]}>
              <Text style={[styles.keywordText, { color: colors.textSecondary }]}>{keyword}</Text>
            </View>
          ))}
        </View>
      )}
      {showMeaning && variant === 'full' && (
        <Text style={[styles.meaning, { color: colors.textSecondary }]}>{arkana.uprightMeaning}</Text>
      )}
    </View>
  );
// Tambahkan ini di dalam komponen ArkanaCard sebelum return:
console.log("Nama Kartu:", arkana.card);
console.log("Source Gambar:", imageSource); 

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }
  return content;
});

 
const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.xl,
    borderLeftWidth: 4,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  compactCard: {
    padding: SPACING.sm,
  },
  fullCard: {
    padding: SPACING.lg,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardImage: {
    borderRadius: BORDER_RADIUS.lg,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: BORDER_RADIUS.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  number: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  elementBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  elementText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  keywordBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  keywordText: {
    fontSize: FONT_SIZE.xs,
  },
  meaning: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
});
 