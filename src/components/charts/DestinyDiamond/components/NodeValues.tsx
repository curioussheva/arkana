// src/components/charts/DestinyDiamond/components/NodeValues.tsx
import React from 'react';
import { Group, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import { Platform } from 'react-native';

interface NodeValuesProps {
  allNodes: Array<any>;
  activeFilterValue: string | null;
  filteredNodes: Array<any>;
  valueSuffix: string;
  palette: any;
}

// Floor font per tier — sebelumnya flat 9px untuk SEMUA tier, yang
// menyebabkan teks di tier kecil (channels/timeline) lebih besar dari
// lingkarannya sendiri dan meluber ke node tetangga. Nilai ini jangan
// naik lagi tanpa cek ulang jarak antar cincin di LAYOUT_RADII.
const MIN_FONT_SIZE_BY_TIER: Record<string, number> = {
  primary: 9,
  secondary: 8,
  chakra: 6.5,
  companions: 6.5,
  channels: 6,
  timeline: 6,
  powerCenters: 7.5,
  heartDesire: 6.5,
};

export const NodeValues: React.FC<NodeValuesProps> = ({
  allNodes,
  activeFilterValue,
  filteredNodes,
  valueSuffix,
  palette,
}) => {
  return (
    <>
      {allNodes.map(node => {
        const isFilteredOut = activeFilterValue
          ? !filteredNodes.some(fn => fn.key === node.key)
          : false;
        if (isFilteredOut) return null;

        const raw = node.point?.value;
        const valStr = `${raw ?? ''}${valueSuffix}`;

        const minFont = MIN_FONT_SIZE_BY_TIER[node.tier] ?? 9;
        const fontSize = Math.max(minFont, node.radius * 0.88);
        const font = matchFont({
          fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
          fontSize,
          fontWeight: 'bold',
        });
        if (!font) return null;

        const textWidth = font.getTextWidth?.(valStr) ?? fontSize * 0.55 * valStr.length;
        const x = node.pixel.x - textWidth / 2;
        const y = node.pixel.y + fontSize * 0.35;

        // Kontras teks sekarang otomatis dari fill node (node.textColor,
        // dihitung dari lightness warna kategori) — BUKAN hardcode per
        // key seperti sebelumnya (E selalu gelap, A/B selalu putih).
        // Itu asumsi yang salah begitu fill jadi dinamis ikut kategori.
        const txtColor = node.textColor ?? palette.defaultNodeText;

        return (
          <Group key={`skia-val-${node.key}`}>
            {/* Shadow/Stroke untuk keterbacaan di background apapun */}
            <SkiaText
              x={x + 0.5}
              y={y + 0.5}
              text={valStr}
              font={font}
              color={palette.labelShadow}
            />
            {/* Teks Utama */}
            <SkiaText x={x} y={y} text={valStr} font={font} color={txtColor} />
          </Group>
        );
      })}
    </>
  );
};
