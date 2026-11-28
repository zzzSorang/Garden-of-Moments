import { Pressable, StyleSheet } from 'react-native';

import { border, brand, elevation, EmotionKey, makeEmotion, neutral, opacity, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = { label: string; emotionKey?: EmotionKey; selected?: boolean; count?: number; onPress?: () => void };

/** 기억함 필터 칩 (Make) — 이름 + 개수 */
export function Chip({ label, emotionKey, selected, count, onPress }: Props) {
  const e = emotionKey ? makeEmotion[emotionKey] : null;
  const bg = selected ? (e ? e.color : brand.primary) : neutral.surface;
  const border = selected ? (e ? e.color : brand.primary) : neutral.borderSoft;
  const text = selected ? (e ? neutral.textPrimary : brand.onPrimary) : neutral.textTertiary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.base, { backgroundColor: bg, borderColor: border }, selected && e && { ...elevation.soft, shadowColor: e.color, shadowOpacity: opacity.chipGlow }]}>
      <AppText variant="caption" color={text}>
        {label}
      </AppText>
      {count !== undefined ? (
        <AppText variant="micro" color={selected ? neutral.textPrimary : neutral.textTertiary} style={styles.count}>
          {count}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
    paddingHorizontal: space[3],
    paddingVertical: space[1.5],
    borderRadius: radius.full,
    borderWidth: border.regular,
  },
  count: { opacity: opacity.subtle, marginLeft: space[0.5] },
});
