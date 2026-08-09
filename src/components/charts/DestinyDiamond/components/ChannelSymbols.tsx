// src/components/charts/DestinyDiamond/components/ChannelSymbols.tsx
import React from 'react';
import { Group, Path, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import { Platform } from 'react-native';

interface ChannelSymbolsProps {
  toPixel: (key: string) => { x: number; y: number };
  palette: any;
}

export const ChannelSymbols: React.FC<ChannelSymbolsProps> = ({ toPixel, palette }) => {
  const moneyPt = toPixel('Money');
  const lovePt = toPixel('Love');

  // Font hanya untuk simbol $
  const symbolFont = matchFont({
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
    fontSize: 14,
    fontWeight: 'bold',
  });

  // Path sederhana untuk bentuk hati (ukuran kecil)
  const makeHeartPath = (cx: number, cy: number, size = 6) => {
    const s = size;
    return `
      M ${cx} ${cy + s * 0.3}
      C ${cx} ${cy + s * 0.3} ${cx - s} ${cy - s * 0.5} ${cx - s} ${cy - s * 0.1}
      C ${cx - s} ${cy + s * 0.4} ${cx} ${cy + s * 0.9} ${cx} ${cy + s * 0.9}
      C ${cx} ${cy + s * 0.9} ${cx + s} ${cy + s * 0.4} ${cx + s} ${cy - s * 0.1}
      C ${cx + s} ${cy - s * 0.5} ${cx} ${cy + s * 0.3} ${cx} ${cy + s * 0.3}
      Z
    `;
  };

  return (
    <Group>
      {/* Simbol $ (tetap pakai teks karena aman) */}
      {symbolFont && (
        <SkiaText
          x={moneyPt.x - 14}
          y={moneyPt.y - 4}
          text="$"
          font={symbolFont}
          color={palette.moneySymbol ?? '#84cc16'}
        />
      )}

      {/* Simbol Love — digambar sebagai Path, bukan teks */}
      <Path
        path={makeHeartPath(lovePt.x - 10, lovePt.y - 14, 7)}
        color={palette.loveSymbol ?? '#ef4444'}
        style="fill"
      />
    </Group>
  );
};
