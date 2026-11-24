import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { AuthProvider } from '@/lib/auth';
import { GardenProvider } from '@/lib/garden';
import { loadSkia } from '@/lib/loadSkia';
import { ToastProvider } from '@/lib/toast';
import { fontAssets } from '@/theme/fonts';
import { neutral } from '@/theme/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);
  const [skiaReady, setSkiaReady] = useState(false);

  useEffect(() => {
    // 실패해도 앱은 열리도록 (흔들리는 꽃만 안 보임)
    loadSkia().catch(() => {}).finally(() => setSkiaReady(true));
  }, []);

  const ready = (loaded || !!error) && skiaReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // 글꼴과 (웹의) Skia 엔진이 준비될 때까지 스플래시 유지
  if (!ready) return null;

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
