import { TextStyle } from 'react-native';

import { type } from './theme';

export type TypeVariant = keyof typeof type;

/**
 * 글꼴 파일 — app/_layout.tsx 에서 useFonts 로 아래 이름 그대로 불러옵니다.
 * Pretendard 는 assets/fonts 에, 고운바탕은 @expo-google-fonts/gowun-batang 에서 가져옵니다.
 */
export const fontAssets = {
  'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.otf'),
  'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.otf'),
  'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
  'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.otf'),
  'GowunBatang-Regular': require('@expo-google-fonts/gowun-batang/400Regular/GowunBatang_400Regular.ttf'),
  'GowunBatang-Bold': require('@expo-google-fonts/gowun-batang/700Bold/GowunBatang_700Bold.ttf'),
};

/** 토큰의 글자 스타일을 그대로 돌려줍니다. 굵기는 fontFamily 로만 표현합니다(fontWeight 사용 안 함). */
export function textStyle(variant: TypeVariant): TextStyle {
  return { ...type[variant] };
}
