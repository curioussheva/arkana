import os

# Perbaikan: Menggunakan penyimpanan lokal Termux yang aman dari Permission Error
project_root = "/data/data/com.termux/files/home/arkana/numerology-engine"


# Create src/constants/theme.ts
theme_ts = """export const COLORS = {
  // Primary
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  
  // Background
  background: '#0F172A',
  backgroundLight: '#1E293B',
  backgroundLighter: '#334155',
  
  // Surface
  surface: '#1E293B',
  surfaceLight: '#334155',
  surfaceDark: '#0F172A',
  
  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  // Border
  border: '#334155',
  borderLight: '#475569',
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Energy colors
  energy: {
    low: '#3B82F6',
    medium: '#F59E0B',
    high: '#EF4444',
    peak: '#8B5CF6',
  },
  
  // Elements
  fire: '#EF4444',
  water: '#3B82F6',
  air: '#94A3B8',
  earth: '#10B981',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'easeInOut',
    bounce: 'bounce',
    spring: 'spring',
  },
};
"""

with open(f"{project_root}/src/constants/theme.ts", "w") as f:
    f.write(theme_ts)

# Create src/constants/index.ts
constants_index = """export * from './theme';
"""

with open(f"{project_root}/src/constants/index.ts", "w") as f:
    f.write(constants_index)

# Create src/navigation/AppNavigator.tsx
navigator = """import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '@constants/theme';

// Screens (will be created next)
import { HomeScreen } from '@screens/HomeScreen';
import { MatrixScreen } from '@screens/MatrixScreen';
import { InsightScreen } from '@screens/InsightScreen';
import { TimelineScreen } from '@screens/TimelineScreen';
import { HistoryScreen } from '@screens/HistoryScreen';
import { SettingsScreen } from '@screens/SettingsScreen';

// ─── Types ──────────────────────────────────────────────────────

export type RootStackParamList = {
  Main: undefined;
  MatrixDetail: { matrixId: number };
  InsightDetail: { insightId: number };
  Export: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Matrix: undefined;
  Insights: undefined;
  Timeline: undefined;
  History: undefined;
  Settings: undefined;
};

// ─── Tab Icon ───────────────────────────────────────────────────

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Matrix: '🔮',
    Insights: '✨',
    Timeline: '📊',
    History: '📜',
    Settings: '⚙️',
  };

  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={styles.tabIconText}>{icons[name] || '•'}</Text>
    </View>
  );
}

// ─── Navigators ─────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: COLORS.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Matrix" component={MatrixScreen} options={{ title: 'Matriks' }} />
      <Tab.Screen name="Insights" component={InsightScreen} options={{ title: 'Insight' }} />
      <Tab.Screen name="Timeline" component={TimelineScreen} options={{ title: 'Timeline' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Riwayat' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Pengaturan' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: COLORS.text,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: COLORS.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  tabBarLabel: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  tabIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  tabIconActive: {
    backgroundColor: COLORS.primary + '20',
  },
  tabIconText: {
    fontSize: FONT_SIZE.lg,
  },
});
"""

with open(f"{project_root}/src/navigation/AppNavigator.tsx", "w") as f:
    f.write(navigator)

# Create src/navigation/index.ts
nav_index = """export * from './AppNavigator';
"""

with open(f"{project_root}/src/navigation/index.ts", "w") as f:
    f.write(nav_index)

print("✅ Constants and navigation created:")
print("   - src/constants/theme.ts")
print("   - src/constants/index.ts")
print("   - src/navigation/AppNavigator.tsx")
print("   - src/navigation/index.ts")