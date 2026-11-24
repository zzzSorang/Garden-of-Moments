import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';

import type { Entry } from '@/lib/garden';
import { growthStage, visualStage } from '@/lib/growth';
import { brand, emotion, radius, space } from '@/theme/theme';

import { AppText } from './AppText';
import { GardenBackground, Pingongi, PlantIllustration } from './illustrations';
import { WalkingPingongi } from './WalkingPingongi';

/** Make 정원의 18개 자리 (x%, y%) */
const SLOTS = [
  { x: 8, y: 62 }, { x: 30, y: 68 }, { x: 55, y: 58 }, { x: 78, y: 65 }, { x: 18, y: 80 }, { x: 45, y: 75 },
  { x: 70, y: 78 }, { x: 88, y: 56 }, { x: 5, y: 88 }, { x: 35, y: 90 }, { x: 62, y: 88 }, { x: 82, y: 85 },
  { x: 22, y: 52 }, { x: 52, y: 88 }, { x: 72, y: 50 }, { x: 12, y: 70 }, { x: 60, y: 72 }, { x: 42, y: 56 },
];
const BY_DEPTH = [...SLOTS].sort((a, b) => a.y - b.y); // 뒤(위) → 앞(아래)
/** 식물이 있을 때 핑옹이가 걸어다니는 길 (가로 fromX~toX %, 발끝 세로 y %) */
const PINGONGI_WALK = { fromX: 18, toX: 82, y: 66 };

type Props = { entries: Entry[]; now: number; onPressPlant: (id: string) => void };

/**
 * 정원 (Make GardenScreen) — 배경 일러스트 위에 식물 배치.
 * 기획: 나무는 뒤쪽 자리부터, 꽃은 앞쪽 자리부터. 뒤쪽부터 그려서 앞 식물이 위로 겹칩니다.
 */
export function GardenScene({ entries, now, onPressPlant }: Props) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  const shown = entries.slice(0, SLOTS.length);
  const trees = shown.filter((e) => e.kind === 'tree');
  const flowers = shown.filter((e) => e.kind === 'flower');
  const placed = [
    ...trees.map((e, i) => ({ e, slot: BY_DEPTH[i] })),
    ...flowers.map((e, i) => ({ e, slot: BY_DEPTH[BY_DEPTH.length - 1 - i] })),
  ].sort((a, b) => a.slot.y - b.slot.y);
  // 핑옹이를 깊이 순서에 끼워 넣어 앞 식물에는 가려지고 뒤 식물은 가리도록
  const front = placed.findIndex(({ slot }) => slot.y > PINGONGI_WALK.y);
  const splitAt = front === -1 ? placed.length : front;
  const pingongi = (
    <WalkingPingongi key="pingongi" width={box.w} height={box.h} fromX={PINGONGI_WALK.fromX} toX={PINGONGI_WALK.toX} groundY={PINGONGI_WALK.y} />
  );

  return (
    <View style={styles.scene} onLayout={onLayout}>
      {box.w > 0 ? <GardenBackground width={box.w} height={box.h} /> : null}
      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Pingongi size={110} />
          <View style={styles.emptyText}>
            <AppText variant="body" color={brand.primaryInk} align="center">
              아직 정원이 비어 있어요
            </AppText>
            <AppText variant="bodySmall" tone="tertiary" align="center">
              {'마음속 감정을 씨앗으로 묻어보아요\n천천히 꽃이 피어날 거예요 🌱'}
            </AppText>
          </View>
        </View>
      ) : (
        box.w > 0 && [...placed.slice(0, splitAt).map(renderPlant), pingongi, ...placed.slice(splitAt).map(renderPlant)]
      )}
    </View>
  );

  function renderPlant({ e, slot }: (typeof placed)[number]) {
    const stage = visualStage(e.kind, growthStage(e.kind, e.createdAt, now));
    const size = stage === 'tree' ? 68 : stage === 'sapling' ? 58 : 50;
    return (
      <Pressable
        key={e.id}
        accessibilityRole="button"
        accessibilityLabel={`${emotion[e.emotion].label} 감정`}
        onPress={() => onPressPlant(e.id)}
        style={[styles.plant, { left: (slot.x / 100) * box.w - size / 2, top: (slot.y / 100) * box.h - size / 2 }]}>
        <PlantIllustration emotion={e.emotion} kind={e.kind} stage={stage} size={size} />
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  scene: { flex: 1, borderRadius: radius.xl, overflow: 'hidden' },
  empty: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', paddingBottom: space[16] },
  emptyText: { marginTop: space[5], paddingHorizontal: space[8], gap: space[1] },
  plant: { position: 'absolute' },
});
