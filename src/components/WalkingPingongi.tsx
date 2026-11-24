import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { cancelAnimation, Easing, SharedValue, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { size as sizes } from '@/theme/theme';

/**
 * 걷기 프레임 30장(초당 30장) — 3D 모델(pingong_gc.glb)의 Walk 동작(1초)을 오른쪽 45° 방향으로 렌더.
 * 몸통의 앞뒤 쏠림과 좌우로 도는 움직임을 없애고 머리 위치를 프레임마다 맞춰서,
 * 절뚝이거나 뒤돌아보는 것처럼 보이지 않고 일정하게 걸어 보이게 했어요.
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
  require('../../assets/images/pingong/walk/f16.webp'),
  require('../../assets/images/pingong/walk/f17.webp'),
  require('../../assets/images/pingong/walk/f18.webp'),
  require('../../assets/images/pingong/walk/f19.webp'),
  require('../../assets/images/pingong/walk/f20.webp'),
  require('../../assets/images/pingong/walk/f21.webp'),
  require('../../assets/images/pingong/walk/f22.webp'),
  require('../../assets/images/pingong/walk/f23.webp'),
  require('../../assets/images/pingong/walk/f24.webp'),
  require('../../assets/images/pingong/walk/f25.webp'),
  require('../../assets/images/pingong/walk/f26.webp'),
  require('../../assets/images/pingong/walk/f27.webp'),
  require('../../assets/images/pingong/walk/f28.webp'),
  require('../../assets/images/pingong/walk/f29.webp'),
];
/** 프레임 이미지 세로/가로 비율 (240×260) */
const FRAME_RATIO = 260 / 240;
/** 프레임에는 몸이 흔들리는 여백이 있어서, 몸 크기가 정원 핑옹이 크기와 비슷해지도록 키우는 배율 */
const FRAME_SCALE = 1.35;
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

/**
 * 정원을 좌우로 천천히 걸어다니는 핑옹이.
 * 이동·방향 전환·프레임 넘기기를 모두 하나의 Reanimated 시계로 UI 스레드에서 처리해서
 * 자바스크립트가 바빠도 끊기지 않고, 발걸음과 이동이 어긋나지 않아요.
 * 끝에 닿으면 잠깐 서 있다가 돌아서요. 터치는 통과시켜 뒤 식물을 누를 수 있어요.
 */
export function WalkingPingongi({ width, height, fromX, toX, groundY }: Props) {
  const w = sizes.mascotGarden * FRAME_SCALE;
  const h = w * FRAME_RATIO;
  const t = useSharedValue(0);

  useEffect(() => {
    // 항상 0부터 다시 시작 — 코드가 다시 불러와질 때 이전 값에서 이어 돌면 제자리에서 방향만 바뀌는 문제가 생김
    cancelAnimation(t);
    t.value = 0;
    t.value = withRepeat(withTiming(CYCLE, { duration: CYCLE, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(t);
  }, [t]);

  const left = (fromX / 100) * width - w / 2;
  const span = ((toX - fromX) / 100) * width;

  const style = useAnimatedStyle(() => {
    const time = t.value % CYCLE;
    const goingRight = time < LEG;
    const legTime = goingRight ? time : time - LEG;
    const p = legTime < WALK_MS ? legTime / WALK_MS : 1; // 이번 방향 진행률 0~1
    // 발걸음 속도가 일정하므로 이동도 일정한 속도로 (속도가 변하면 발이 미끄러져 보임)
    const x = (goingRight ? p : 1 - p) * span;
    return { transform: [{ translateX: x }, { scaleX: goingRight ? 1 : -1 }] };
  });

  return (
    <Animated.View style={[styles.wrap, { left, top: (groundY / 100) * height - h, width: w, height: h }, style]}>
      {/* 프레임을 모두 겹쳐 두고 지금 프레임만 보이게 — 이미지를 바꿔 끼울 때 깜빡이지 않도록 */}
      {FRAMES.map((src, i) => (
        <FrameLayer key={i} index={i} source={src} t={t} />
      ))}
    </Animated.View>
  );
}

/** 프레임 한 장 — 지금 보여줄 차례일 때만 불투명 (UI 스레드에서 계산) */
function FrameLayer({ index, source, t }: { index: number; source: number; t: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const time = t.value % CYCLE;
    const legTime = time < LEG ? time : time - LEG;
    // 걷는 동안만 프레임을 넘기고, 쉬는 동안은 첫 프레임으로 서 있음
    const current = legTime < WALK_MS ? Math.floor(legTime / FRAME_MS) % FRAMES.length : 0;
    return { opacity: current === index ? 1 : 0 };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Image source={source} style={styles.fill} contentFit="contain" accessibilityLabel={index === 0 ? '걷고 있는 핑옹이' : undefined} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', pointerEvents: 'none' },
  fill: { width: '100%', height: '100%' },
});
