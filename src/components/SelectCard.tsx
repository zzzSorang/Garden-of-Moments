import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { brand, elevation, neutral, radius, space } from '@/theme/theme';

import { CheckIcon } from './illustrations';

type Props = {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  /** 선택 테두리·체크 색 (감정 카드는 감정색) */
  accent?: string;
  /** 선택 배경 */
  selectedBg?: string;
  /** 큰 카드(씨앗 고르기): 라운드 20, 안쪽 여백 20 */
  large?: boolean;
};

/** 큰 선택 카드 (Make 묻기 모달) — 선택되면 색 테두리 + 오른쪽 체크 */
export function SelectCard({ selected, onPress, children, accent = brand.primary, selectedBg = brand.primarySoft, large }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.base,
        large ? styles.large : styles.small,
        { borderColor: selected ? accent : 'transparent', backgroundColor: selected ? selectedBg : neutral.surface },
        selected && !large ? { ...elevation.soft, shadowColor: accent, shadowOpacity: 0.27, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } } : elevation.soft,
      ]}>
      <View style={styles.content}>{children}</View>
      {selected ? (
        <View style={[styles.check, { backgroundColor: accent }]}>
          <CheckIcon />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: space[4], borderWidth: 2 },
  small: { padding: space[4], borderRadius: radius.md },
  large: { padding: space[5], borderRadius: radius.lg },
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[4] },
  check: { width: space[5], height: space[5], borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
});
