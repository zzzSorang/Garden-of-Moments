import { useState } from 'react';
import { View } from 'react-native';
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
import { useDerivedValue } from 'react-native-reanimated';

/**
 * 바람에 살랑살랑 흔들리는 수채화 꽃 (라벤더 · 수레국화 · 아네모네 · 금잔화 · 모란)
 * - 흙은 고정, 식물만 뿌리를 기준으로 위로 갈수록 크게 휘어짐 (Skia 셰이더)
 * - Expo Go에서 동작 (@shopify/react-native-skia, react-native-reanimated 모두 Expo Go 내장)
 * - 이미지: assets/images/flowers/<꽃>/stage{1,2,3}_{soil,plant}.webp
 *   (좌우 48px · 위 24px 여백 포함. 아래 w/h/baseY/amp는 원본 해상도 기준 좌표라
 *    이미지를 작게 줄여 넣어도 값은 그대로 둡니다)
 */

const wind = Skia.RuntimeEffect.Make(`
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
`)!;

export type FlowerName = 'lavender' | 'cornflower' | 'anemone' | 'marigold' | 'peony';
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
    1: { soil: require('../../../assets/images/flowers/marigold/stage1_soil.webp'), plant: require('../../../assets/images/flowers/marigold/stage1_plant.webp'), w: 466, h: 434, baseY: 355, amp: 15 },
    2: { soil: require('../../../assets/images/flowers/marigold/stage2_soil.webp'), plant: require('../../../assets/images/flowers/marigold/stage2_plant.webp'), w: 518, h: 628, baseY: 536, amp: 23 },
    3: { soil: require('../../../assets/images/flowers/marigold/stage3_soil.webp'), plant: require('../../../assets/images/flowers/marigold/stage3_plant.webp'), w: 645, h: 839, baseY: 741, amp: 31 },
  },
  peony: {
    1: { soil: require('../../../assets/images/flowers/peony/stage1_soil.webp'), plant: require('../../../assets/images/flowers/peony/stage1_plant.webp'), w: 454, h: 426, baseY: 332, amp: 15 },
    2: { soil: require('../../../assets/images/flowers/peony/stage2_soil.webp'), plant: require('../../../assets/images/flowers/peony/stage2_plant.webp'), w: 522, h: 647, baseY: 549, amp: 23 },
    3: { soil: require('../../../assets/images/flowers/peony/stage3_soil.webp'), plant: require('../../../assets/images/flowers/peony/stage3_plant.webp'), w: 654, h: 829, baseY: 741, amp: 31 },
  },
};

type Props = {
  flower: FlowerName;
  stage: FlowerStage;
  /** 정사각형 영역 한 변(pt). 그림은 이 안에 아래 가운데 정렬로 맞춰 들어감 */
  size: number;
  /** 바람 세기 배율 (기본 1) */
  strength?: number;
  /** 바람 속도 배율 (기본 1) */
  speed?: number;
};

export function SwayingFlower({ flower, stage, size, strength = 1, speed = 1 }: Props) {
  const s = FLOWERS[flower][stage];
  const soil = useImage(s.soil);
  const plant = useImage(s.plant);
  const clock = useClock();
  // 꽃마다 흔들리는 타이밍이 달라지도록
  const [phase] = useState(() => Math.random() * 20);

  const scale = Math.min(size / s.h, size / s.w);
  const width = s.w * scale;
  const height = s.h * scale;

  const uniforms = useDerivedValue(() => ({
    t: (clock.value / 1000) * speed + phase,
    baseY: s.baseY,
    amp: s.amp * strength,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {soil && plant ? (
        <Canvas style={{ width, height }}>
          <Group transform={[{ scale }]}>
            <Image image={soil} x={0} y={0} width={s.w} height={s.h} fit="fill" />
            <Rect x={0} y={0} width={s.w} height={s.h}>
              <Shader source={wind} uniforms={uniforms}>
                <ImageShader image={plant} fit="fill" rect={{ x: 0, y: 0, width: s.w, height: s.h }} tx="decal" ty="decal" />
              </Shader>
            </Rect>
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}
