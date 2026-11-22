import { StyleSheet, View } from 'react-native';

import { AppText, Button, Screen } from '@/components';
import { supabase } from '@/lib/supabase';
import { space } from '@/theme/theme';

export default function SeedsScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">씨앗함</AppText>
      </View>
      <View style={styles.empty}>
        <AppText variant="heading" tone="secondary" align="center">
          아직 씨앗이 없어요
        </AppText>
      </View>
      {/* 임시: 테스트용 로그아웃 */}
      <View style={styles.footer}>
        <Button label="로그아웃" variant="secondary" onPress={() => supabase?.auth.signOut()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: space[4] },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingBottom: space[6] },
});
