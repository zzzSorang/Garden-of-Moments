import { StyleSheet, View } from 'react-native';

import { EmotionKey, emotion, makeEmotion, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';
import { Emoji } from './Emoji';

/** 감정 배지 (Make) — 연한 감정색 배경 + 감정색 테두리 + 이모지 */
export function EmotionBadge({ emotionKey, size = 'sm' }: { emotionKey: EmotionKey; size?: 'xs' | 'sm' | 'lg' }) {
  const e = makeEmotion[emotionKey];
  return (
    <View style={[styles.base, sizes[size], { backgroundColor: e.lightColor, borderColor: e.color }]}>
      <Emoji size={size === 'lg' ? 'lg' : size === 'xs' ? 'sm' : 'md'}>{e.emoji}</Emoji>
      <AppText variant={size === 'xs' ? 'caption' : 'bodySmall'} color={neutral.textPrimary}>
        {emotion[emotionKey].label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: space[1], borderRadius: radius.full, alignSelf: 'flex-start' },
});

const sizes = StyleSheet.create({
  xs: { paddingHorizontal: space[2], paddingVertical: 2, borderWidth: 1 },
  sm: { paddingHorizontal: space[3], paddingVertical: space[1], borderWidth: 1.5 },
  lg: { paddingHorizontal: space[4], paddingVertical: space[2], borderWidth: 1.5, gap: space[2] },
});
