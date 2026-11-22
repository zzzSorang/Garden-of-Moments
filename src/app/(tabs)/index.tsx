import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { FloatingButton, GardenBed, Screen, ScreenHeader } from '@/components';
import { useGarden } from '@/lib/garden';
import { useNow } from '@/lib/useNow';
import { space } from '@/theme/theme';

export default function GardenScreen() {
  const { entries } = useGarden();
  const now = useNow();

  return (
    <Screen>
      <ScreenHeader title="나의 정원" subtitle={entries.length ? `묻은 감정 ${entries.length}개` : undefined} />
      <View style={styles.bed}>
        <GardenBed entries={entries} now={now} onPressPlant={(id) => router.push({ pathname: '/memory/[id]', params: { id } })} />
      </View>
      <FloatingButton accessibilityLabel="감정 묻기" onPress={() => router.push('/bury')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bed: { flex: 1, paddingBottom: space[16] + space[8] },
});
