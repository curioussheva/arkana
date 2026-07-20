import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
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

// 🚀 IMPOR UTAMA
import { HomeScreen } from '@features/home';
import { MatrixScreen } from '@features/destiny-matrix';
import { InsightScreen } from '@features/insight';
import { PersonalYearScreen } from '@screens/PersonalYearScreen'; // Pasangan perbaikan dari layar Timeline
 
import { DailyCardScreen } from '@screens/DailyCardScreen';
import { TimelineScreen } from '@screens/TimelineScreen';
import { SettingsScreen } from '@screens/SettingsScreen';
import { CompatibilityScreen } from '@screens/CompatibilityScreen';
import { AboutScreen } from '@screens/AboutScreen';
import { HelpScreen } from '@screens/HelpScreen';
import { CardListScreen } from '@screens/CardListScreen';

import { LOGO_IMG } from '@constants/images';

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

// ─── Tampilan Konten Drawer (Desain Baru) ───
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const colors = useThemeStore(state => state.getColors());
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      {/* 🛠️ PERBAIKAN: Layout diatur vertikal terpusat (Center-Aligned) */}
      <View style={[styles.drawerHeader, { paddingTop: insets.top + 24, borderBottomColor: colors.border }]}>
        <Image 
          source={LOGO_IMG}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: colors.text }]}>ARKANA</Text>
        <Text style={[styles.appSubtitle, { color: colors.textMuted }]}>Destiny Matrix & Numerology</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 12 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>Version 1.0.0</Text>
        <Text style={[styles.footerCopyright, { color: colors.textMuted }]}>© 2026 CuriousSheva</Text>
      </View>
    </View>
  );
}

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const RootStack = createStackNavigator();

// ─── Stack Kombinasi (Mencegah Crash Navigasi Luar Tab) ───
function DrawerWrapper() {
  const colors = useThemeStore(state => state.getColors());

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: 280 },
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

export function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="DrawerRoot" component={DrawerWrapper} />
      {/* 🛡️ REGISTRASI BERHASIL: Sekarang Timeline dapat mengakses skrin ini langsung */}
      <RootStack.Screen name="PersonalYear" component={PersonalYearScreen} />
    </RootStack.Navigator>
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

// ─── Perubahan Gaya Lembar Desain (Styles) ───
const styles = StyleSheet.create({
  tabIcon: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  tabIconText: { fontSize: 18 },
  
  // Perubahan struktur header untuk mendukung penempatan logo di tengah atas
  drawerHeader: { 
    paddingHorizontal: 16, 
    paddingBottom: 24, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    flexDirection: 'column', // Berubah dari 'row' ke 'column'
    alignItems: 'center',    // Memaksa seluruh item anak berada di tengah
    justifyContent: 'center' 
  },
  logoImage: { 
    width: 80,               // Ukuran diperbesar dari 50 ke 80
    height: 80,              // Ukuran diperbesar dari 50 ke 80
    borderRadius: 20,        // Rasio lengkungan disesuaikan dengan proporsi baru
    marginBottom: 14         // Jarak pisah sebelum teks nama aplikasi dibawahnya
  },
  appName: { 
    fontSize: 20,            // Sedikit dinaikkan ukurannya agar tegas
    fontWeight: '900', 
    letterSpacing: 2, 
    textAlign: 'center' 
  },
  appSubtitle: { 
    fontSize: 11, 
    marginTop: 4, 
    textAlign: 'center'      // Teks subjudul rata tengah sempurna
  },

  drawerFooter: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, alignItems: 'center' },
  footerText: { fontSize: 12, fontWeight: '600' },
  footerCopyright: { fontSize: 10, marginTop: 4, opacity: 0.6 },
});
 