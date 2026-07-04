import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: wire to Sentry once Phase 10 (crash reporting) lands.
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }

      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Ada yang tidak beres</Text>
          <Text style={styles.message}>
            Terjadi kesalahan tak terduga. Coba muat ulang layar ini.
          </Text>
          <Text style={styles.errorDetail}>{error.message}</Text>
          <Text style={styles.retryHint} onPress={this.reset}>
            Tap di sini untuk coba lagi
          </Text>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  errorDetail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: 'monospace',
  },
  retryHint: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '600',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});
 