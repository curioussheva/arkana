// src/features/insight/components/ElementBanner.tsx

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemeStore } from '@store/theme-store';

import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '@constants/theme';

import { ELEMENT_STYLES } from '@components/ui/ArkanaCard/types';
import type { ArcanaElement } from '@core/arcana/types';

interface ElementBannerProps {
    element: ArcanaElement;
    advice: string;
}

export function ElementBanner({
  element,
  advice,
}: ElementBannerProps) {
  const colors = useThemeStore(state => state.getColors());

  const style =
    ELEMENT_STYLES[element] ??
    ELEMENT_STYLES.Fire;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: style.color + '30',
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              style.color + '20',
          },
        ]}
      >
        <Text style={styles.icon}>
          {style.icon}
        </Text>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          ELEMEN DOMINAN
        </Text>

        <Text
          style={[
            styles.element,
            {
              color: style.color,
            },
          ]}
        >
          {element}
        </Text>

        <Text style={styles.description}>
    {advice}
</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,

    padding: SPACING.md,

    borderRadius: BORDER_RADIUS.xl,

    borderWidth: 1,
  },

  iconContainer: {
    width: 56,
    height: 56,

    borderRadius: BORDER_RADIUS.lg,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: SPACING.md,
  },

  icon: {
    fontSize: 28,
  },

  content: {
    flex: 1,
  },

  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },

  element: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginBottom: 4,
  },

  description: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
});

export default ElementBanner;