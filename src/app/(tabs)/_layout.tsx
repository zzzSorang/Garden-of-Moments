import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { textStyle } from '@/theme/fonts';
import { brand, neutral, space } from '@/theme/theme';

export default function TabsLayout() {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: brand.primary,
        tabBarInactiveTintColor: neutral.textDisabled,
        tabBarStyle: { backgroundColor: neutral.surface, borderTopColor: neutral.border },
        tabBarLabelStyle: { ...textStyle('tab'), marginBottom: space[1] },
        tabBarIconStyle: { display: 'none' }, // TODO: 탭 아이콘은 일러스트 확정 후
        sceneStyle: { backgroundColor: neutral.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: '정원' }} />
      <Tabs.Screen name="memories" options={{ title: '기억함' }} />
      <Tabs.Screen name="profile" options={{ title: '프로필' }} />
    </Tabs>
  );
}
