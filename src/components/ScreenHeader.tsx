import { StyleSheet, View } from 'react-native';

import { space } from '@/theme/theme';

import { AppText } from './AppText';

/** 화면 제목 (Make) — 위 여백 + text-xl 제목 + 작은 부제 */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title">{title}</AppText>
      {subtitle ? (
        <AppText variant="bodySmall" tone="tertiary">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { paddingTop: space[4], paddingBottom: space[4], paddingHorizontal: space[6], gap: 2 } });
