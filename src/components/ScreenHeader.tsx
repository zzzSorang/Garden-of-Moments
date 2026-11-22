import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/theme/theme';

import { AppText } from './AppText';

export function ScreenHeader({ title, subtitle, left, right }: { title: string; subtitle?: string; left?: ReactNode; right?: ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {left}
        <View style={styles.flex}>
          <AppText variant="title">{title}</AppText>
          {subtitle ? (
            <AppText variant="bodySmall" tone="tertiary">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: space[4], paddingBottom: space[3] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
});
