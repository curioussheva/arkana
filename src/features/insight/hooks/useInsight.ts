import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useAppStore } from '@store/app-store';
import { generateInsight, type DestinyPointKey } from '@core/destiny-matrix';
import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';
import { getPositionAdvice } from '@core/destiny-matrix/analysis/positions';

// Gunakan path relatif yang aman untuk mematikan error TS2307
import type { EvolutionPointsInput } from '../../../core/destiny-matrix/evolutionEngine';
import type { AssessmentState } from '../../../core/assessment/assessmentEngine';

export function useInsight() {
  const matrix = useAppStore(state => state.currentMatrix);
  const profileName = useAppStore(state => state.activeProfileName);

  const [activeTab, setActiveTab] = useState<'blueprint' | 'energy' | 'evolution'>('blueprint');
  const [userAssessmentState, setUserAssessmentState] = useState<AssessmentState | null>(null);

  const insight = useMemo(() => {
    if (!matrix) return null;
    return generateInsight(matrix);
  }, [matrix]);

  const hasInsight = !!insight;

  const elementStyle = useMemo(() => {
    if (!insight) return null;
    return ELEMENT_STYLES[insight.elements.stats.dominant] ?? ELEMENT_STYLES.Fire;
  }, [insight]);

  const importantPoints = useMemo(() => {
    if (!matrix || !matrix.points) return [];

    const keys: DestinyPointKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    return keys
      .map(key => {
        const point = matrix.points[key];
        if (!point || !point.arcana) return null;

        const rawAdvice = point.arcana.advice || point.arcana.uprightMeaning;
        const safeAdviceText = Array.isArray(rawAdvice) ? rawAdvice.join(' ') : (rawAdvice || '');

        return {
          key,
          label: point.label || key,
          arcanaName: point.arcana.matrixName || point.arcana.tarotName || 'Major Arcana',
          arcana: point.arcana,
          interpretation: getPositionAdvice(
            key,
            point.arcana.matrixName || point.arcana.tarotName,
            safeAdviceText
          ),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [matrix]);

  const arcanaSequence = useMemo(() => {
    if (!matrix || !matrix.points) return [];
    const order: DestinyPointKey[] = ['A', 'J', 'E', 'L', 'C', 'F', 'H', 'I'];
    return order
      .map(key => matrix.points[key])
      .filter(Boolean)
      .map(point => point.arcana);
  }, [matrix]);

  const matrixPoints = useMemo<EvolutionPointsInput | null>(() => {
    if (!matrix || !matrix.points) return null;

    const D = matrix.points['D']?.arcana;
    const B = matrix.points['B']?.arcana;
    const A = matrix.points['A']?.arcana;
    const E = matrix.points['E']?.arcana;
    const C = matrix.points['C']?.arcana;

    if (!D || !B || !A || !E || !C) return null;

    return { D, B, A, E, C };
  }, [matrix]);

  const handlePointPress = (point: any) => {
    console.log('Node roda takdir diketuk:', point);
  };

  const share = () => {
    console.log('Sharing matrix insights for:', profileName);
  };

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: { flex: 1 },
      content: { paddingBottom: 24 },
    });
  }, []);

  return {
    matrix,
    profileName,
    insight,
    hasInsight,
    elementStyle,
    importantPoints,
    arcanaSequence,
    activeTab,
    setActiveTab,
    share,
    styles,
    matrixPoints,
    userAssessmentState,
    setUserAssessmentState,
    handlePointPress,
  };
} 