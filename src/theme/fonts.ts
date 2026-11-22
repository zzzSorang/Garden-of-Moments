import { TextStyle } from 'react-native';

import { type } from './theme';

export type TypeVariant = keyof typeof type;

/**
 * TODO(폰트): Pretendard / Gowun Batang 파일을 assets/fonts 에 넣고
 * expo-font 로 불러온 뒤 FONTS_BUNDLED 를 true 로 바꾸세요.
 * 그 전까지는 type.* 의 fontFamily 를 빼고 시스템 기본 글꼴로 보여줍니다.
 */
export const FONTS_BUNDLED = false;

const fallbackWeight: Record<TypeVariant, TextStyle['fontWeight']> = {
  display: '700',
  title: '600',
  heading: '600',
  body: '400',
  bodyStrong: '600',
  label: '500',
  caption: '400',
  poem: '400',
};

/** 토큰의 글자 스타일을 실제 화면에서 쓸 수 있는 형태로 돌려줍니다. */
export function textStyle(variant: TypeVariant): TextStyle {
  const { fontFamily, ...rest } = type[variant];
  if (FONTS_BUNDLED) return { fontFamily, ...rest };
  return { ...rest, fontWeight: fallbackWeight[variant] };
}
