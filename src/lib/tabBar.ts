import type { ViewStyle } from 'react-native';

import { neutral, space } from '@/theme/theme';

/** 탭바 모양 (Make) — 정원 사진 모드에서 숨겼다가 다시 돌려놓을 때도 같은 값을 씁니다 */
export function tabBarStyle(bottomInset: number): ViewStyle {
  return { backgroundColor: neutral.tabBar, borderTopColor: neutral.tabBorder, borderTopWidth: 1, paddingTop: space[2], height: space[16] + bottomInset };
}
