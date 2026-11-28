import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, ScrollViewInstance, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { Entry } from '@/lib/garden';
import { growthStage, visualStage } from '@/lib/growth';
import { brand, border, emotion, gardenScene as g, radius, space } from '@/theme/theme';

import { AppText } from './AppText';
import { PlantIllustration } from './illustrations';
import { WalkingPingongi } from './WalkingPingongi';

type Props = {
  entries: Entry[];
  now: number;
  onPressPlant: (id: string) => void;
  /** 핑옹이 보이기 (사진 모드에서 숨길 수 있음) */
  showPingongi?: boolean;
  /** false면 식물을 눌러도 아무 일 없음 (사진 모드) */
  interactive?: boolean;
};

/**
 * 정원 (2026-11-28 보스 손그림 구도)
 * - 옆에서 본 정원. 위 75%는 하늘, 지평선에 꽃이 한 줄로 서고, 아래 땅에 핑옹이가 걸어다님.
 * - 좌우로 넘겨 볼 수 있음. 처음엔 '첫 화면'만 보이고, 기록이 쌓이면 가운데서 바깥으로 넓어짐.
 * - 나무는 꽃 뒤에 섬. 벤치·우편함·쓰레기통은 에셋 나오기 전까지 점선 자리표시.
 *
 * 좌표는 '첫 화면'(앱을 켜면 보이는 한 화면, 0~화면 너비) 기준으로 계산한 뒤,
 * 왼쪽으로 넘친 만큼 전체를 밀어서 그립니다.
 */
export function GardenScene({ entries, now, onPressPlant, showPingongi = true, interactive = true }: Props) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  // 지평선은 처음 잰 높이로 고정 — 사진 모드에서 탭바가 사라져도 하늘·꽃은 그대로, 땅만 아래로 늘어남
  const [baseH, setBaseH] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
    if (interactive) setBaseH(height);
  };
  const vw = box.w;
  const horizon = (baseH || box.h) * g.skyRatio;
  const groundH = (baseH || box.h) - horizon;

  const layout = useMemo(() => (vw > 0 ? computeLayout(vw, entries, now) : null), [vw, entries, now]);

  // 앱을 켜면 '첫 화면'이 보이도록 스크롤 위치 맞추기
  const scroll = useRef<ScrollViewInstance>(null);
  const shift = layout?.shift ?? 0;
  useEffect(() => {
    if (layout) scroll.current?.scrollTo({ x: shift, animated: false });
  }, [layout, shift]);

  return (
    <View style={styles.scene} onLayout={onLayout}>
      {vw > 0 ? <Sky width={vw} height={box.h} /> : null}
      {layout ? (
        <ScrollView
          ref={scroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: shift, y: 0 }}
          style={StyleSheet.absoluteFill}
          contentContainerStyle={[styles.world, { width: layout.worldW, height: box.h }]}>
          {/* 구름 — 정원과 함께 넘어감 */}
          {layout.clouds.map((c, i) => (
            <View key={`c${i}`} style={[styles.cloud, { left: c.x + shift, top: c.y * horizon, width: c.w, height: c.h }]} />
          ))}

          {/* 땅 */}
          <View style={[styles.ground, { top: horizon }]} />
          <View style={[styles.soil, { top: horizon }]} />

          {/* 나무 (꽃·소품보다 뒤) */}
          {layout.trees.map((p) => renderPlant(p))}

          {/* 울타리 */}
          {layout.fences.map((f, i) => (
            <Fence key={`f${i}`} left={f.from + shift} width={f.to - f.from} bottom={horizon} />
          ))}

          {/* 소품 자리표시 */}
          <Placeholder label="벤치" x={layout.props.bench + shift} bottom={horizon} size={g.bench} />
          <Placeholder label="우편함" x={layout.props.mailbox + shift} bottom={horizon} size={g.mailbox} />
          <Placeholder label={'쓰레\n기통'} x={layout.props.trash + shift} bottom={horizon} size={g.trash} />

          {/* 꽃 */}
          {layout.flowers.map((p) => renderPlant(p))}

          {/* 핑옹이 — 첫 화면의 땅 위를 걸어다님 */}
          {showPingongi ? (
            <View pointerEvents="none" style={[styles.homeScreen, { left: shift, width: vw, height: box.h }]}>
              <WalkingPingongi width={vw} height={box.h} fromX={14} toX={62} groundY={((horizon + groundH * g.pingongiFeet) / box.h) * 100} />
            </View>
          ) : null}

          {entries.length === 0 ? (
            <View pointerEvents="none" style={[styles.empty, { left: shift, width: vw, top: horizon * 0.42 }]}>
              <AppText variant="body" color={brand.primaryInk} align="center">
                아직 정원이 비어 있어요
              </AppText>
              <AppText variant="bodySmall" tone="tertiary" align="center">
                {'오른쪽 아래 + 를 눌러\n첫 씨앗을 심어 보아요 🌱'}
              </AppText>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </View>
  );

  function renderPlant({ e, x, size, stage }: Placed) {
    return (
      <Pressable
        key={e.id}
        disabled={!interactive}
        accessibilityRole="button"
        accessibilityLabel={`${emotion[e.emotion].label} 감정`}
        onPress={() => onPressPlant(e.id)}
        style={[styles.plant, { left: x + shift - size / 2, top: horizon - size + space[1] }]}>
        <PlantIllustration emotion={e.emotion} kind={e.kind} stage={stage} size={size} />
      </Pressable>
    );
  }
}

type Placed = { e: Entry; x: number; size: number; stage: ReturnType<typeof visualStage> };

/**
 * 자리 계산 (모두 '첫 화면' 기준 x).
 * 꽃·나무는 기준점에서 가운데 → 왼쪽 → 오른쪽 → 더 왼쪽 … 순서로 자리를 잡아서
 * 기록이 쌓일수록 정원이 바깥으로 넓어집니다. 꽃은 벤치~쓰레기통 앞자리는 건너뜀.
 */
function computeLayout(vw: number, entries: Entry[], now: number) {
  const mailboxRight = vw - space[4]; // 오른쪽 여백 16 (보스 지정)
  const props = {
    bench: vw * 0.625,
    mailbox: mailboxRight - g.mailbox.width / 2,
    trash: vw + space[3] + g.trash.width / 2, // 첫 화면 바로 오른쪽 — 넘기면 보임
  };
  const blockedFrom = props.bench - g.bench.width / 2 - space[2];
  const blockedTo = props.trash + g.trash.width / 2 + space[2];

  const flowerSlots = slots(vw * 0.3, g.flowerStep, (x) => x < blockedFrom || x > blockedTo);
  const treeSlots = slots(vw * 0.72, g.treeStep, () => true);

  // 오래된 기록부터 가운데 자리 차지 (새 기록이 바깥으로)
  const ordered = [...entries].sort((a, b) => a.createdAt - b.createdAt);
  const place = (list: Entry[], next: () => number): Placed[] =>
    list.map((e) => {
      const stage = visualStage(e.kind, growthStage(e.kind, e.createdAt, now));
      return { e, x: next(), size: g.plantSize[stage], stage };
    });
  const flowers = place(ordered.filter((e) => e.kind === 'flower'), flowerSlots);
  const trees = place(ordered.filter((e) => e.kind === 'tree'), treeSlots);

  const edges = [...flowers, ...trees].flatMap((p) => [p.x - p.size / 2, p.x + p.size / 2]);
  const minX = Math.min(0, ...edges) - space[6];
  const maxX = Math.max(vw, blockedTo, ...edges) + space[6];
  const worldW = maxX - minX;
  const shift = -minX;

  const fences = [
    { from: vw * 0.8, to: vw + space[16] },
    { from: minX, to: minX + 70 },
    { from: maxX - 90, to: maxX },
  ].filter((f) => f.to > f.from);

  // 구름 — 정원 폭에 맞춰 반복 (y는 하늘 높이 대비 비율)
  const CLOUD = [
    { dx: 0.1, y: 0.25, w: 160, h: 34 },
    { dx: 0.55, y: 0.38, w: 120, h: 28 },
    { dx: 0.2, y: 0.5, w: 140, h: 32 },
  ];
  const clouds: { x: number; y: number; w: number; h: number }[] = [];
  for (let start = minX; start < maxX; start += vw) for (const c of CLOUD) if (start + c.dx * vw + c.w <= maxX) clouds.push({ x: start + c.dx * vw, y: c.y, w: c.w, h: c.h });

  return { props, flowers, trees, fences, clouds, worldW, shift };
}

/** 기준점에서 바깥으로 번갈아 퍼지는 자리 */
function slots(anchor: number, step: number, allowed: (x: number) => boolean) {
  let k = 0;
  return () => {
    for (;;) {
      // 0, -1, +1, -2, +2 …
      const n = k === 0 ? 0 : k % 2 === 1 ? -Math.ceil(k / 2) : k / 2;
      k += 1;
      const x = anchor + n * step;
      if (allowed(x)) return x;
    }
  };
}

function Sky({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={g.skyTop} />
          <Stop offset={String(g.skyRatio)} stopColor={g.skyBottom} />
        </LinearGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#sky)" />
    </Svg>
  );
}

function Fence({ left, width, bottom }: { left: number; width: number; bottom: number }) {
  const posts = Math.max(1, Math.floor(width / (g.fencePost * 2)));
  return (
    <View pointerEvents="none" style={[styles.fence, { left, width, top: bottom - g.fenceHeight }]}>
      <View style={styles.fenceRail} />
      <View style={styles.fencePosts}>
        {Array.from({ length: posts }, (_, i) => (
          <View key={i} style={styles.fencePost} />
        ))}
      </View>
    </View>
  );
}

function Placeholder({ label, x, bottom, size }: { label: string; x: number; bottom: number; size: { width: number; height: number } }) {
  return (
    <View pointerEvents="none" style={[styles.placeholder, { left: x - size.width / 2, top: bottom - size.height + space[1], width: size.width, height: size.height }]}>
      <AppText variant="micro" color={g.placeholderLine} align="center">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, overflow: 'hidden', backgroundColor: g.ground },
  world: { overflow: 'hidden' },
  cloud: { position: 'absolute', backgroundColor: g.cloud, borderRadius: radius.full, opacity: 0.9 },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: g.ground, borderTopWidth: g.groundLineWidth, borderTopColor: g.groundLine },
  soil: { position: 'absolute', left: 0, right: 0, height: g.soilStripHeight, backgroundColor: g.soilStrip },
  plant: { position: 'absolute' },
  homeScreen: { position: 'absolute', top: 0 },
  empty: { position: 'absolute', gap: space[1], paddingHorizontal: space[8] },
  fence: { position: 'absolute', height: g.fenceHeight },
  fenceRail: { position: 'absolute', left: 0, right: 0, top: space[1], height: g.fencePost / 2, backgroundColor: g.fence },
  fencePosts: { flex: 1, flexDirection: 'row', gap: g.fencePost },
  fencePost: { width: g.fencePost, backgroundColor: g.fence, borderBottomWidth: border.thin, borderBottomColor: g.fenceEdge },
  placeholder: {
    position: 'absolute',
    borderWidth: border.thick,
    borderStyle: 'dashed',
    borderColor: g.placeholderLine,
    backgroundColor: g.placeholderFill,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
