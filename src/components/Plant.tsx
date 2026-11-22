import { StyleSheet, View } from 'react-native';

import type { PlantKind } from '@/lib/growth';
import { emotion, EmotionKey, GrowthStage, neutral, radius } from '@/theme/theme';

/**
 * 로파이 식물 — 일러스트 확정 전까지 쓰는 임시 도형.
 * 꽃: 줄기 + 동그라미 / 나무: 기둥 + 둥근 수관. 성장 단계마다 커지고 growth 색이 선명해집니다.
 */
const FLOWER_SIZE: Record<GrowthStage, number> = { seed: 10, sprout: 16, bud: 22, bloom: 30 };
const TREE_SIZE: Record<GrowthStage, number> = { seed: 12, sprout: 24, bud: 40, bloom: 56 };

export function Plant({ kind, emotionKey, stage, scale = 1 }: { kind: PlantKind; emotionKey: EmotionKey; stage: GrowthStage; scale?: number }) {
  const color = emotion[emotionKey].growth[stage];
  if (stage === 'seed') {
    const s = (kind === 'tree' ? TREE_SIZE : FLOWER_SIZE).seed * scale;
    return <View style={[styles.seed, { width: s * 1.4, height: s, backgroundColor: color }]} />;
  }
  if (kind === 'flower') {
    const s = FLOWER_SIZE[stage] * scale;
    return (
      <View style={styles.col}>
        <View style={[styles.round, { width: s, height: s, backgroundColor: color }]} />
        <View style={[styles.stem, { height: s * 0.9 }]} />
      </View>
    );
  }
  const s = TREE_SIZE[stage] * scale;
  return (
    <View style={styles.col}>
      <View style={[styles.round, { width: s, height: s * 0.9, backgroundColor: color }]} />
      <View style={[styles.trunk, { height: s * 0.5, width: Math.max(4, s * 0.12) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  col: { alignItems: 'center' },
  round: { borderRadius: radius.full },
  seed: { borderRadius: radius.full },
  stem: { width: 2, backgroundColor: neutral.decor },
  trunk: { backgroundColor: neutral.borderStrong, borderRadius: radius.sm },
});
