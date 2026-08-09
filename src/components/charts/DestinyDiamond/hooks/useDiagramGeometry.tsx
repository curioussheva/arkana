import { useCallback } from 'react';
import { POINT_LAYOUT } from '@core/destiny-matrix/layout';

export function useDiagramGeometry(canvasSize: number) {
  // Gunakan faktor 0.35 agar label usia di lingkar luar tidak terpotong tepi layar
  const contentRadius = canvasSize * 0.38;
  const origin = canvasSize / 2;

  const toPixel = useCallback(
    (key: string) => {
      const coords = POINT_LAYOUT[key] || { x: 0, y: 0 };
      return {
        x: origin + coords.x * contentRadius,
        y: origin + coords.y * contentRadius,
        rawX: coords.x,
        rawY: coords.y,
      };
    },
    [origin, contentRadius]
  );

  const pathFromKeys = useCallback(
    (keys: readonly string[], close: boolean = true): string => {
      if (!keys?.length) return '';
      const path = keys
        .map((k, i) => {
          const p = toPixel(k);
          return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
        })
        .join(' ');
      return close ? path + ' Z' : path;
    },
    [toPixel]
  );

  return { origin, contentRadius, toPixel, pathFromKeys };
}
