import { StyleSheet, View } from 'react-native';

import { brand, radius, space } from '@/theme/theme';

/** 단계 진행 점 (현재 단계는 길게) */
export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`${total}단계 중 ${current + 1}단계`}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.dot, i === current && styles.active, i < current && styles.done]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space[2], justifyContent: 'center' },
  dot: { width: space[2], height: space[2], borderRadius: radius.full, backgroundColor: brand.primaryDisabled },
  active: { width: space[6], backgroundColor: brand.primary },
  done: { backgroundColor: brand.primaryMuted },
});
