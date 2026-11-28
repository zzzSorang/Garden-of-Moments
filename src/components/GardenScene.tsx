import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, ScrollViewInstance, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { Entry } from '@/lib/garden';
import { useDragScroll } from '@/lib/useDragScroll';
import { growthStage, visualStage } from '@/lib/growth';
import { brand, border, emotion, gardenScene as g, radius, space } from '@/theme/theme';

import { AppText } from './AppText';
import { PlantIllustration } from './illustrations';
import { WalkingPingongi } from './WalkingPingongi';

type Props = {
  entries: Entry[];
  now: number;
  /** 핑옹이 보이기 (사진 모드에서 숨길 수 있음) */
  showPingongi?: boolean;
  /** false면 사진 모드 (화면 높이 고정용) */
  interactive?: boolean;
};

/**
 * 정원 (2026-11-28 보스 손그림 구도)
 * - 옆에서 본 정원. 위 75%는 하늘, 지평선에 꽃이 한 줄로 서고, 아래 땅에 핑옹이가 걸어다님.
 * - 좌우로 넘겨 볼 수 있음. 처음엔 '첫 화면'만 보이고, 기록이 쌓이면 가운데서 바깥으로 넓어짐.
 * - 나무는 꽃 뒤에 섬. 벤치·우편함은 에셋 나오기 전까지 점선 자리표시.
 *
 * 좌표는 '첫 화면'(앱을 켜면 보이는 한 화면, 0~화면 너비) 기준으로 계산한 뒤,
 * 왼쪽으로 넘친 만큼 전체를 밀어서 그립니다.
 */
export function GardenScene({ entries, now, showPingongi = true, interactive = true }: Props) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  // 지평선은 처음 잰 높이로 고정 — 사진 모드에서 탭바가 사라져도 하늘·꽃은 그대로, 땅만 아래로 늘어남
  const [baseH, setBaseH] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
    if (interactive) setBaseH(height);
  };
  const vw = box.w;
  // 핑옹이 발끝은 고정, 지평선(땅선)은 핑옹이 허리 높이에
  const feetY = (baseH || box.h) * g.pingongiFeet;
  const horizon = feetY - g.pingongiWaist;

  const layout = useMemo(() => (vw > 0 ? computeLayout(vw, entries, now) : null), [vw, entries, now]);

  // 앱을 켜면 '첫 화면'이 보이도록 스크롤 위치 맞추기
  const scroll = useRef<ScrollViewInstance>(null);
  const shift = layout?.shift ?? 0;
  useDragScroll(scroll, !!layout);
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
          {/* 정원 고리 — 바깥 고리부터 깔고 안쪽 고리를 위에 겹쳐 가운데서 퍼지는 모양 */}
          {[...layout.rings].reverse().map((r) => (
            <View key={`r${r.ring}`} pointerEvents="none" style={[styles.ring, { top: horizon, left: r.from + shift, width: r.to - r.from, backgroundColor: g.ringGround[r.ring - 1] }]} />
          ))}
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

          {/* 꽃 */}
          {layout.flowers.map((p) => renderPlant(p))}

          {/* 핑옹이 — 첫 화면의 땅 위를 걸어다님 */}
          {showPingongi ? (
            <View pointerEvents="none" style={[styles.homeScreen, { left: shift, width: vw, height: box.h }]}>
              <WalkingPingongi width={vw} height={box.h} fromX={14} toX={62} groundY={(feetY / box.h) * 100} />
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

  function renderPlant({ e, x, size, stage, dy = 0 }: Placed) {
    return (
      // 정원의 식물은 보기만 — 겹치면 누르기 어려워서 상세로 넘어가지 않음 (상세는 목록에서)
      <View
        key={e.id}
        pointerEvents="none"
        accessibilityLabel={`${emotion[e.emotion].label} 감정`}
        style={[styles.plant, { left: x + shift - size / 2, top: horizon - size + space[1] + dy }]}>
        <PlantIllustration emotion={e.emotion} kind={e.kind} stage={stage} size={size} />
      </View>
    );
  }
}

type Placed = { e: Entry; x: number; size: number; stage: ReturnType<typeof visualStage>; dy?: number };

type Row = { dy: number; scale: number; dx: number };

/** 여러 줄로 겹쳐 심기. 뒷줄부터 그려지도록 정렬해서 돌려줌 */
function plantRows(list: Entry[], nextSlot: () => number, step: number, rows: readonly Row[], jitterX: number, jitterH: number, now: number): Placed[] {
  let colX = 0;
  return list
    .map((e, i) => {
      if (i % rows.length === 0) colX = nextSlot();
      const row = rows[i % rows.length];
      const stage = visualStage(e.kind, growthStage(e.kind, e.createdAt, now));
      const r = hash(e.id);
      const x = colX + (row.dx + (r - 0.5) * 2 * jitterX) * step;
      // 키 들쭉날쭉: 가로 흐트러짐과 다른 값이 나오도록 id 뒤집어서
      const h = 1 + (hash(e.id + '~') - 0.5) * 2 * jitterH;
      return { e, x, size: g.plantSize[stage] * row.scale * h, stage, dy: row.dy };
    })
    .sort((a, b) => (a.dy ?? 0) - (b.dy ?? 0));
}

/** id로 만드는 0~1 고정값 (렌더할 때마다 위치가 바뀌지 않게) */
function hash(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((h >>> 0) % 1000) / 1000;
}

/**
 * 자리 계산 (모두 '첫 화면' 기준 x).
 * 꽃·나무는 기준점에서 가운데 → 왼쪽 → 오른쪽 → 더 왼쪽 … 순서로 자리를 잡아서
 * 기록이 쌓일수록 정원이 바깥으로 넓어집니다. 꽃은 벤치~우편함 앞자리는 건너뜀.
 */
function computeLayout(vw: number, entries: Entry[], now: number) {
  const mailboxRight = vw - space[4]; // 오른쪽 여백 16 (보스 지정)
  const props = {
    bench: vw * 0.625,
    mailbox: mailboxRight - g.mailbox.width / 2,
  };
  const blockedFrom = props.bench - g.bench.width / 2 - space[2];
  const blockedTo = props.mailbox + g.mailbox.width / 2 + space[2];

  const flowerSlots = slots(vw * 0.3, g.flowerStep, (x) => x < blockedFrom || x > blockedTo);
  const treeSlots = slots(vw * 0.72, g.treeStep, () => true);

  // 오래된 기록부터 가운데 자리 차지 (새 기록이 바깥으로)
  const ordered = [...entries].sort((a, b) => a.createdAt - b.createdAt);
  // 꽃·나무는 한 칸에 여러 줄(뒤 → 앞)로 겹쳐 심음 — 칸 하나의 줄을 다 채운 뒤 다음 칸으로
  const flowers = plantRows(ordered.filter((e) => e.kind === 'flower'), flowerSlots, g.flowerStep, g.flowerRows, g.flowerJitter, 0, now);
  const trees = plantRows(ordered.filter((e) => e.kind === 'tree'), treeSlots, g.treeStep, g.treeRows, g.flowerJitter, g.treeHeightJitter, now);

  // 정원 고리: 가장 바깥에 놓인 꽃이 속한 고리까지 열림 (최소 1고리)
  const anchor = vw * 0.3;
  const ringOf = (x: number) => {
    const d = Math.round(Math.abs(x - anchor) / g.flowerStep);
    const i = g.ringReach.findIndex((reach) => d <= reach);
    return i === -1 ? g.ringReach.length : i + 1;
  };
  const openRings = Math.max(1, ...flowers.map((p) => ringOf(p.x)));
  const rings = g.ringReach.slice(0, openRings).map((reach, i) => {
    const half = (reach + 0.5) * g.flowerStep;
    return { ring: i + 1, from: anchor - half, to: anchor + half };
  });

  const edges = [...flowers, ...trees].flatMap((p) => [p.x - p.size / 2, p.x + p.size / 2]).concat(rings.flatMap((r) => [r.from, r.to]));
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

  return { props, flowers, trees, fences, clouds, rings, worldW, shift };
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
  ring: { position: 'absolute', bottom: 0, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderLeftWidth: border.regular, borderRightWidth: border.regular, borderColor: g.ringEdge },
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
