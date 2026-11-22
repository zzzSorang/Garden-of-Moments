import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, FloatingButton, GardenScene, Screen } from '@/components';
import { useGarden } from '@/lib/garden';
import { useNow } from '@/lib/useNow';
import { space } from '@/theme/theme';

/** 오늘의 문구 (Make) — 날짜마다 바뀜 */
const DAILY = ['오늘도 천천히 자라고 있어요 🌿', '씨앗들이 조용히 숨쉬고 있어요 🌱', '정원이 당신을 기다리고 있어요 ☁️', '감정도 식물처럼 자라나요 🌸'];

export default function GardenScreen() {
  const { entries } = useGarden();
  const now = useNow();
  const line = DAILY[new Date(now).getDate() % DAILY.length];

  return (
    <Screen>
      <View style={styles.top}>
        <AppText variant="bodySmall" tone="tertiary" align="center">
          {line}
        </AppText>
      </View>
      <View style={styles.garden}>
        <GardenScene entries={entries} now={now} onPressPlant={(id) => router.push({ pathname: '/memory/[id]', params: { id } })} />
      </View>
      <FloatingButton accessibilityLabel="감정 묻기" onPress={() => router.push('/bury')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: space[4], paddingBottom: space[2], paddingHorizontal: space[6] },
  garden: { flex: 1, marginHorizontal: space[4], marginBottom: space[2] },
});
