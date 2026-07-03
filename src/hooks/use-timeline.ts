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
  }, [input.birthDate, input.name, days]);
}
