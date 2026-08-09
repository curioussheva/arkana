import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { getArcanaImage } from '@constants/arcana-images';

interface Props {
  arcana: any; // Diubah sementara ke any untuk melompati proteksi strict type yang tidak akurat di runtime
  variant?: 'compact' | 'preview' | 'full';
  showImage?: boolean;
  showKeywords?: boolean;
  showMeaning?: boolean;
  imageWidth?: number;
  onPress?: () => void;
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#FF6B35',
  Water: '#4ECDC4',
  Air: '#FFE66D',
  Earth: '#6B8E23',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ArcanaCard = memo(function ArcanaCard({
  arcana,
  variant = 'full',
  showImage = true,
  showKeywords = true,
  showMeaning = true,
  imageWidth,
  onPress,
}: Props) {
  const colors = useThemeStore(s => s.getColors());
  const { width: screenWidth } = useWindowDimensions();
  const scale = useSharedValue(1);

  // 1. DETEKSI NAMA KARTU (Fallback Multi-Kunci)
  const cardNameKey =
    arcana.tarotName ||
    arcana.card ||
    arcana.name ||
    arcana.title ||
    arcana.matrixName ||
    'Unknown Arcana';

  // 2. DETEKSI ID / NOMOR (Fallback Multi-Kunci)
  const cardId = arcana.id || arcana.number || arcana.arcanaNumber || '';

  const imageSource = getArcanaImage(cardNameKey);
  const elementColor = ELEMENT_COLORS[arcana.element] ?? colors.primary;

  // Debugging internal untuk melihat apa isi asli objek data di terminal/console log kamu
  console.log('--- DEBUG ARCANA CARD ---');
  console.log('Data Mentah Arcana:', JSON.stringify(arcana));
  console.log('Nama Terdeteksi:', cardNameKey);
  console.log('Source Gambar Terdeteksi:', imageSource);

  const imageDimensions = useMemo(() => {
    if (!showImage) return null;

    switch (variant) {
      case 'compact':
        return { width: 60, height: 90 };
      case 'preview':
        return { width: 120, height: 180 };
      default: {
        const maxWidth = imageWidth || Math.min(screenWidth - SPACING.lg * 2 - 32, 280);
        return { width: maxWidth, height: maxWidth * 1.5 };
      }
    }
  }, [variant, showImage, imageWidth, screenWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) scale.value = withSpring(0.97);
  };
  const handlePressOut = () => {
    if (onPress) scale.value = withSpring(1);
  };

  const content = (
    <View
      style={[
        styles.card,
        variant === 'compact' ? styles.compactCard : styles.fullCard,
        {
          borderColor: elementColor,
          backgroundColor: colors.surface,
        },
      ]}
    >
      {/* Container Gambar */}
      {showImage && imageDimensions && (
        <View
          style={[
            styles.imageContainer,
            { width: imageDimensions.width, height: imageDimensions.height },
          ]}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={[
                styles.cardImage,
                { width: imageDimensions.width, height: imageDimensions.height },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { width: imageDimensions.width, height: imageDimensions.height },
              ]}
            >
              <Text style={{ color: colors.textMuted, fontSize: FONT_SIZE.lg }}>🃏</Text>
            </View>
          )}
        </View>
      )}

      {/* Header Info Kartu */}
      <View style={styles.header}>
        <Text style={[styles.number, { color: colors.textMuted }]}>#{cardId}</Text>
        <View style={[styles.elementBadge, { backgroundColor: elementColor + '30' }]}>
          <Text style={[styles.elementText, { color: elementColor }]}>
            {arcana.element || 'Universal'}
          </Text>
        </View>
      </View>

      {/* Judul Nama Kartu (DIPAKSA MUNCUL) */}
      <Text
        style={[styles.name, { color: colors.text }]}
        numberOfLines={variant === 'compact' ? 1 : undefined}
      >
        {cardNameKey}
      </Text>

      {/* Daftar Keywords */}
      {showKeywords && variant !== 'compact' && arcana.keywords && (
        <View style={styles.keywords}>
          {arcana.keywords.map((keyword: string, i: number) => (
            <View
              key={i}
              style={[styles.keywordBadge, { backgroundColor: colors.backgroundLight }]}
            >
              <Text style={[styles.keywordText, { color: colors.textSecondary }]}>{keyword}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Deskripsi Makna */}
      {showMeaning && variant === 'full' && (
        <Text style={[styles.meaning, { color: colors.textSecondary }]}>
          {arcana.uprightMeaning || arcana.meaning}
        </Text>
      )}
    </View>
  );

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
    marginBottom: SPACING.md,
    ...(SHADOWS.md as ViewStyle),
  },
  compactCard: {
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullCard: {
    padding: SPACING.lg,
    flexDirection: 'column',
  },
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
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
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  elementText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  name: {
    fontSize: FONT_SIZE.xl,
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
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  keywordText: {
    fontSize: FONT_SIZE.xs,
  },
  meaning: {
    fontSize: FONT_SIZE.md,
    lineHeight: FONT_SIZE.md * 1.4,
  },
});
