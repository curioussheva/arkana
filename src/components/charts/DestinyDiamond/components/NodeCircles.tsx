// src/components/charts/DestinyDiamond/components/NodeCircles.tsx
import React from 'react';
import { Group, Circle, LinearGradient, vec, Shadow, BlurMask } from '@shopify/react-native-skia';

interface NodeCirclesProps {
  allNodes: any[];
  highlightedPointKey: string | null;
  activeFilterValue: string | null;
  filteredNodes: any[];
  palette: any;
  showSpark: boolean;
}

export const NodeCircles: React.FC<NodeCirclesProps> = ({
  allNodes,
  highlightedPointKey,
  activeFilterValue,
  filteredNodes,
  palette,
  showSpark,
}) => {
  return (
    <Group>
      {allNodes.map(node => {
        const isFilteredOut = activeFilterValue
          ? !filteredNodes.some(fn => fn.key === node.key)
          : false;
        const baseOpacity = isFilteredOut ? 0.15 : 1;

        // Semua node (termasuk E dan B) sekarang seragam pakai warna
        // kategori aktif — sebelumnya E=kuning dan B=ungu di-hardcode,
        // padahal tidak merepresentasikan sistem apa pun (dan tabrakan
        // makna dengan tab Chakra yang sudah ada sendiri).
        const gradientColors: [string, string] = node.fillColors ??
          palette.nodeBg ?? ['#1F1D27', '#0A090D'];
        const borderColor = node.strokeColor ?? palette.goldPrimary;

        return (
          <Group key={`node-${node.key}`} opacity={baseOpacity}>
            {/* Aura highlight */}
            {(highlightedPointKey === node.key || (!isFilteredOut && activeFilterValue)) && (
              <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius * 2.2}>
                <LinearGradient
                  start={vec(node.pixel.x - node.radius, node.pixel.y - node.radius)}
                  end={vec(node.pixel.x + node.radius, node.pixel.y + node.radius)}
                  colors={[palette.goldGlow, 'transparent']}
                />
                <BlurMask blur={node.radius * 2} style="normal" />
              </Circle>
            )}

            {/* Badan node */}
            <Circle cx={node.pixel.x} cy={node.pixel.y} r={node.radius}>
              <LinearGradient
                start={vec(node.pixel.x - node.radius, node.pixel.y - node.radius)}
                end={vec(node.pixel.x + node.radius, node.pixel.y + node.radius)}
                colors={gradientColors}
              />
              <Shadow dx={0} dy={2} blur={4} color="rgba(0,0,0,0.7)" />
            </Circle>

            {/* Border node */}
            <Circle
              cx={node.pixel.x}
              cy={node.pixel.y}
              r={node.radius}
              style="stroke"
              strokeWidth={1.0}
              color={borderColor}
            />

            {/* Spark (cahaya kecil) */}
            {showSpark && !isFilteredOut && (
              <Circle
                cx={node.pixel.x - node.radius * 0.2}
                cy={node.pixel.y - node.radius * 0.2}
                r={node.radius * 0.25}
                color={palette.spark}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
};
