import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '@constants/theme';


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
