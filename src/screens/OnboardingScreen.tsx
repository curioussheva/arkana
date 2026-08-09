import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { LOGO_IMG } from '@constants/images';

const slides = [
  {
    isLogo: true,
    title: 'Selamat Datang di Arkana',
    desc: 'Temukan cetak biru jiwamu dan peta 20 koordinat takdir melalui sistem kalkulasi Destiny Matrix.',
  },
  {
    icon: '🔮',
    title: 'Matrix & Totem Sanctuary',
    desc: 'Bedah rincian Karmic Tail, analisis statistik arcana, hingga distribusi 4 pilar elemen penyeimbang realitas.',
  },
  {
    icon: '🌟',
    title: 'Pahami Diri Lebih Dalam',
    desc: 'Ukur tingkat keselarasan batin lewat Alur Evolusi Jiwa dan jelajahi aliansi arketipe bersama pasangan.',
  },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const colors = useThemeStore(state => state.getColors());

  const handleComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onComplete();
  }, [onComplete]);

  const nextSlide = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentIndex, handleComplete]);

  const currentSlide = slides[currentIndex];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      {/* Header Bar dengan Tombol Skip */}
      <View style={styles.headerBar}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={handleComplete} activeOpacity={0.6}>
            <Text style={[styles.skipText, { color: colors.textMuted }]}>Lewati</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      {/* Konten Slide dengan Animasi Transisi Samping */}
      <View style={styles.slideContainer}>
        <Animated.View
          key={currentIndex}
          entering={FadeInRight.duration(350)}
          exiting={FadeOutLeft.duration(350)}
          style={styles.slide}
        >
          {currentSlide.isLogo ? (
            <Image source={LOGO_IMG} style={styles.logoImage} resizeMode="contain" />
          ) : (
            <Text style={styles.icon}>{currentSlide.icon}</Text>
          )}

          <Text style={[styles.title, { color: colors.text }]}>{currentSlide.title}</Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{currentSlide.desc}</Text>
        </Animated.View>
      </View>

      {/* Bottom Controls Area */}
      <View style={styles.bottomArea}>
        {/* Indikator Titik (Dots) */}
        <View style={styles.dotsContainer}>
          {slides.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <Animated.View
                layout={LinearTransition.springify()}
                key={idx}
                style={[
                  styles.dot,
                  { backgroundColor: isActive ? colors.primary : colors.border },
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }, SHADOWS.sm]}
          onPress={nextSlide}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Mulai Perjalanan' : 'Lanjutkan'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  headerBar: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  skipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  logoImage: {
    width: 130,
    height: 130,
    marginBottom: 32,
  },
  icon: {
    fontSize: 88,
    marginBottom: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 34,
  },
  desc: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.xs,
  },
  bottomArea: {
    paddingBottom: SPACING.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
  },
  activeDot: {
    width: 24,
  },
  button: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
});

export default OnboardingScreen;
