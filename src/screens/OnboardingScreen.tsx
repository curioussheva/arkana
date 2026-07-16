// src/screens/OnboardingScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { 
  FadeInRight, 
  FadeOutLeft,
  Layout
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@constants/theme';

import { LOGO_IMG } from '@constants/images';


const slides = [
  { isLogo: true, title: 'Selamat Datang di Arkana', desc: 'Temukan peta takdir hidup kuno dan cetak biru jiwamu melalui sistem kalkulasi Destiny Matrix.' },
  { icon: '🔮', title: 'Matrix Takdirmu', desc: 'Petakan rincian Karmic Tail, Love Line, hingga Money Line strategis hanya melalui tanggal lahir Anda.' },
  { icon: '🌟', title: 'Pahami Diri Lebih Dalam', desc: 'Dapatkan transformasi insight spiritual, analisis chakra internal, dan panduan navigasi hidup yang akurat.' },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const colors = useThemeStore(state => state.getColors());

  const nextSlide = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    }
  }, [currentIndex, onComplete]);

  const currentSlide = slides[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Konten Slide dengan Animasi Transisi Samping */}
      <View style={styles.slideContainer}>
        <Animated.View 
          key={currentIndex} // Paksa re-render animasi memasuki/keluar setiap indeks berganti
          entering={FadeInRight.duration(400)}
          exiting={FadeOutLeft.duration(400)}
          style={styles.slide}
        >
          {currentSlide.isLogo ? (
            <Image 
              source={LOGO_IMG} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.icon}>{currentSlide.icon}</Text>
          )}
          
          <Text style={[styles.title, { color: colors.text }]}>
            {currentSlide.title}
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {currentSlide.desc}
          </Text>
        </Animated.View>
      </View>

      {/* Indikator Titik (Dots) Berbasis Tema Aktif */}
      <View style={styles.dotsContainer}>
        {slides.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <Animated.View 
              layout={Layout.springify()}
              key={idx} 
              style={[
                styles.dot, 
                { backgroundColor: isActive ? colors.primary : colors.border },
                isActive && styles.activeDot
              ]} 
            />
          );
        })}
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }, SHADOWS.md]} 
        onPress={nextSlide}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Mulai Perjalanan' : 'Lanjutkan'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: SPACING.xl,
    justifyContent: 'space-between'
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: { 
    alignItems: 'center', 
    width: '100%',
    paddingHorizontal: SPACING.md
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 40,
  },
  icon: { 
    fontSize: 100, 
    marginBottom: 40,
    textAlign: 'center'
  },
  title: { 
    fontSize: FONT_SIZE['3xl'], 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: SPACING.md,
    lineHeight: 38
  },
  desc: { 
    fontSize: FONT_SIZE.md, 
    textAlign: 'center', 
    lineHeight: 24, 
    paddingHorizontal: SPACING.sm 
  },
  dotsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginVertical: SPACING.xl 
  },
  dot: { 
    height: 8, 
    borderRadius: 4, 
    marginHorizontal: 4 
  },
  activeDot: { 
    width: 24 
  },
  button: { 
    borderRadius: BORDER_RADIUS.xl, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md
  },
  buttonText: { 
    color: '#ffffff', 
    fontSize: FONT_SIZE.md, 
    fontWeight: '700' 
  },
});
