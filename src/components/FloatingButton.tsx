import { Pressable, StyleSheet } from 'react-native';

import { brand, elevation, layout, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = { onPress?: () => void; accessibilityLabel: string };

/** 화면 오른쪽 아래에 떠 있는 + 버튼 */
export function FloatingButton({ onPress, accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.base, elevation.float, pressed && styles.pressed]}>
      <AppText variant="display" color={brand.onPrimary}>
        +
      </AppText>
    </Pressable>
  );
}

const size = layout.minTouch + space[4];

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    right: layout.screenGutter,
    bottom: space[6],
    width: size,
    height: size,
    borderRadius: radius.full,
    backgroundColor: brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: brand.primaryPressed },
});
