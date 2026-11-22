import { StyleSheet, View, ViewProps } from 'react-native';

import { neutral, radius, space } from '@/theme/theme';

type Props = ViewProps & { sunken?: boolean };

export function Card({ sunken, style, ...rest }: Props) {
  return <View {...rest} style={[styles.base, sunken && styles.sunken, style]} />;
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
});
