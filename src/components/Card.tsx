import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

import { elevation, neutral, radius, space } from '@/theme/theme';

type Props = ViewProps & { onPress?: () => void };

/** Make 카드 — 흰 배경, 라운드 20, 은은한 초록 그림자 */
export function Card({ style, onPress, ...rest }: Props) {
  const s = [styles.base, elevation.card, style];
  if (onPress) {
    return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [...s, pressed && styles.pressed]} {...rest} />;
  }
  return <View {...rest} style={s} />;
}

const styles = StyleSheet.create({
  base: { backgroundColor: neutral.surface, borderRadius: radius.lg, padding: space[5], gap: space[4] },
  pressed: { transform: [{ scale: 0.98 }] },
});
