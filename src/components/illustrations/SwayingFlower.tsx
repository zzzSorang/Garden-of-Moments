import { Image as ExpoImage } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import {
  Canvas,
  Group,
  Image,
  ImageShader,
  Rect,
  Shader,
  Skia,
  useClock,
  useImage,
} from '@shopify/react-native-skia';
import Animated, { Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/**
 * 바람에 살랑살랑 흔들리는 수채화 꽃 (라벤더 · 수레국화 · 아네모네 · 금잔화 · 모란 · 은방울꽃 · 헬레보루스)
 * - 흙은 고정, 식물만 뿌리를 기준으로 위로 갈수록 크게 휘어짐 (Skia 셰이더)
 * - Expo Go에서 동작 (@shopify/react-native-skia, react-native-reanimated 모두 Expo Go 내장)
 * - 이미지: assets/images/flowers/<꽃>/stage{1,2,3}_{soil,plant}.webp
 *   (좌우 48px · 위 24px 여백 포함. 아래 w/h/baseY/amp는 원본 해상도 기준 좌표라
 *    이미지를 작게 줄여 넣어도 값은 그대로 둡니다)
 */

/** 바람 셰이더 소스 — 웹에서는 Skia 엔진이 준비된 뒤에야 만들 수 있어서, 처음 쓸 때 한 번만 만들어요 */
const WIND_SKSL = `
uniform shader image;
uniform float t;      // 시간(초)
uniform float baseY;  // 뿌리 높이(px)
uniform float amp;    // 꼭대기 최대 이동량(px)

half4 main(float2 p) {
  float h = clamp((baseY - p.y) / baseY, 0.0, 1.0); // 뿌리 0 → 꼭대기 1
  float w = pow(h, 1.6);                             // 위로 갈수록 더 휨
  float env = 0.75 + 0.25 * sin(t * 0.31 + 1.0);     // 바람 세기가 천천히 오르내림
  float g = (sin(t * 0.8)
          + 0.25 * sin(t * 1.7 + p.x * 0.008)) * env;
  float dx = amp * w * g;
  float dy = -abs(dx) * 0.04 * h;
  return image.eval(float2(p.x - dx, p.y - dy));
}
`;
let windEffect: ReturnType<typeof Skia.RuntimeEffect.Make> = null;
function getWind() {
  if (!windEffect) windEffect = Skia.RuntimeEffect.Make(WIND_SKSL);
  return windEffect!;
}

export type FlowerName = 'lavender' | 'cornflower' | 'anemone' | 'marigold' | 'peony' | 'lily' | 'hellebore';
export type FlowerStage = 1 | 2 | 3;

type StageDef = { soil: number; plant: number; w: number; h: number; baseY: number; amp: number };

const FLOWERS: Record<FlowerName, Record<FlowerStage, StageDef>> = {
  lavender: {
    1: { soil: require('../../../assets/images/flowers/lavender/stage1_soil.webp'), plant: require('../../../assets/images/flowers/lavender/stage1_plant.webp'), w: 428, h: 366, baseY: 275, amp: 12 },
    2: { soil: require('../../../assets/images/flowers/lavender/stage2_soil.webp'), plant: require('../../../assets/images/flowers/lavender/stage2_plant.webp'), w: 478, h: 687, baseY: 589, amp: 26 },
    3: { soil: require('../../../assets/images/flowers/lavender/stage3_soil.webp'), plant: require('../../../assets/images/flowers/lavender/stage3_plant.webp'), w: 639, h: 863, baseY: 758, amp: 35 },
  },
  cornflower: {
    1: { soil: require('../../../assets/images/flowers/cornflower/stage1_soil.webp'), plant: require('../../../assets/images/flowers/cornflower/stage1_plant.webp'), w: 388, h: 406, baseY: 309, amp: 11 },
    2: { soil: require('../../../assets/images/flowers/cornflower/stage2_soil.webp'), plant: require('../../../assets/images/flowers/cornflower/stage2_plant.webp'), w: 467, h: 668, baseY: 571, amp: 24 },
    3: { soil: require('../../../assets/images/flowers/cornflower/stage3_soil.webp'), plant: require('../../../assets/images/flowers/cornflower/stage3_plant.webp'), w: 602, h: 844, baseY: 733, amp: 31 },
  },
  anemone: {
    1: { soil: require('../../../assets/images/flowers/anemone/stage1_soil.webp'), plant: require('../../../assets/images/flowers/anemone/stage1_plant.webp'), w: 462, h: 439, baseY: 358, amp: 15 },
    2: { soil: require('../../../assets/images/flowers/anemone/stage2_soil.webp'), plant: require('../../../assets/images/flowers/anemone/stage2_plant.webp'), w: 512, h: 615, baseY: 530, amp: 23 },
    3: { soil: require('../../../assets/images/flowers/anemone/stage3_soil.webp'), plant: require('../../../assets/images/flowers/anemone/stage3_plant.webp'), w: 646, h: 825, baseY: 739, amp: 31 },
  },
  marigold: {
    1: { soil: require('../../../assets/images/flowers/marigold/stage1_soil.webp'), plant: require('../../../assets/images/flowers/marigold/stage1_plant.webp'), w: 450, h: 456, baseY: 382, amp: 15 },
    2: { soil: require('../../../assets/images/flowers/marigold/stage2_soil.webp'), plant: require('../../../assets/images/flowers/marigold/stage2_plant.webp'), w: 492, h: 636, baseY: 563, amp: 23 },
    3: { soil: require('../../../assets/images/flowers/marigold/stage3_soil.webp'), plant: require('../../../assets/images/flowers/marigold/stage3_plant.webp'), w: 624, h: 820, baseY: 742, amp: 31 },
  },
  peony: {
    1: { soil: require('../../../assets/images/flowers/peony/stage1_soil.webp'), plant: require('../../../assets/images/flowers/peony/stage1_plant.webp'), w: 454, h: 426, baseY: 332, amp: 15 },
    2: { soil: require('../../../assets/images/flowers/peony/stage2_soil.webp'), plant: require('../../../assets/images/flowers/peony/stage2_plant.webp'), w: 522, h: 647, baseY: 549, amp: 23 },
    3: { soil: require('../../../assets/images/flowers/peony/stage3_soil.webp'), plant: require('../../../assets/images/flowers/peony/stage3_plant.webp'), w: 654, h: 829, baseY: 741, amp: 31 },
  },
  /** 은방울꽃 — 아직 연결된 감정 없음 */
  lily: {
    1: { soil: require('../../../assets/images/flowers/lily/stage1_soil.webp'), plant: require('../../../assets/images/flowers/lily/stage1_plant.webp'), w: 418, h: 435, baseY: 360, amp: 15 },
    2: { soil: require('../../../assets/images/flowers/lily/stage2_soil.webp'), plant: require('../../../assets/images/flowers/lily/stage2_plant.webp'), w: 478, h: 642, baseY: 569, amp: 23 },
    3: { soil: require('../../../assets/images/flowers/lily/stage3_soil.webp'), plant: require('../../../assets/images/flowers/lily/stage3_plant.webp'), w: 649, h: 816, baseY: 729, amp: 31 },
  },
  hellebore: {
    1: { soil: require('../../../assets/images/flowers/hellebore/stage1_soil.webp'), plant: require('../../../assets/images/flowers/hellebore/stage1_plant.webp'), w: 430, h: 447, baseY: 361, amp: 15 },
    2: { soil: require('../../../assets/images/flowers/hellebore/stage2_soil.webp'), plant: require('../../../assets/images/flowers/hellebore/stage2_plant.webp'), w: 516, h: 644, baseY: 568, amp: 23 },
    3: { soil: require('../../../assets/images/flowers/hellebore/stage3_soil.webp'), plant: require('../../../assets/images/flowers/hellebore/stage3_plant.webp'), w: 680, h: 843, baseY: 769, amp: 31 },
  },
};

/** 막 심었을 때의 새싹 01~07 (어느 꽃과 이을지는 아직 미정 — 정해지면 PlantIllustration에서 연결) */
export type SeedlingNo = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const SEEDLINGS: Record<SeedlingNo, StageDef> = {
  1: { soil: require('../../../assets/images/flowers/seedlings/seedling01_soil.webp'), plant: require('../../../assets/images/flowers/seedlings/seedling01_plant.webp'), w: 314, h: 159, baseY: 76, amp: 5.3 },
  2: { soil: require('../../../assets/images/flowers/seedlings/seedling02_soil.webp'), plant: require('../../../assets/images/flowers/seedlings/seedling02_plant.webp'), w: 301, h: 206, baseY: 128, amp: 9 },
  3: { soil: require('../../../assets/images/flowers/seedlings/seedling03_soil.webp'), plant: require('../../../assets/images/flowers/seedlings/seedling03_plant.webp'), w: 307, h: 240, baseY: 156, amp: 10.9 },
  4: { soil: require('../../../assets/images/flowers/seedlings/seedling04_soil.webp'), plant: require('../../../assets/images/flowers/seedlings/seedling04_plant.webp'), w: 299, h: 239, baseY: 162, amp: 11.3 },
  5: { soil: require('../../../assets/images/flowers/seedlings/seedling05_soil.webp'), plant: require('../../../assets/images/flowers/seedlings/seedling05_plant.webp'), w: 306, h: 236, baseY: 156, amp: 10.9 },
  6: { soil: require('../../../assets/images/flowers/seedlings/seedling06_soil.webp'), plant: require('../../../assets/images/flowers/seedlings/seedling06_plant.webp'), w: 311, h: 224, baseY: 135, amp: 9.5 },
  7: { soil: require('../../../assets/images/flowers/seedlings/seedling07_soil.webp'), plant: require('../../../assets/images/flowers/seedlings/seedling07_plant.webp'), w: 297, h: 225, baseY: 121, amp: 8.5 },
};

type SwayOptions = {
  /** 정사각형 영역 한 변(pt). 그림은 이 안에 아래 가운데 정렬로 맞춰 들어감 */
  size: number;
  /** 바람 세기 배율 (기본 1) */
  strength?: number;
  /** 바람 속도 배율 (기본 1) */
  speed?: number;
  /** 흙 더미까지 그릴지 (기본 false — 식물만, 뿌리가 영역 바닥에 닿음) */
  soil?: boolean;
};

type Props = SwayOptions & { flower: FlowerName; stage: FlowerStage };

export function SwayingFlower({ flower, stage, ...rest }: Props) {
  return <SwaySprite def={FLOWERS[flower][stage]} {...rest} />;
}

/** 새싹 01~07 — 꽃과 같은 바람으로 흔들림 (작아서 흔들림 폭도 작음) */
export function SwayingSeedling({ no, ...rest }: SwayOptions & { no: SeedlingNo }) {
  return <SwaySprite def={SEEDLINGS[no]} {...rest} />;
}

/**
 * 웹 브라우저는 Skia 캔버스(WebGL)를 한 페이지에 16개 남짓만 유지해서, 꽃이 많아지면 앞의 꽃들이 빈칸이 됨.
 * 그래서 웹에서는 일반 이미지 + 뿌리 기준으로 살짝 기울이는 흔들림으로 그려요. 폰은 그대로 Skia.
 */
function SwaySprite(props: SwayOptions & { def: StageDef }) {
  return Platform.OS === 'web' ? <WebSprite {...props} /> : <SkiaSprite {...props} />;
}

function WebSprite({ def: s, size, strength = 1, speed = 1, soil: showSoil = false }: SwayOptions & { def: StageDef }) {
  const [phase] = useState(() => Math.random());
  const visibleH = showSoil ? s.h : s.baseY + 4;
  const scale = Math.min(size / visibleH, size / s.w);
  const width = s.w * scale;
  const height = visibleH * scale;
  // 꼭대기 이동량(amp)을 기울기 각도로 바꿈
  const deg = ((Math.atan((s.amp * strength) / s.baseY) * 180) / Math.PI) * 0.8;
  const duration = 3800 / speed;

  const sway = useSharedValue(-1);
  useEffect(() => {
    // 꽃마다 시작 시점을 달리 해서 다 같이 똑같이 흔들리지 않게
    const t = setTimeout(() => {
      sway.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
    }, phase * duration);
    return () => clearTimeout(t);
  }, [sway, duration, phase]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: height / 2 }, { rotate: `${sway.value * deg}deg` }, { translateY: -height / 2 }],
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ width, height, overflow: 'visible' }}>
        {showSoil ? <ExpoImage source={s.soil} style={{ position: 'absolute', left: 0, top: 0, width, height: s.h * scale }} /> : null}
        <Animated.View style={[{ width, height, overflow: 'hidden' }, style]}>
          <ExpoImage source={s.plant} style={{ width, height: s.h * scale }} contentFit="fill" />
        </Animated.View>
      </View>
    </View>
  );
}

function SkiaSprite({ def: s, size, strength = 1, speed = 1, soil: showSoil = false }: SwayOptions & { def: StageDef }) {
  const soil = useImage(showSoil ? s.soil : null);
  const plant = useImage(s.plant);
  const clock = useClock();
  // 꽃마다 흔들리는 타이밍이 달라지도록
  const [phase] = useState(() => Math.random() * 20);

  // 흙을 안 그리면 뿌리(baseY) 아래는 잘라서 식물 밑동이 바닥에 오게
  const visibleH = showSoil ? s.h : s.baseY + 4;
  const scale = Math.min(size / visibleH, size / s.w);
  const width = s.w * scale;
  const height = visibleH * scale;

  const uniforms = useDerivedValue(() => ({
    t: (clock.value / 1000) * speed + phase,
    baseY: s.baseY,
    amp: s.amp * strength,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {plant && (soil || !showSoil) ? (
        <Canvas style={{ width, height }}>
          <Group transform={[{ scale }]}>
            {showSoil && soil ? <Image image={soil} x={0} y={0} width={s.w} height={s.h} fit="fill" /> : null}
            <Rect x={0} y={0} width={s.w} height={s.h}>
              <Shader source={getWind()} uniforms={uniforms}>
                <ImageShader image={plant} fit="fill" rect={{ x: 0, y: 0, width: s.w, height: s.h }} tx="decal" ty="decal" />
              </Shader>
            </Rect>
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}
