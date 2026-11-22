import { Pressable, StyleSheet } from 'react-native';

import { brand, elevation, radius, size, space } from '@/theme/theme';

import { AppText } from './AppText';

/** + 버튼 (Make) — 56px, 오른쪽 24, 탭바 바로 위 */
export function FloatingButton({ onPress, accessibilityLabel }: { onPress?: () => void; accessibilityLabel: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.base, elevation.float, pressed && styles.pressed]}>
      <AppText variant="display" color={brand.onPrimary} style={styles.plus}>
        +
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    right: space[6],
    bottom: space[4],
    width: size.fab,
    height: size.fab,
    borderRadius: radius.full,
    backgroundColor: brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: brand.primaryPressed },
  plus: { lineHeight: 32 },
});
