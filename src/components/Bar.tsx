import { StyleSheet, View } from 'react-native';

import { emotion, EmotionKey, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

/** 감정별 가로 막대 한 줄 */
export function Bar({ emotionKey, count, max }: { emotionKey: EmotionKey; count: number; max: number }) {
  const e = emotion[emotionKey];
  const ratio = max > 0 ? count / max : 0;
  return (
    <View style={styles.row}>
      <AppText variant="bodySmall" color={e.ink} style={styles.label}>
        {e.label}
      </AppText>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%`, backgroundColor: e[400] }]} />
      </View>
      <AppText variant="bodySmall" tone="secondary" style={styles.count} align="right">
        {count}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  label: { width: space[10] },
  track: { flex: 1, height: space[2] + 2, borderRadius: radius.full, backgroundColor: neutral.surfaceSunken, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.full },
  count: { width: space[6] },
});
