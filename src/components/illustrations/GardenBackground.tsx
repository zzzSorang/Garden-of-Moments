import { StyleSheet } from 'react-native';
import Svg, { Ellipse, G, Line, Path, Rect } from 'react-native-svg';

/** 정원 배경 — Figma Make GardenBackground (하늘·구름·언덕·물결 땅·풀·돌·나비) */
export function GardenBackground({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} viewBox="0 0 390 520" preserveAspectRatio="xMidYMid slice" fill="none">
      <Rect width={390} height={520} fill="#F8FBF8" />
      <G opacity={0.55}>
        <Ellipse cx={70} cy={60} rx={40} ry={20} fill="white" />
        <Ellipse cx={100} cy={52} rx={28} ry={18} fill="white" />
        <Ellipse cx={50} cy={58} rx={22} ry={14} fill="white" />
      </G>
      <G opacity={0.45}>
        <Ellipse cx={300} cy={80} rx={50} ry={22} fill="white" />
        <Ellipse cx={340} cy={70} rx={32} ry={18} fill="white" />
        <Ellipse cx={270} cy={78} rx={28} ry={16} fill="white" />
      </G>
      <G opacity={0.3}>
        <Ellipse cx={190} cy={40} rx={35} ry={16} fill="white" />
        <Ellipse cx={215} cy={34} rx={22} ry={13} fill="white" />
      </G>
      <Ellipse cx={80} cy={290} rx={130} ry={80} fill="#D4EBDA" opacity={0.4} />
      <Ellipse cx={320} cy={310} rx={120} ry={70} fill="#C8E4CF" opacity={0.35} />
      <Ellipse cx={195} cy={280} rx={100} ry={60} fill="#DCF0E2" opacity={0.3} />
      <Path d="M0 340 Q40 320 80 338 Q130 360 180 330 Q230 305 280 330 Q330 355 390 325 L390 520 L0 520 Z" fill="#E8F5EC" />
      <Path d="M0 360 Q50 340 100 355 Q150 375 200 348 Q250 325 300 350 Q350 372 390 345 L390 520 L0 520 Z" fill="#D8EFE0" />
      {[40, 90, 150, 210, 270, 330].map((x) => (
        <G key={x} opacity={0.25}>
          <Path d={`M${x} 380 C${x - 3} 368 ${x} 360 ${x + 2} 370`} stroke="#52A06A" strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d={`M${x + 10} 385 C${x + 7} 373 ${x + 10} 365 ${x + 12} 375`} stroke="#52A06A" strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </G>
      ))}
      <Ellipse cx={155} cy={400} rx={8} ry={5} fill="#C8D8C8" opacity={0.5} />
      <Ellipse cx={240} cy={420} rx={6} ry={4} fill="#C8D8C8" opacity={0.4} />
      <Ellipse cx={330} cy={390} rx={7} ry={4.5} fill="#C8D8C8" opacity={0.45} />
      <G opacity={0.5} transform="translate(200, 160) rotate(-10)">
        <Path d="M0 0 C-8 -10 -18 -8 -14 0 C-18 8 -8 10 0 0Z" fill="#F2A5A7" />
        <Path d="M0 0 C8 -10 18 -8 14 0 C18 8 8 10 0 0Z" fill="#C9B3F5" />
        <Line x1={0} y1={-3} x2={0} y2={3} stroke="#555" strokeWidth={0.8} />
      </G>
      <G opacity={0.4} transform="translate(120, 200) rotate(15)">
        <Path d="M0 0 C-6 -8 -14 -6 -11 0 C-14 6 -6 8 0 0Z" fill="#F5D49B" />
        <Path d="M0 0 C6 -8 14 -6 11 0 C14 6 6 8 0 0Z" fill="#A8C4E8" />
        <Line x1={0} y1={-2} x2={0} y2={2} stroke="#555" strokeWidth={0.8} />
      </G>
    </Svg>
  );
}
