// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  createDrawerNavigator, 
  DrawerNavigationProp, 
  DrawerContentScrollView, 
  DrawerItemList,
  DrawerContentComponentProps
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useThemeStore } from '@store/theme-store';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';

// Screens
import { HomeScreen } from '@screens/HomeScreen';
import { MatrixScreen } from '@screens/MatrixScreen';
import { InsightScreen } from '@screens/InsightScreen';
import { DailyCardScreen } from '@screens/DailyCardScreen';
import { TimelineScreen } from '@screens/TimelineScreen';
import { SettingsScreen } from '@screens/SettingsScreen';
import { CompatibilityScreen } from '@screens/CompatibilityScreen';
import { AboutScreen } from '@screens/AboutScreen';
import { HelpScreen } from '@screens/HelpScreen';
import { CardListScreen } from '@screens/CardListScreen';

// ─── Tipe Navigasi ───────────────────────────────────
export type RootDrawerParamList = {
  MainTabs: undefined;
  Settings: undefined;
  CardList: undefined;
  Help: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Matrix: undefined;
  Insights: undefined;
  DailyCard: undefined;
  Timeline: undefined;
  Compatibility: undefined;
};

type MainTabNavigatorProps = {
  navigation: DrawerNavigationProp<RootDrawerParamList, 'MainTabs'>;
};

// ─── Custom Tab Bar Icon ─────────────────────────────
function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.tabIcon, focused && { backgroundColor: color + '20' }, animatedStyle]}>
      <Text style={[styles.tabIconText, focused && { fontSize: 20 }]}>{icon}</Text>
    </Animated.View>
  );
}

// ─── Tab Navigator ────────────────────────────────────
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator({ navigation }: MainTabNavigatorProps) {
  const colors = useThemeStore(state => state.getColors());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, string> = {
            Home: '🏠',
            Matrix: '💎',
            Insights: '✨',
            DailyCard: '🃏',
            Timeline: '📊',
            Compatibility: '💕',
          };
          return <TabIcon icon={icons[route.name] || '•'} focused={focused} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.backgroundLight + 'E6', borderTopColor: colors.border, paddingTop: 4 },
        tabBarLabelStyle: { fontSize: 10, marginBottom: 4 },
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text, fontWeight: '600' },
        headerTintColor: colors.text,
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.openDrawer();
            }}
          >
            <Text style={{ fontSize: 24, color: colors.text }}>☰</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Matrix" component={MatrixScreen} options={{ title: 'Matriks' }} />
      <Tab.Screen name="Insights" component={InsightScreen} options={{ title: 'Insight' }} />
      <Tab.Screen name="DailyCard" component={DailyCardScreen} options={{ title: 'Kartu' }} />
      <Tab.Screen name="Timeline" component={TimelineScreen} options={{ title: 'Timeline' }} />
      <Tab.Screen name="Compatibility" component={CompatibilityScreen} options={{ title: 'Pasangan' }} />
    </Tab.Navigator>
  );
}

// ─── Custom Drawer Content (Header & Footer) ───────────
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const colors = useThemeStore(state => state.getColors());
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      {/* HEADER: Logo Gambar & Nama Aplikasi */}
      <View style={[styles.drawerHeader, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Image 
          source={require('../../assets/images/logo.png')} // Jalur relatif disesuaikan dari src/navigation/
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View>
          <Text style={[styles.appName, { color: colors.text }]}>ARKANA</Text>
          <Text style={[styles.appSubtitle, { color: colors.textMuted }]}>Destiny Matrix & Numerology</Text>
        </View>
      </View>

      {/* BODY: Daftar Menu Navigasi (Auto Scrollable jika menu penuh) */}
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={{ paddingTop: 8 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* FOOTER: Informasi App & Copyright */}
      <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>Version 1.0.0</Text>
        <Text style={[styles.footerCopyright, { color: colors.textMuted }]}>© 2026 CuriousSheva</Text>
      </View>
    </View>
  );
}

// ─── Drawer Navigator ────────────────────────────────
const Drawer = createDrawerNavigator<RootDrawerParamList>();

export function AppNavigator() {
  const colors = useThemeStore(state => state.getColors());

  // Keterangan: NavigationContainer sekarang sepenuhnya dihapus dari file ini.
  // Pastikan di file App.tsx Anda sudah membungkus <SafeAppNavigator /> dengan <NavigationContainer>.

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 280,
        },
        drawerLabelStyle: { fontSize: 15, fontWeight: '500', marginLeft: -8 },
        drawerActiveBackgroundColor: colors.primary + '15',
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          drawerLabel: 'Beranda',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text>,
        }}
      />
      <Drawer.Screen
        name="CardList"
        component={CardListScreen}
        options={{
          drawerLabel: 'Daftar Kartu',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🃏</Text>,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Pengaturan',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⚙️</Text>,
        }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          drawerLabel: 'Bantuan',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>💡</Text>,
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerLabel: 'Tentang Arkana',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>✨</Text>,
        }}
      /> 
    </Drawer.Navigator>
  );
}

export function SafeAppNavigator() {
  return (
    <ErrorBoundary componentName="AppNavigator">
      <AppNavigator />
    </ErrorBoundary>
  );
}

export default SafeAppNavigator;

// ─── Styles ───────────────────────────────────────────
const styles = StyleSheet.create({
  tabIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconText: {
    fontSize: 18,
  },
  // Style Komponen Custom Drawer
  drawerHeader: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  appSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerCopyright: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.6,
  },
});
 