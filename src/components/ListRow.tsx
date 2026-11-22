import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { brand, neutral, radius, size, space } from '@/theme/theme';

import { AppText } from './AppText';
import { ChevronIcon } from './illustrations';

type Props = { icon: ReactNode; label: string; value?: string; onPress?: () => void; last?: boolean };

/** 설정 목록 한 줄 (Make) — 아이콘 상자 + 이름 + 값 + › */
export function ListRow({ icon, label, value, onPress, last }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}>
      <View style={styles.icon}>{icon}</View>
      <AppText variant="bodySmall" style={styles.flex}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="bodySmall" tone="tertiary">
          {value}
        </AppText>
      ) : null}
      <ChevronIcon color={neutral.faint} />
    </Pressable>
  );
}

export const listIconColor = brand.primary;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[4], paddingHorizontal: space[5] },
  divider: { borderBottomWidth: 1, borderBottomColor: neutral.divider },
  icon: { width: size.iconButton, height: size.iconButton, borderRadius: radius.sm, backgroundColor: brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  pressed: { backgroundColor: neutral.gardenSky },
});
