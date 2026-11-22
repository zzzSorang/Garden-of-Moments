import { StyleSheet, View } from 'react-native';

import { AppText, FloatingButton, Screen } from '@/components';
import { space } from '@/theme/theme';

export default function GardenScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">정원</AppText>
      </View>
      <View style={styles.empty}>
        <AppText variant="heading" tone="secondary" align="center">
          아직 묻은 감정이 없어요
        </AppText>
        <AppText variant="caption" tone="tertiary" align="center">
          + 버튼을 눌러 첫 감정을 심어보세요
        </AppText>
      </View>
      {/* TODO: 감정 입력 화면 연결 */}
      <FloatingButton accessibilityLabel="감정 묻기" onPress={() => {}} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: space[4] },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[2] },
});
