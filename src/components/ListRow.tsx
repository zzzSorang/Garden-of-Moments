import { Pressable, StyleSheet, View } from 'react-native';

import { layout, neutral, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = { label: string; value?: string; onPress?: () => void; last?: boolean };

/** 설정 목록 한 줄 */
export function ListRow({ label, value, onPress, last }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}>
      <AppText variant="body">{label}</AppText>
      <View style={styles.right}>
        {value ? (
          <AppText variant="bodySmall" tone="tertiary">
            {value}
          </AppText>
        ) : null}
        <AppText variant="body" color={neutral.decor}>
          ›
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: layout.minTouch + space[2], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space[4] },
  divider: { borderBottomWidth: 1, borderBottomColor: neutral.border },
  right: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  pressed: { backgroundColor: neutral.surfaceSunken },
});
