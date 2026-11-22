import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, elevation, layout, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

export function Toast({ message }: { message: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="none" style={[styles.wrap, { top: insets.top + space[3] }]}>
      <View accessibilityLiveRegion="polite" style={[styles.toast, elevation.float]}>
        <AppText variant="bodySmall" color={brand.onPrimary} align="center">
          {message}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter, alignItems: 'center' },
  toast: { backgroundColor: brand.primary, borderRadius: radius.full, paddingHorizontal: space[5], paddingVertical: space[3] },
});
