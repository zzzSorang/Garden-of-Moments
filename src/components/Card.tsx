import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

import { elevation, neutral, radius, space } from '@/theme/theme';

type Props = ViewProps & { sunken?: boolean; onPress?: () => void };

export function Card({ sunken, style, onPress, ...rest }: Props) {
  const s = [styles.base, sunken ? styles.sunken : elevation.card, style];
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [...s, pressed && styles.pressed]}
        {...rest}
      />
    );
  }
  return <View {...rest} style={s} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: neutral.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral.border,
    padding: space[5],
    gap: space[3],
  },
  sunken: { backgroundColor: neutral.surfaceSunken },
  pressed: { backgroundColor: neutral.surfaceSunken },
});
