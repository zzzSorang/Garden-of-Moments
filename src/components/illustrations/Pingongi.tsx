import { Image } from 'expo-image';

/** 핑옹이 3D 렌더 이미지 (레트로 CG 뷰어와 같은 조명으로 렌더, 원본: 프로젝트 파일 pingong/pingong_v1.glb) */
const POSES = {
  default: require('../../../assets/images/pingong/pingong_default.webp'),
  greet: require('../../../assets/images/pingong/pingong_greet.webp'),
  brief: require('../../../assets/images/pingong/pingong_brief.webp'),
} as const;

/** 이미지 세로/가로 비율 */
export const PINGONGI_RATIO = 1.36;

export type PingongiPose = keyof typeof POSES;

export function Pingongi({ size = 120, pose = 'default' }: { size?: number; pose?: PingongiPose }) {
  return (
    <Image
      source={POSES[pose]}
      style={{ width: size, height: size * PINGONGI_RATIO }}
      contentFit="contain"
      accessibilityLabel="핑옹이"
    />
  );
}
