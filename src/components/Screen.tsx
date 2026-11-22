import { StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

import { neutral } from '@/theme/theme';

/** 모든 화면의 바탕 — 배경색 통일. 좌우 여백은 각 화면 레이아웃에서 (Make: 24) */
export function Screen({ style, edges = ['top'], ...rest }: SafeAreaViewProps) {
  return <SafeAreaView edges={edges} {...rest} style={[styles.base, style]} />;
}

const styles = StyleSheet.create({ base: { flex: 1, backgroundColor: neutral.bg } });
