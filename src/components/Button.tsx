import { ActivityIndicator, Pressable, PressableProps, StyleSheet } from 'react-native';

import { brand, elevation, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  /** primary: Make CTA · secondary: 흰 테두리 · ghost: 글자만 · danger: 삭제 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  /** CTA 아래 초록 그림자 (Make '묻기' 버튼) */
  glow?: boolean;
};

export function Button({ label, variant = 'primary', loading, disabled, glow, style, ...rest }: Props) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;
  const textColor = isPrimary ? brand.onPrimary : variant === 'ghost' || variant === 'danger' ? neutral.textTertiary : brand.primaryInk;
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
        isPrimary && glow && !isDisabled && elevation.cta,
        typeof style === 'function' ? style(state) : style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? brand.onPrimary : brand.primary} />
      ) : (
        <AppText variant={variant === 'ghost' || variant === 'danger' ? 'bodySmall' : 'body'} color={textColor}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: space[4], paddingHorizontal: space[5], borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: brand.primary },
  primaryDisabled: { backgroundColor: brand.primaryDisabled },
  secondary: { backgroundColor: neutral.surface, borderWidth: 1.5, borderColor: neutral.borderSoft },
  ghost: { backgroundColor: 'transparent', paddingVertical: space[3] },
  danger: { backgroundColor: 'transparent', paddingVertical: space[3] },
});

const pressedStyle = StyleSheet.create({
  primary: { backgroundColor: brand.primaryPressed },
  secondary: { backgroundColor: brand.primarySoft },
  ghost: { opacity: 0.6 },
  danger: { opacity: 0.6 },
});
