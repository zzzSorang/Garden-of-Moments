import { Pressable, StyleSheet, View } from 'react-native';

import type { Entry } from '@/lib/garden';
import { growthStage } from '@/lib/growth';
import { brand, emotion, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';
import { Plant } from './Plant';

type Props = { entries: Entry[]; now: number; onPressPlant: (id: string) => void };

/**
 * 정원 — 나무는 뒤쪽(위), 꽃은 앞쪽(아래) 영역.
 * 비어 있으면 핑옹이 자리(임시 원)를 보여줍니다.
 */
export function GardenBed({ entries, now, onPressPlant }: Props) {
  const trees = entries.filter((e) => e.kind === 'tree');
  const flowers = entries.filter((e) => e.kind === 'flower');

  if (entries.length === 0) {
    return (
      <View style={[styles.bed, styles.emptyBed]}>
        <View style={styles.mascot} accessibilityLabel="핑옹이 자리 (임시)">
          <AppText variant="label" color={brand.primaryInk}>
            핑옹이
          </AppText>
        </View>
        <AppText variant="poem" tone="secondary" align="center">
          아직 묻은 감정이 없어요
        </AppText>
        <AppText variant="bodySmall" tone="tertiary" align="center">
          + 버튼을 눌러 첫 감정을 묻어보세요
        </AppText>
      </View>
    );
  }

  const renderRow = (list: Entry[], scale: number) =>
    list.map((e) => (
      <Pressable
        key={e.id}
        accessibilityRole="button"
        accessibilityLabel={`${emotion[e.emotion].label} 감정`}
        onPress={() => onPressPlant(e.id)}
        hitSlop={space[2]}
        style={styles.plant}>
        <Plant kind={e.kind} emotionKey={e.emotion} stage={growthStage(e.kind, e.createdAt, now)} scale={scale} />
      </Pressable>
    ));

  return (
    <View style={styles.bed}>
      <View style={[styles.zone, styles.back]}>
        <AppText variant="caption" tone="tertiary">
          나무 · 뒤쪽
        </AppText>
        <View style={styles.plants}>{renderRow(trees, 1)}</View>
      </View>
      <View style={[styles.zone, styles.front]}>
        <AppText variant="caption" tone="tertiary">
          꽃 · 앞쪽
        </AppText>
        <View style={styles.plants}>{renderRow(flowers, 1)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bed: { flex: 1, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: neutral.border },
  emptyBed: { alignItems: 'center', justifyContent: 'center', gap: space[3], backgroundColor: neutral.surfaceSunken, padding: space[6] },
  mascot: {
    width: space[16] + space[8],
    height: space[16] + space[8],
    borderRadius: radius.full,
    backgroundColor: brand.primarySoft,
    borderWidth: 2,
    borderColor: brand.primaryMuted,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[2],
  },
  zone: { padding: space[4], gap: space[2] },
  back: { flex: 1, backgroundColor: neutral.surfaceSunken },
  front: { flex: 1, backgroundColor: brand.primarySoft, borderTopWidth: 1, borderTopColor: neutral.borderSoft },
  plants: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', alignContent: 'flex-end', gap: space[4] },
  plant: { alignItems: 'center', justifyContent: 'flex-end' },
});
