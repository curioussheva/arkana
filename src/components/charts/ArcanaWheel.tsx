import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Path, BlurMask } from '@shopify/react-native-skia';
import { useThemeStore } from '@store/theme-store';
import type { ArkanaInfo } from '@core/numerology/types';

interface Props {
  arcanaSequence: ArkanaInfo[]; // array arcana yang membentuk siklus
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

  const nodes = useMemo(() => {
    return arcanaSequence.map((arcana, i) => {
      const angle = (i / arcanaSequence.length) * Math.PI * 2 - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { ...arcana, x, y, angle, index: i };
    });
  }, [arcanaSequence, center, radius]);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundLight + '80' }]}>
      <Canvas style={{ width: size, height: size }}>
        {/* Lingkaran luar */}
        <Circle cx={center} cy={center} r={radius + 20} color={colors.border} style="stroke" strokeWidth={1} />
        {/* Lingkaran dalam */}
        <Circle cx={center} cy={center} r={radius * 0.3} color={colors.primary + '30'} />
        <BlurMask blur={10} style="normal" />
        
        {nodes.map((node, i) => {
  const isHighlighted = i === highlightIndex;
  const elementColor = ARCANE_COLORS[node.element] || colors.primary;
  return (
    <React.Fragment key={`${node.card}-${i}`}>
      {/* garis */}
      {i < nodes.length - 1 && (
        <Path
          path={`M${node.x},${node.y} L${nodes[i + 1].x},${nodes[i + 1].y}`}
          style="stroke"
          strokeWidth={1}
          color={colors.border + '50'}
        />
      )}
      {/* lingkaran node */}
      <Circle
        cx={node.x}
        cy={node.y}
        r={isHighlighted ? 24 : 16}
        color={isHighlighted ? elementColor : colors.surface}
        style="fill"
      />
      {isHighlighted && (
        <Circle cx={node.x} cy={node.y} r={28} color={elementColor + '40'} style="fill" />
      )}
    </React.Fragment>
  );
})} 
        
      </Canvas>
      <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}>
  {nodes.map((node, i) => (
    <View
      key={`label-${node.card}-${i}`}
      style={{
        position: 'absolute',
        left: node.x - 12,
        top: node.y - 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: i === highlightIndex ? '#FFFFFF' : colors.text, fontSize: 12, fontWeight: '700' }}>
        {node.number}
      </Text>
    </View>
  ))}
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});