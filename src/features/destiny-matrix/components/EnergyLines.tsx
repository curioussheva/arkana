import React from 'react';
import { Svg, Line } from 'react-native-svg';

interface EnergyLinesProps {
  size: number;
  colors: any;
}

export function EnergyLines({ size, colors }: EnergyLinesProps) {
  const center = size / 2;
  const padding = 20;

  return (
    <Svg style={{ position: 'absolute', width: size, height: size }}>
      {/* Garis Langit / Vertikal (A ke B) */}
      <Line
        x1={center}
        y1={padding}
        x2={center}
        y2={size - padding}
        stroke={colors.primary + '50'}
        strokeWidth="1.5"
        strokeDasharray="4, 4"
      />
      {/* Garis Bumi / Horizontal (C ke D) */}
      <Line
        x1={padding}
        y1={center}
        x2={size - padding}
        y2={center}
        stroke={colors.primary + '50'}
        strokeWidth="1.5"
        strokeDasharray="4, 4"
      />
    </Svg>
  );
}
