import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import type { PlantKind, VisualStage } from '@/lib/growth';
import { botany, EmotionKey, makeEmotion } from '@/theme/theme';

import { FlowerName, FlowerStage, SeedlingNo, SwayingFlower, SwayingSeedling } from './SwayingFlower';

/**
 * 식물 일러스트 — Figma Make PlantIllustration 을 그대로 옮긴 SVG.
 * (창피=작약 개화 그림만 Make 스타일로 새로 추가)
 */
type Props = { emotion: EmotionKey; stage: VisualStage; size?: number; /** 'flower'일 때만 수채화 흔들림 꽃 사용 (나무 새싹과 구분) */ kind?: PlantKind };

const Soil = ({ cy, rx = 14, ry = 4.5, opacity = 0.4 }: { cy: number; rx?: number; ry?: number; opacity?: number }) => (
  <Ellipse cx={30} cy={cy} rx={rx} ry={ry} fill={botany.soil} opacity={opacity} />
);

function Seed({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <Ellipse cx={30} cy={48} rx={16} ry={5} fill={botany.soil} opacity={0.5} />
      <Ellipse cx={30} cy={43} rx={7} ry={9} fill={botany.seed} stroke={botany.seedLine} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M30 36 C28 33 32 33 30 36" stroke={botany.seedLine} strokeWidth={1} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function Sprout({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 70" fill="none">
      <Soil cy={63} />
      <Path d="M30 58 C29 50 30 42 30 34" stroke={botany.stem} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M30 46 C22 44 18 38 22 35 C26 32 30 38 30 46" fill={botany.leaf} opacity={0.85} />
      <Path d="M30 46 C38 44 42 38 38 35 C34 32 30 38 30 46" fill={botany.leaf} opacity={0.85} />
    </Svg>
  );
}

function Bud({ emotion, size }: { emotion: EmotionKey; size: number }) {
  const c = makeEmotion[emotion];
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Soil cy={73} />
      <Path d="M30 68 C29 58 30 48 30 30" stroke={botany.stem} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M30 54 C24 52 20 47 23 44 C26 41 30 47 30 54" fill={botany.leaf} opacity={0.75} />
      <Path d="M30 54 C36 52 40 47 37 44 C34 41 30 47 30 54" fill={botany.leaf} opacity={0.75} />
      <Ellipse cx={30} cy={26} rx={6} ry={9} fill={c.petal} stroke={c.center} strokeWidth={1} />
      <Path d="M26 26 C26 20 34 20 34 26" fill={c.center} opacity={0.3} />
    </Svg>
  );
}

const Stem = ({ twoLeaves = false }: { twoLeaves?: boolean }) => (
  <>
    <Soil cy={73} />
    <Path d="M30 68 C29 55 30 44 30 30" stroke={botany.stem} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M30 52 C22 50 17 44 21 40 C25 36 30 44 30 52" fill={botany.leaf} opacity={0.8} />
    {twoLeaves ? <Path d="M30 52 C38 50 43 44 39 40 C35 36 30 44 30 52" fill={botany.leaf} opacity={0.8} /> : null}
  </>
);

/** 분노 — 장미 */
function Rose({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Stem twoLeaves />
      <Circle cx={30} cy={22} r={11} fill="#F2A5A7" opacity={0.6} />
      <Circle cx={30} cy={22} r={8} fill="#F2A5A7" opacity={0.8} />
      <Circle cx={30} cy={22} r={5} fill="#E87878" opacity={0.9} />
      <Circle cx={30} cy={22} r={2.5} fill="#D45A5A" />
      {['M22 18 C24 14 28 13 30 14', 'M38 18 C36 14 32 13 30 14', 'M20 24 C18 20 20 16 22 16', 'M40 24 C42 20 40 16 38 16'].map((d, i) => (
        <Path key={i} d={d} stroke="#F2A5A7" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.7} />
      ))}
    </Svg>
  );
}

/** 슬픔 — 수레국화 */
function Cornflower({ size }: { size: number }) {
  const petals = Array.from({ length: 12 }, (_, s) => {
    const i = (s * 30 * Math.PI) / 180;
    const p = (r: number, a: number) => `${30 + Math.cos(a) * r},${22 + Math.sin(a) * r}`;
    return `M${p(4, i)} C${p(8, i - 0.4)} ${p(8, i + 0.4)} ${p(11, i)}`;
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Stem />
      {petals.map((d, i) => (
        <Path key={i} d={d} stroke="#A8C4E8" strokeWidth={2.5} strokeLinecap="round" fill="none" />
      ))}
      <Circle cx={30} cy={22} r={4} fill="#7AAAD4" />
      <Circle cx={30} cy={22} r={2} fill="#5588BB" />
    </Svg>
  );
}

/** 우울 — 라벤더 */
function Lavender({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Soil cy={73} />
      <Path d="M30 68 C29 55 30 44 30 30" stroke={botany.stem} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M30 58 C24 56 20 52 23 49 C26 46 30 52 30 58" fill={botany.leaf} opacity={0.8} />
      <Path d="M30 58 C36 56 40 52 37 49 C34 46 30 52 30 58" fill={botany.leaf} opacity={0.8} />
      <Path d="M30 30 C30 24 30 18 30 10" stroke={botany.stem} strokeWidth={2} strokeLinecap="round" />
      {[10, 14, 18, 22, 26, 30].map((y, i) => (
        <G key={i}>
          <Ellipse cx={27} cy={y} rx={3.5} ry={2.5} fill="#C4B8D4" opacity={0.85} />
          <Ellipse cx={33} cy={y + 2} rx={3.5} ry={2.5} fill="#C4B8D4" opacity={0.75} />
        </G>
      ))}
    </Svg>
  );
}

/** 불안 — 아네모네 */
function Anemone({ size }: { size: number }) {
  const petals = Array.from({ length: 5 }, (_, s) => {
    const deg = s * 72 - 90;
    const a = (deg * Math.PI) / 180;
    return { cx: 30 + Math.cos(a) * 8, cy: 22 + Math.sin(a) * 8, deg };
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Stem />
      {petals.map((p, i) => (
        <Ellipse key={i} cx={p.cx} cy={p.cy} rx={6.5} ry={4.5} transform={`rotate(${p.deg}, ${p.cx}, ${p.cy})`} fill="#C9B3F5" opacity={0.85} />
      ))}
      <Circle cx={30} cy={22} r={5} fill="#2C1A6E" opacity={0.75} />
      <Circle cx={30} cy={22} r={3} fill="#1A0D4A" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return <Circle key={i} cx={30 + Math.cos(a) * 4} cy={22 + Math.sin(a) * 4} r={0.8} fill="white" opacity={0.8} />;
      })}
    </Svg>
  );
}

/** 상처 — 금잔화 */
function Marigold({ size }: { size: number }) {
  const step = 360 / 14;
  const petals = Array.from({ length: 14 }, (_, s) => {
    const a = (s * step * Math.PI) / 180;
    return { x: 30 + Math.cos(a) * 9, y: 22 + Math.sin(a) * 9, deg: s * step };
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Stem />
      {petals.map((p, i) => (
        <Ellipse key={i} cx={p.x} cy={p.y} rx={4} ry={2.5} transform={`rotate(${p.deg}, ${p.x}, ${p.y})`} fill="#F5D49B" opacity={0.9} />
      ))}
      <Circle cx={30} cy={22} r={6} fill="#E8B55A" />
      <Circle cx={30} cy={22} r={3.5} fill="#D4922A" />
    </Svg>
  );
}

/** 창피 — 작약 (Make 스타일로 새로 그림: 겹겹 둥근 꽃잎) */
function Peony({ size }: { size: number }) {
  const outer = Array.from({ length: 8 }, (_, s) => {
    const a = ((s * 45 - 90) * Math.PI) / 180;
    return { cx: 30 + Math.cos(a) * 9, cy: 22 + Math.sin(a) * 8 };
  });
  const inner = Array.from({ length: 6 }, (_, s) => {
    const a = ((s * 60 - 60) * Math.PI) / 180;
    return { cx: 30 + Math.cos(a) * 5, cy: 22 + Math.sin(a) * 4.5 };
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Stem twoLeaves />
      {outer.map((p, i) => (
        <Circle key={`o${i}`} cx={p.cx} cy={p.cy} r={5.5} fill="#F4B6CF" opacity={0.7} />
      ))}
      {inner.map((p, i) => (
        <Circle key={`i${i}`} cx={p.cx} cy={p.cy} r={4} fill="#F4B6CF" opacity={0.9} />
      ))}
      <Circle cx={30} cy={22} r={4} fill="#E58BB0" opacity={0.9} />
      <Path d="M27 21 C28 19 32 19 33 21" stroke="#FDF0F5" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.8} />
    </Svg>
  );
}

function Sapling({ emotion, size }: { emotion: EmotionKey; size: number }) {
  const c = makeEmotion[emotion];
  return (
    <Svg width={size} height={size} viewBox="0 0 60 80" fill="none">
      <Soil cy={73} />
      <Path d="M30 68 C29 55 30 45 30 35" stroke={botany.trunk} strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M30 45 C22 42 18 36 20 32 C22 28 28 34 30 45" fill={botany.leaf} opacity={0.85} />
      <Path d="M30 45 C38 42 42 36 40 32 C38 28 32 34 30 45" fill={botany.leaf} opacity={0.85} />
      <Ellipse cx={30} cy={28} rx={10} ry={8} fill={c.petal} opacity={0.6} />
      <Ellipse cx={30} cy={28} rx={7} ry={6} fill={botany.leaf} opacity={0.85} />
      <Circle cx={26} cy={24} r={2} fill={c.petal} opacity={0.9} />
      <Circle cx={34} cy={26} r={2} fill={c.petal} opacity={0.9} />
      <Circle cx={30} cy={22} r={2} fill={c.petal} opacity={0.9} />
    </Svg>
  );
}

function Tree({ emotion, size }: { emotion: EmotionKey; size: number }) {
  const c = makeEmotion[emotion];
  return (
    <Svg width={size} height={size} viewBox="0 0 60 90" fill="none">
      <Ellipse cx={30} cy={83} rx={16} ry={5} fill={botany.soil} opacity={0.5} />
      <Path d="M25 78 C26 65 28 52 29 40" stroke={botany.trunk} strokeWidth={5} strokeLinecap="round" />
      <Path d="M35 78 C34 65 32 52 31 40" stroke={botany.trunk} strokeWidth={5} strokeLinecap="round" />
      <Path d="M27 78 L33 78" stroke={botany.trunk} strokeWidth={5} strokeLinecap="round" />
      <Path d="M29 55 C18 52 12 44 15 38 C18 32 26 40 29 55" fill={botany.leaf} opacity={0.75} />
      <Path d="M31 55 C42 52 48 44 45 38 C42 32 34 40 31 55" fill={botany.leaf} opacity={0.75} />
      <Path d="M30 45 C20 42 14 34 17 27 C20 20 27 28 30 45" fill={botany.leaf} opacity={0.8} />
      <Path d="M30 45 C40 42 46 34 43 27 C40 20 33 28 30 45" fill={botany.leaf} opacity={0.8} />
      <Ellipse cx={30} cy={22} rx={16} ry={14} fill={c.petal} opacity={0.5} />
      <Ellipse cx={30} cy={22} rx={13} ry={11} fill={botany.leaf} opacity={0.8} />
      {[[22, 16], [38, 18], [30, 12], [24, 24], [36, 26]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={3} fill={c.petal} opacity={0.95} />
      ))}
    </Svg>
  );
}

const BLOOM: Record<EmotionKey, (p: { size: number }) => React.JSX.Element> = {
  anger: Rose,
  sadness: Cornflower,
  depression: Lavender,
  anxiety: Anemone,
  hurt: Marigold,
  shame: Peony,
};

/** 수채화 흔들림 꽃이 있는 감정 (분노=장미는 아직 없어 기존 그림 사용) */
const WATERCOLOR: Partial<Record<EmotionKey, FlowerName>> = {
  sadness: 'cornflower',
  depression: 'lavender',
  anxiety: 'hellebore', // 불안 = 헬레보루스 (아네모네 그림은 SwayingFlower에 남겨 둠)
  hurt: 'marigold',
  shame: 'lily', // 창피 = 은방울꽃 (모란 그림은 SwayingFlower에 남겨 둠)
};
const WATERCOLOR_STAGE: Partial<Record<VisualStage, FlowerStage>> = { sprout: 1, bud: 2, bloom: 3 };
/** 막 심었을 때(씨앗 단계) 보여 줄 새싹 번호 — 헬레보루스 7, 은방울꽃 5, 금잔화 4, 나머지 3 */
const SEEDLING_NO: Partial<Record<FlowerName, SeedlingNo>> = { hellebore: 7, lily: 5, marigold: 4 };

export function PlantIllustration({ emotion, stage, size = 60, kind }: Props) {
  const flower = kind === 'flower' ? WATERCOLOR[emotion] : undefined;
  const flowerStage = WATERCOLOR_STAGE[stage];
  if (flower && flowerStage) return <SwayingFlower flower={flower} stage={flowerStage} size={size} />;
  if (flower && stage === 'seed') return <SwayingSeedling no={SEEDLING_NO[flower] ?? 3} size={size} />;
  switch (stage) {
    case 'seed':
      return <Seed size={size} />;
    case 'sprout':
      return <Sprout size={size} />;
    case 'bud':
      return <Bud emotion={emotion} size={size} />;
    case 'sapling':
      return <Sapling emotion={emotion} size={size} />;
    case 'tree':
      return <Tree emotion={emotion} size={size} />;
    default: {
      const Bloom = BLOOM[emotion];
      return <Bloom size={size} />;
    }
  }
}
