import React from 'react';
import { Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import { Platform } from 'react-native';
import { TIMELINE_AGE_LABELS, POINT_LAYOUT } from '@core/destiny-matrix/layout';

interface TimelineAgeLabelsProps {
  origin: number;
  contentRadius: number;
  textColor: string;
}

export const TimelineAgeLabels: React.FC<TimelineAgeLabelsProps> = ({
  origin,
  contentRadius,
  textColor,
}) => {
  const font = matchFont({
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontSize: 10,
    fontWeight: 'bold',
  });

  if (!font) return null;

  return (
    <>
      {Object.entries(TIMELINE_AGE_LABELS).map(([key, label]) => {
        const coords = POINT_LAYOUT[key];
        if (!coords) return null;

        const px = origin + coords.x * contentRadius;
        const py = origin + coords.y * contentRadius;

        // Vektor dorong radial ke arah luar agar label tidak menindih node
        const len = Math.hypot(coords.x, coords.y) || 1;
        const pushDistance = 22; // Jarak offset aman dari pusat node
        const ox = (coords.x / len) * pushDistance;
        const oy = (coords.y / len) * pushDistance;

        const tw = font.getTextWidth?.(label) ?? label.length * 6;
        const x = px + ox - tw / 2;
        const y = py + oy + 3.5;

        return (
          <SkiaText
            key={`timeline-age-${key}`}
            x={x}
            y={y}
            text={label}
            font={font}
            color={textColor}
            opacity={0.88}
          />
        );
      })}
    </>
  );
};
