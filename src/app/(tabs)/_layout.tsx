import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GardenIcon, MemoryIcon, ProfileIcon } from '@/components';
import { useAuth } from '@/lib/auth';
import { tabBarStyle } from '@/lib/tabBar';
import { textStyle } from '@/theme/fonts';
import { brand, neutral } from '@/theme/theme';

/** 탭바 (Make) — 반투명 흰 배경, 위 얇은 선, 선 아이콘 + 11px 이름 */
export default function TabsLayout() {
  const { session, loading } = useAuth();
  const insets = useSafeAreaInsets();
  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: brand.primary,
        tabBarInactiveTintColor: neutral.textDisabled,
        tabBarStyle: tabBarStyle(insets.bottom),
        tabBarLabelStyle: textStyle('tab'),
        sceneStyle: { backgroundColor: neutral.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: '정원', tabBarIcon: ({ color }) => <GardenIcon color={String(color)} /> }} />
      <Tabs.Screen name="memories" options={{ title: '기억함', tabBarIcon: ({ color }) => <MemoryIcon color={String(color)} /> }} />
      <Tabs.Screen name="profile" options={{ title: '프로필', tabBarIcon: ({ color }) => <ProfileIcon color={String(color)} /> }} />
    </Tabs>
  );
}
