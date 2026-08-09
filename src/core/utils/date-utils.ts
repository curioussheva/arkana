import { format, parse, isValid, subDays, addDays } from 'date-fns';
import { id } from 'date-fns/locale';

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_FORMAT = 'dd MMMM yyyy';

export function formatDate(date: Date | string, formatStr: string = DISPLAY_FORMAT): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, { locale: id });
}

export function parseDate(dateStr: string, formatStr: string = DATE_FORMAT): Date | null {
  try {
    const parsed = parse(dateStr, formatStr, new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function isValidDate(dateStr: string): boolean {
  return parseDate(dateStr) !== null;
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = subDays(end, days);
  return { start, end };
}

export function generateTimelineDates(days: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = -Math.floor(days / 2); i <= Math.floor(days / 2); i++) {
    dates.push(addDays(today, i));
  }

  return dates;
}

export function getAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getLifePathPeriods(
  birthDate: string
): { start: number; end: number; number: number }[] {
  const age = getAge(birthDate);

  return [
    { start: 0, end: Math.min(age, 30), number: 1 },
    { start: 30, end: Math.min(age, 60), number: 2 },
    { start: 60, end: age, number: 3 },
  ].filter(p => p.start <= age);
}
