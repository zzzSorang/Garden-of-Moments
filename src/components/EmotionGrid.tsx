import { StyleSheet, View } from 'react-native';

import { emotion, EmotionKey, space } from '@/theme/theme';

import { Chip } from './Chip';

export const EMOTION_ORDER: EmotionKey[] = ['anger', 'sadness', 'depression', 'anxiety', 'hurt', 'shame'];

/** 감정 칩 3×2 */
export function EmotionGrid({ value, onChange }: { value: EmotionKey | null; onChange: (k: EmotionKey) => void }) {
  const rows = [EMOTION_ORDER.slice(0, 3), EMOTION_ORDER.slice(3)];
  return (
    <View style={styles.grid}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((k) => (
            <Chip key={k} block label={emotion[k].label} emotionKey={k} selected={value === k} onPress={() => onChange(k)} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space[3] },
  row: { flexDirection: 'row', gap: space[3] },
});
