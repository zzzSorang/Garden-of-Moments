import { Pressable, StyleSheet } from 'react-native';

import { neutral, space } from '@/theme/theme';

import { AppText } from './AppText';
import { BackIcon } from './illustrations';

/** ‹ 돌아가기 링크 (Make) */
export function BackLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={space[3]} style={styles.row}>
      <BackIcon color={neutral.decor} size={20} />
      <AppText variant="bodySmall" tone="tertiary">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space[1] } });
