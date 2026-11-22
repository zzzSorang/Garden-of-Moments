import { Text, TextProps } from 'react-native';

import { textStyle, TypeVariant } from '@/theme/fonts';
import { neutral } from '@/theme/theme';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'disabled';

const toneColor: Record<Tone, string> = {
  primary: neutral.textPrimary,
  secondary: neutral.textSecondary,
  tertiary: neutral.textTertiary,
  disabled: neutral.textDisabled,
};

export type AppTextProps = TextProps & {
  variant?: TypeVariant;
  tone?: Tone;
  /** 특정 색이 꼭 필요할 때만 (예: 감정 ink, onPrimary). 반드시 토큰 값을 넘겨주세요. */
  color?: string;
  align?: 'left' | 'center' | 'right';
};

export function AppText({ variant = 'body', tone = 'primary', color, align, style, ...rest }: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[textStyle(variant), { color: color ?? toneColor[tone], textAlign: align }, style]}
    />
  );
}
