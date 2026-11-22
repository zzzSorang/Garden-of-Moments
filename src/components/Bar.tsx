import { StyleSheet, View } from 'react-native';

import { emotion, EmotionKey, makeEmotion, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

/** 감정별 막대 한 줄 (Make) */
export function Bar({ emotionKey, count, max }: { emotionKey: EmotionKey; count: number; max: number }) {
  const e = makeEmotion[emotionKey];
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <View style={styles.row}>
      <AppText variant="body" style={styles.emoji} align="center">
        {e.emoji}
      </AppText>
      <AppText variant="bodySmall" style={styles.label}>
        {emotion[emotionKey].label}
      </AppText>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: e.color }]} />
      </View>
      <AppText variant="caption" tone="tertiary" style={styles.count} align="right">
        {count}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  emoji: { width: space[5] },
  label: { width: space[12] },
  track: { flex: 1, height: space[2], borderRadius: radius.full, backgroundColor: neutral.divider, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.full },
  count: { width: space[4] },
});
