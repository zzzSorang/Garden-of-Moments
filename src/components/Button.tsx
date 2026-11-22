import { ActivityIndicator, Pressable, PressableProps, StyleSheet } from 'react-native';

import { brand, layout, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  /** primary: 진한 초록 CTA · secondary: 테두리 버튼 · ghost: 글자만 · danger: 삭제 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
};

export function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;
  const textColor = isPrimary
    ? brand.onPrimary
    : variant === 'danger'
      ? neutral.textSecondary
      : isDisabled
        ? neutral.textDisabled
        : brand.primaryInk;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      disabled={isDisabled}
      {...rest}
      style={(state) => [
        styles.base,
        styles[variant],
        state.pressed && pressedStyle[variant],
        isPrimary && isDisabled && styles.primaryDisabled,
        typeof style === 'function' ? style(state) : style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? brand.onPrimary : brand.primary} />
      ) : (
        <AppText variant="bodyStrong" color={textColor}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.minTouch + space[2],
    paddingHorizontal: space[5],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: brand.primary },
  primaryDisabled: { backgroundColor: brand.primaryDisabled },
  secondary: { backgroundColor: neutral.surface, borderWidth: 1, borderColor: neutral.borderSoft },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: neutral.surface, borderWidth: 1, borderColor: neutral.borderSoft },
});

const pressedStyle = StyleSheet.create({
  primary: { backgroundColor: brand.primaryPressed },
  secondary: { backgroundColor: brand.primarySoft },
  ghost: { backgroundColor: brand.primarySoft },
  danger: { backgroundColor: neutral.surfaceSunken },
});
