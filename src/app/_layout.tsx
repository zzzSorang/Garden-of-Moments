import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/lib/auth';
import { GardenProvider } from '@/lib/garden';
import { ToastProvider } from '@/lib/toast';
import { fontAssets } from '@/theme/fonts';
import { neutral } from '@/theme/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // 글꼴이 준비될 때까지 스플래시 유지
  if (!loaded && !error) return null;

  return (
    <AuthProvider>
      <GardenProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: neutral.bg } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="bury" options={{ presentation: 'modal' }} />
            <Stack.Screen name="memory/[id]" />
          </Stack>
        </ToastProvider>
      </GardenProvider>
    </AuthProvider>
  );
}
