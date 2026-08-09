// src/components/ui/ErrorBoundary.tsx
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@store/theme-store';

// ─── Types ───────────────────────────────────────────
type ErrorSeverity = 'minor' | 'moderate' | 'critical';
type ErrorCategory = 'render' | 'data' | 'network' | 'unknown';

interface ErrorMetadata {
  category: ErrorCategory;
  severity: ErrorSeverity;
  recoverable: boolean;
  icon: string;
  title: string;
  message: string;
}

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

// ─── Error Analyzer ──────────────────────────────────
function analyzeError(error: Error): ErrorMetadata {
  const message = error.message?.toLowerCase() || '';

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('connection') ||
    error.name === 'NetworkError'
  ) {
    return {
      category: 'network',
      severity: 'moderate',
      recoverable: true,
      icon: '🌐',
      title: 'Gangguan Koneksi',
      message: 'Energi digital terputus.\nPeriksa koneksi internetmu.',
    };
  }

  if (
    message.includes('undefined') ||
    message.includes('null') ||
    message.includes('typeerror') ||
    message.includes('referenceerror')
  ) {
    return {
      category: 'data',
      severity: 'moderate',
      recoverable: true,
      icon: '📊',
      title: 'Data Tidak Selaras',
      message: 'Terjadi ketidakselarasan data.\nCoba muat ulang halaman.',
    };
  }

  if (
    message.includes('render') ||
    message.includes('component') ||
    message.includes('invariant')
  ) {
    return {
      category: 'render',
      severity: 'minor',
      recoverable: true,
      icon: '🎨',
      title: 'Gangguan Tampilan',
      message: 'Tampilan mengalami gangguan kecil.\nBiasanya bisa diperbaiki dengan reload.',
    };
  }

  return {
    category: 'unknown',
    severity: 'critical',
    recoverable: false,
    icon: '🔮',
    title: 'Energi Misterius',
    message: 'Terjadi gangguan yang tidak terduga.\nCoba beberapa saat lagi.',
  };
}

// ─── Error Display Component ─────────────────────────
function ErrorDisplay({
  error,
  metadata,
  errorCount,
  componentName,
  onReset,
  onGoHome,
  onContactSupport,
}: {
  error: Error;
  metadata: ErrorMetadata;
  errorCount: number;
  componentName?: string;
  onReset: () => void;
  onGoHome?: () => void;
  onContactSupport?: () => void;
}) {
  const colors = useThemeStore(state => state.getColors());

  const severityColor = {
    minor: colors.warning,
    moderate: colors.error,
    critical: '#DC2626',
  }[metadata.severity];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Icon */}
        <Animated.View entering={FadeInDown.duration(800).springify()}>
          <View style={[styles.iconContainer, { borderColor: severityColor + '40' }]}>
            <LinearGradient
              colors={[severityColor + '20', 'transparent']}
              style={styles.iconGradient}
            />
            <Text style={styles.icon}>{metadata.icon}</Text>
          </View>
        </Animated.View>

        {/* Error Title */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)}>
          <Text style={[styles.title, { color: colors.text }]}>{metadata.title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{metadata.message}</Text>
        </Animated.View>

        {/* Error Code (Developer Info) */}
        {__DEV__ && (
          <Animated.View
            entering={FadeIn.delay(400)}
            style={[styles.devSection, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.devTitle, { color: colors.textMuted }]}>🛠️ Developer Info</Text>
            {componentName && (
              <Text style={[styles.devText, { color: colors.textSecondary }]}>
                Component: {componentName}
              </Text>
            )}
            <Text style={[styles.devText, { color: colors.textSecondary }]}>
              Category: {metadata.category}
            </Text>
            <Text style={[styles.devText, { color: colors.textSecondary }]}>
              Severity: {metadata.severity}
            </Text>
            <Text style={[styles.devText, { color: colors.textSecondary }]}>
              Occurrences: {errorCount}
            </Text>
            <View style={[styles.errorBox, { backgroundColor: colors.backgroundLight }]}>
              <Text style={[styles.errorText, { color: colors.error }]} selectable>
                {error.message}
              </Text>
              {error.stack && (
                <Text style={[styles.stackText, { color: colors.textMuted }]} selectable>
                  {error.stack.split('\n').slice(0, 8).join('\n')}
                </Text>
              )}
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.actions}>
          {/* Retry Button */}
          {metadata.recoverable && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onReset();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>🔄 Coba Lagi</Text>
            </TouchableOpacity>
          )}

          {/* Go Home Button */}
          {onGoHome && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.backgroundLight, borderColor: colors.border },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onGoHome();
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                🏠 Kembali ke Beranda
              </Text>
            </TouchableOpacity>
          )}

          {/* Support Button */}
          {errorCount > 2 && onContactSupport && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: 'transparent', borderColor: colors.border },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                onContactSupport();
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionButtonText, { color: colors.textMuted }]}>
                💬 Hubungi Dukungan
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Mystical Quote */}
        <Animated.View entering={FadeIn.delay(800)}>
          <Text style={styles.quote}>
            &quot;Setiap gangguan adalah bagian{'\n'}dari perjalanan spiritual&quot;
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Error Boundary Class ────────────────────────────
export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
    errorInfo: null,
    errorCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[ErrorBoundary${this.props.componentName ? ` - ${this.props.componentName}` : ''}]`,
      '\nError:',
      error,
      '\nComponent Stack:',
      errorInfo.componentStack
    );

    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    this.props.onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    this.reset();
  };

  handleContactSupport = (): void => {
    const { error, errorInfo } = this.state;
    const errorDetails = `
Error: ${error?.message}
Component: ${this.props.componentName || 'Unknown'}
Stack: ${errorInfo?.componentStack || 'N/A'}
    `.trim();

    console.log('Support request:', errorDetails);
  };

  render(): ReactNode {
    const { error, errorCount } = this.state;

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }

      const metadata = analyzeError(error);

      return (
        <ErrorDisplay
          error={error}
          metadata={metadata}
          errorCount={errorCount}
          componentName={this.props.componentName}
          onReset={this.reset}
          onGoHome={this.handleGoHome}
          onContactSupport={this.handleContactSupport}
        />
      );
    }

    return this.props.children;
  }
}

// ─── Functional Wrapper (for hooks) ──────────────────
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName =
    componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary componentName={displayName}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}

// ─── Quick Error Trigger (Dev Only) ──────────────────
export function ErrorTestButton({ message = 'Test error' }: { message?: string }) {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  if (shouldThrow) {
    throw new Error(message);
  }

  if (!__DEV__) return null;

  return (
    <TouchableOpacity style={testStyles.button} onPress={() => setShouldThrow(true)}>
      <Text style={testStyles.text}>🧪 Test Error</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BORDER_RADIUS = {
  md: 8,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    overflow: 'hidden',
  },
  iconGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  devSection: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  devTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  devText: {
    fontSize: 12,
    marginBottom: SPACING.xs,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    maxHeight: 200,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  stackText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 14,
    opacity: 0.7,
  },
  actions: {
    width: '100%',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  actionButton: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    opacity: 0.6,
  },
});

const testStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.3)',
  },
  text: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default ErrorBoundary;
