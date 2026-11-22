import Svg, { Ellipse, Path, Circle } from 'react-native-svg';

/** 핑옹이 — Figma Make PingongiMascot SVG */
export function Pingongi({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 120 132" fill="none">
      <Ellipse cx={60} cy={126} rx={28} ry={6} fill="#2D6A4F" opacity={0.1} />
      <Ellipse cx={34} cy={42} rx={10} ry={12} fill="white" stroke="#D4E8DA" strokeWidth={2} />
      <Ellipse cx={34} cy={42} rx={6} ry={8} fill="#F9E8EA" />
      <Ellipse cx={86} cy={42} rx={10} ry={12} fill="white" stroke="#D4E8DA" strokeWidth={2} />
      <Ellipse cx={86} cy={42} rx={6} ry={8} fill="#F9E8EA" />
      <Ellipse cx={60} cy={76} rx={38} ry={42} fill="white" />
      <Ellipse cx={60} cy={76} rx={38} ry={42} stroke="#D4E8DA" strokeWidth={2} />
      <Ellipse cx={40} cy={82} rx={9} ry={6} fill="#F2A5A7" opacity={0.35} />
      <Ellipse cx={80} cy={82} rx={9} ry={6} fill="#F2A5A7" opacity={0.35} />
      <Ellipse cx={48} cy={72} rx={5} ry={6} fill="#2C3E2D" />
      <Ellipse cx={72} cy={72} rx={5} ry={6} fill="#2C3E2D" />
      <Circle cx={50} cy={70} r={2} fill="white" />
      <Circle cx={74} cy={70} r={2} fill="white" />
      <Path d="M52 84 Q60 90 68 84" stroke="#2C3E2D" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M60 34 C54 26 46 22 44 16 C54 14 62 20 60 34Z" fill="#7DBF8E" />
      <Path d="M60 34 C66 26 74 22 76 16 C66 14 58 20 60 34Z" fill="#52A06A" opacity={0.7} />
      <Path d="M22 80 C16 74 14 68 18 64" stroke="#D4E8DA" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M98 80 C104 74 106 68 102 64" stroke="#D4E8DA" strokeWidth={3} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
