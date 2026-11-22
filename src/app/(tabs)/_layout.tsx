import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { textStyle } from '@/theme/fonts';
import { brand, neutral } from '@/theme/theme';

export default function TabsLayout() {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: brand.primary,
        tabBarInactiveTintColor: neutral.textTertiary,
        tabBarStyle: { backgroundColor: neutral.surface, borderTopColor: neutral.border },
        tabBarLabelStyle: textStyle('caption'),
        tabBarIconStyle: { display: 'none' }, // TODO: 탭 아이콘은 일러스트 확정 후
        sceneStyle: { backgroundColor: neutral.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: '정원' }} />
      <Tabs.Screen name="seeds" options={{ title: '씨앗함' }} />
    </Tabs>
  );
}
