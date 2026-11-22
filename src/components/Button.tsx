import { ActivityIndicator, Pressable, PressableProps, StyleSheet } from 'react-native';

import { brand, layout, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

export function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      {...rest}
      style={(state) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        state.pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? brand.onPrimary : brand.primary} />
      ) : (
        <AppText variant="bodyStrong" color={isPrimary ? brand.onPrimary : brand.primaryInk}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.minTouch + space[1],
    paddingHorizontal: space[5],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: brand.primary },
  primaryPressed: { backgroundColor: brand.primaryPressed },
  secondary: { backgroundColor: neutral.surface, borderWidth: 1, borderColor: neutral.border },
  secondaryPressed: { backgroundColor: brand.primarySoft },
  disabled: { opacity: 0.5 },
});
