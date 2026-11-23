import { StyleSheet, View } from 'react-native';

import { brand, neutral, radius, size, space } from '@/theme/theme';

/** 진행 점 (Make) — 현재 20×6 진초록, 지난 단계 연초록, 남은 단계 연회녹 */
export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`${total}단계 중 ${current + 1}단계`}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, { width: i === current ? space[5] : size.progressDot, backgroundColor: i === current ? brand.primary : i < current ? brand.primaryMuted : neutral.borderSoft }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space[2], justifyContent: 'center' },
  dot: { height: size.progressDot, borderRadius: radius.full },
});
