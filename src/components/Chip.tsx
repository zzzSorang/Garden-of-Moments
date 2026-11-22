import { Pressable, StyleSheet, View } from 'react-native';

import { brand, emotion, EmotionKey, layout, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  /** 감정 칩이면 감정 키를 넘기면 파스텔 배경 + ink 글자로 보입니다. */
  emotionKey?: EmotionKey;
  selected?: boolean;
  /** 필터 칩 옆 개수 */
  count?: number;
  /** 넓게(그리드 칸을 꽉 채움) */
  block?: boolean;
  onPress?: () => void;
};

export function Chip({ label, emotionKey, selected, count, block, onPress }: Props) {
  const e = emotionKey ? emotion[emotionKey] : null;
  const bg = e ? (selected ? e[300] : e[100]) : selected ? brand.primary : neutral.surface;
  const border = e ? (selected ? e[400] : e[200]) : selected ? brand.primary : neutral.borderSoft;
  const text = e ? (selected ? neutral.textPrimary : e.ink) : selected ? brand.onPrimary : neutral.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.base, block && styles.block, { backgroundColor: bg, borderColor: border }]}>
      {e ? <View style={[styles.dot, { backgroundColor: e[400] }]} /> : null}
      <AppText variant={block ? 'bodyStrong' : 'label'} color={text}>
        {label}
        {count !== undefined ? ` ${count}` : ''}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.minTouch - space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: space[1] + 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  block: { alignSelf: 'stretch', minHeight: layout.minTouch + space[4], flex: 1 },
  dot: { width: space[2], height: space[2], borderRadius: radius.full },
});
