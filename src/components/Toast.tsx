import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, elevation, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

/** 토스트 (Make) — 탭바 위 가운데, 🌱 + 문구 */
export function Toast({ message }: { message: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: insets.bottom + 112 }]}>
      <View accessibilityLiveRegion="polite" style={[styles.toast, elevation.float]}>
        <AppText variant="bodySmall" color={brand.onPrimary}>
          🌱 {message}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  toast: { backgroundColor: brand.primary, borderRadius: radius.full, paddingHorizontal: space[5], paddingVertical: space[3] },
});
