import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { neutral } from '@/theme/theme';

/** 상세 히어로 배경 — 감정 연한색 → 정원 하늘색, 160° 그라데이션 (Make) */
export function HeroGradient({ from }: { from: string }) {
  return (
    <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none" viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="hero" x1="0.33" y1="0" x2="0.67" y2="1">
          <Stop offset="0" stopColor={from} />
          <Stop offset="1" stopColor={neutral.gardenSky} />
        </LinearGradient>
      </Defs>
      <Rect width="100" height="100" fill="url(#hero)" />
    </Svg>
  );
}
