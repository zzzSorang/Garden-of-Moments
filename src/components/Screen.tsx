import { StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { layout, neutral } from '@/theme/theme';

/** 모든 화면의 바탕 — 배경색과 좌우 여백을 토큰으로 통일합니다. */
export function Screen({ style, ...rest }: ViewProps) {
  return <SafeAreaView edges={['top']} {...rest} style={[styles.base, style]} />;
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: neutral.bg, paddingHorizontal: layout.screenGutter },
});
