import { Text, TextProps } from 'react-native';

import { emojiSize } from '@/theme/theme';

/** 이모지 — 크기는 토큰(emojiSize)으로만 */
export function Emoji({ size = 'md', style, ...rest }: TextProps & { size?: keyof typeof emojiSize }) {
  const s = emojiSize[size];
  return <Text {...rest} style={[{ fontSize: s, lineHeight: Math.round(s * 1.2) }, style]} />;
}
