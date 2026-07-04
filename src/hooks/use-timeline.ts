import { useMemo } from 'react';
import { getEngine } from '@core/numerology/engine';
import { generateTimelineDates } from '@core/utils/date-utils';
import type { TimelineData, NumerologyInput } from '@core/numerology/types';

export function useTimeline(input: NumerologyInput, days: number = 30): TimelineData[] {
  return useMemo(() => {
    const engine = getEngine();
    const dates = generateTimelineDates(days);

    return dates.map((date) => {
      // Calculate numerology for this specific date
      const dateStr = date.toISOString().split('T')[0];
      const matrix = engine.calculate({
        ...input,
        birthDate: dateStr, // Override with timeline date for calculation
      });

      return {
        date: dateStr,
        personalYear: matrix.matrix.personalYear,
        personalMonth: matrix.matrix.personalMonth,
        personalDay: matrix.matrix.personalDay,
        intensity: matrix.energyGrid.summary.intensity,
      };
    });
    // Intentionally depend on primitive fields (input.birthDate, input.name)
    // instead of the `input` object itself. Callers typically pass an
    // inline object literal that gets a new reference every render; using
    // `input` directly would defeat this memoization and recompute the
    // whole timeline on every render even when the actual values haven't
    // changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.birthDate, input.name, days]);
}
 