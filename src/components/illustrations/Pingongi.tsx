import { Image } from 'expo-image';

/** 핑옹이 3D 렌더 이미지 (원본: 프로젝트 파일 pingong/pingong_v1.glb) */
const POSES = {
  default: require('../../../assets/images/pingong/pingong_default.webp'),
  greet: require('../../../assets/images/pingong/pingong_greet.webp'),
  brief: require('../../../assets/images/pingong/pingong_brief.webp'),
} as const;

export type PingongiPose = keyof typeof POSES;

export function Pingongi({ size = 120, pose = 'default' }: { size?: number; pose?: PingongiPose }) {
  return (
    <Image
      source={POSES[pose]}
      style={{ width: size, height: size * 1.3 }}
      contentFit="contain"
      accessibilityLabel="핑옹이"
    />
  );
}
