// src/screens/OnboardingScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@constants/theme';

const slides = [
  { icon: '🔮', title: 'Selamat Datang di Arkana', desc: 'Temukan peta takdir hidupmu melalui sistem Destiny Matrix.' },
  { icon: '💎', title: 'Matrix Takdirmu', desc: 'Hitung Karmic Tail, Love Line, dan Money Line hanya dari tanggal lahir.' },
  { icon: '🌟', title: 'Pahami Dirimu Lebih Dalam', desc: 'Dapatkan insight spiritual dan panduan hidup yang akurat.' },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const colors = useThemeStore(state => state.getColors());

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInRight.duration(800)} style={styles.slide}>
        <Text style={styles.icon}>{slides[currentIndex].icon}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{slides[currentIndex].title}</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>{slides[currentIndex].desc}</Text>
      </Animated.View>

      <View style={styles.dots}>
        {slides.map((_, idx) => (
          <View key={idx} style={[styles.dot, idx === currentIndex && styles.activeDot]} />
        ))}
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={nextSlide}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Mulai Perjalanan' : 'Lanjutkan'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl, justifyContent: 'center' },
  slide: { alignItems: 'center', marginBottom: 60 },
  icon: { fontSize: 110, marginBottom: 40 },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: FONT_SIZE.lg, textAlign: 'center', lineHeight: 26, paddingHorizontal: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 60 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#334155', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#60a5fa', width: 24 },
  button: { borderRadius: BORDER_RADIUS.xl, paddingVertical: 18, alignItems: 'center', marginHorizontal: 20 },
  buttonText: { color: '#ffffff', fontSize: FONT_SIZE.lg, fontWeight: '700' },
}); 