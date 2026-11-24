import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { size as sizes } from '@/theme/theme';

/**
 * 걷기 프레임 16장 — 3D 모델(pingong_gc.glb)의 Walk 동작(1초)을 오른쪽 3/4 방향으로 렌더.
 * 왼쪽으로 걸을 때는 좌우 반전해서 씁니다.
 */
const FRAMES = [
  require('../../assets/images/pingong/walk/f00.webp'),
  require('../../assets/images/pingong/walk/f01.webp'),
  require('../../assets/images/pingong/walk/f02.webp'),
  require('../../assets/images/pingong/walk/f03.webp'),
  require('../../assets/images/pingong/walk/f04.webp'),
  require('../../assets/images/pingong/walk/f05.webp'),
  require('../../assets/images/pingong/walk/f06.webp'),
  require('../../assets/images/pingong/walk/f07.webp'),
  require('../../assets/images/pingong/walk/f08.webp'),
  require('../../assets/images/pingong/walk/f09.webp'),
  require('../../assets/images/pingong/walk/f10.webp'),
  require('../../assets/images/pingong/walk/f11.webp'),
  require('../../assets/images/pingong/walk/f12.webp'),
  require('../../assets/images/pingong/walk/f13.webp'),
  require('../../assets/images/pingong/walk/f14.webp'),
  require('../../assets/images/pingong/walk/f15.webp'),
];
/** 프레임 이미지 세로/가로 비율 (240×274) */
const FRAME_RATIO = 274 / 240;
/** 프레임에는 몸이 흔들리는 여백이 있어서, 몸 크기가 정원 핑옹이 크기와 비슷해지도록 키우는 배율 */
const FRAME_SCALE = 1.2;
/** Walk 동작 한 바퀴 길이(ms) — 모델 원본과 같음 */
const CLIP_MS = 1000;
const FRAME_MS = CLIP_MS / FRAMES.length;

/** 한쪽으로 걷는 시간(ms) */
const WALK_MS = 7000;
/** 끝에 도착해서 쉬는 시간(ms) */
const REST_MS = 1400;
const LEG = WALK_MS + REST_MS;
const CYCLE = LEG * 2;

type Props = {
  /** 정원 영역 크기 */
  width: number;
  height: number;
  /** 걸어다니는 가로 범위 (%), 발끝이 닿는 세로 위치 (%) */
  fromX: number;
  toX: number;
  groundY: number;
};

/** 지금 시각이 걷는 중인지와 이번 방향에서 지난 시간 */
function phaseAt(elapsed: number) {
  const time = elapsed % CYCLE;
  const goingRight = time < LEG;
  const legTime = goingRight ? time : time - LEG;
  return { goingRight, legTime, walking: legTime < WALK_MS };
}

/**
 * 정원을 좌우로 천천히 걸어다니는 핑옹이.
 * 이동·방향 전환은 Reanimated로, 다리 움직임은 걷기 프레임을 넘겨서 보여줘요.
 * 끝에 닿으면 잠깐 서 있다가 돌아서요. 터치는 통과시켜 뒤 식물을 누를 수 있어요.
 */
export function WalkingPingongi({ width, height, fromX, toX, groundY }: Props) {
  const w = sizes.mascotGarden * FRAME_SCALE;
  const h = w * FRAME_RATIO;
  const t = useSharedValue(0);
  const start = useRef(0);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    start.current = Date.now();
    t.value = withRepeat(withTiming(CYCLE, { duration: CYCLE, easing: Easing.linear }), -1, false);
    // 걷는 동안만 프레임을 넘기고, 쉬는 동안은 첫 프레임에 멈춰 서 있음
    const id = setInterval(() => {
      const { walking, legTime } = phaseAt(Date.now() - start.current);
      setFrame(walking ? Math.floor(legTime / FRAME_MS) % FRAMES.length : 0);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [t]);

  const left = (fromX / 100) * width - w / 2;
  const span = ((toX - fromX) / 100) * width;

  const style = useAnimatedStyle(() => {
    const time = t.value % CYCLE;
    const goingRight = time < LEG;
    const legTime = goingRight ? time : time - LEG;
    const p = legTime < WALK_MS ? legTime / WALK_MS : 1; // 이번 방향 진행률 0~1
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // 출발·도착 때 천천히
    const x = (goingRight ? eased : 1 - eased) * span;
    return { transform: [{ translateX: x }, { scaleX: goingRight ? 1 : -1 }] };
  });

  return (
    <Animated.View style={[styles.wrap, { left, top: (groundY / 100) * height - h, width: w, height: h }, style]}>
      {/* 16장을 모두 겹쳐 두고 지금 프레임만 보이게 — 이미지를 바꿔 끼울 때 깜빡이지 않도록 */}
      {FRAMES.map((src, i) => (
        <View key={i} style={[StyleSheet.absoluteFill, { opacity: i === frame ? 1 : 0 }]}>
          <Image source={src} style={styles.fill} contentFit="contain" accessibilityLabel={i === 0 ? '걷고 있는 핑옹이' : undefined} />
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', pointerEvents: 'none' },
  fill: { width: '100%', height: '100%' },
});
