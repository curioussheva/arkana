// src/components/charts/ArcanaWheel.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Path, BlurMask } from '@shopify/react-native-skia';
import { useThemeStore } from '@store/theme-store';
import type { ArkanaInfo } from '@core/numerology/types';

interface Props {
  arcanaSequence: ArkanaInfo[]; // array 8 arcana utama siklus takdir
  highlightIndex?: number;      // indeks yang disorot (opsional)
}

const ARCANE_COLORS: Record<string, string> = {
  Fire: '#FF6B35',
  Water: '#4ECDC4',
  Air: '#FFE66D',
  Earth: '#6B8E23',
};

export function ArcanaWheel({ arcanaSequence, highlightIndex = -1 }: Props) {
  const { width } = useWindowDimensions();
  const colors = useThemeStore(state => state.getColors());
  const size = Math.min(width - 64, 320);
  const radius = size / 2.5;
  const center = size / 2;

  // Menghitung koordinat posisi 8 titik di sekeliling roda oktagram
  const nodes = useMemo(() => {
    return arcanaSequence.map((arcana, i) => {
      // Mengurangi Math.PI / 2 agar titik pertama (indeks 0 / Titik A) berada tepat di atas (jam 12)
      const angle = (i / arcanaSequence.length) * Math.PI * 2 - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { ...arcana, x, y, angle, index: i };
    });
  }, [arcanaSequence, center, radius]);

  // 🔥 BARU: Membuat garis lintasan tertutup secara melingkar (A -> J -> E -> L -> C -> F -> H -> I -> A)
  const closedLoopPath = useMemo(() => {
    if (nodes.length === 0) return '';
    let pathStr = `M${nodes[0].x},${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      pathStr += ` L${nodes[i].x},${nodes[i].y}`;
    }
    pathStr += ' Z'; // 'Z' otomatis menyambungkan kembali titik terakhir ke titik awal (M)
    return pathStr;
  }, [nodes]);

  // 🔥 BARU: Membuat Garis Silang Internal Pembentuk Bintang Segi Delapan (Oktagram Konstruktif)
  // Menghubungkan sumbu diagonal utama (Utara-Selatan, Barat-Timur, dst)
  const crossLinesPath = useMemo(() => {
    if (nodes.length < 8) return '';
    return `
      M${nodes[0].x},${nodes[0].y} L${nodes[4].x},${nodes[4].y} 
      M${nodes[2].x},${nodes[2].y} L${nodes[6].x},${nodes[6].y}
      M${nodes[1].x},${nodes[1].y} L${nodes[5].x},${nodes[5].y}
      M${nodes[3].x},${nodes[3].y} L${nodes[7].x},${nodes[7].y}
    `;
  }, [nodes]);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundLight + '80' }]}>
      <Canvas style={{ width: size, height: size }}>
        {/* Lingkaran luar dekoratif */}
        <Circle cx={center} cy={center} r={radius + 20} color={colors.border + '30'} style="stroke" strokeWidth={1} />
        
        {/* Efek Cahaya / Glow Aura di Inti Roda */}
        <Circle cx={center} cy={center} r={radius * 0.25} color={colors.primary + '25'} style="fill" />
        <BlurMask blur={15} style="normal" />
        
        {/* 1. Gambar Garis Silang Internal (Cross-axes) */}
        {crossLinesPath ? (
          <Path path={crossLinesPath} style="stroke" strokeWidth={1} color={colors.border + '40'} />
        ) : null}

        {/* 2. Gambar Lintasan Perimeter Luar Tertutup */}
        {closedLoopPath ? (
          <Path path={closedLoopPath} style="stroke" strokeWidth={1.5} color={colors.primary + '60'} />
        ) : null}

        {/* 3. Render Node Lingkaran Skia */}
        {nodes.map((node, i) => {
          const isHighlighted = i === highlightIndex;
          const elementColor = ARCANE_COLORS[node.element] || colors.primary;
          return (
            <React.Fragment key={`${node.card}-${i}`}>
              {/* Efek Glow Luar jika Node sedang di-highlight */}
              {isHighlighted && (
                <Circle cx={node.x} cy={node.y} r={26} color={elementColor + '30'} style="fill" />
              )}
              {/* Lingkaran Titik Utama */}
              <Circle
                cx={node.x}
                cy={node.y}
                r={isHighlighted ? 18 : 14}
                color={isHighlighted ? elementColor : colors.surface}
                style="fill"
              />
              {/* Border lingkaran agar terlihat kontras */}
              <Circle
                cx={node.x}
                cy={node.y}
                r={isHighlighted ? 18 : 14}
                color={isHighlighted ? elementColor : colors.border}
                style="stroke"
                strokeWidth={1}
              />
            </React.Fragment>
          );
        })} 
      </Canvas>

      {/* Layer Teks Angka Numerologi di atas Canvas */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }} pointerEvents="none">
        {nodes.map((node, i) => {
          const isHighlighted = i === highlightIndex;
          return (
            <View
              key={`label-${node.card}-${i}`}
              style={{
                position: 'absolute',
                left: node.x - 15,
                top: node.y - 15,
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text 
                style={{ 
                  color: isHighlighted ? '#FFFFFF' : colors.text, 
                  fontSize: isHighlighted ? 12 : 11, 
                  fontWeight: '700' 
                }}
              >
                {node.number}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
});
 