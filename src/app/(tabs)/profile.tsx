import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Bar, Button, Card, DevClockPanel, EMOTION_ORDER, ListRow, Screen, ScreenHeader } from '@/components';
import { useAuth } from '@/lib/auth';
import { useGarden } from '@/lib/garden';
import { growthStage } from '@/lib/growth';
import { supabase } from '@/lib/supabase';
import { useNow } from '@/lib/useNow';
import { brand, EmotionKey, space } from '@/theme/theme';

export default function ProfileScreen() {
  const { session } = useAuth();
  const { entries } = useGarden();
  const now = useNow();

  const stats = useMemo(() => {
    const counts = Object.fromEntries(EMOTION_ORDER.map((k) => [k, 0])) as Record<EmotionKey, number>;
    entries.forEach((e) => counts[e.emotion]++);
    const bloomed = entries.filter((e) => growthStage(e.kind, e.createdAt, now) === 'bloom').length;
    const first = entries.reduce((min, e) => Math.min(min, e.createdAt), now);
    const days = entries.length ? Math.floor((now - first) / 86_400_000) + 1 : 0;
    return { counts, bloomed, days, max: Math.max(0, ...Object.values(counts)) };
  }, [entries, now]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="프로필" subtitle={session?.user.email ?? undefined} />

        <Card>
          <View style={styles.statsRow}>
            {[
              { label: '묻은 감정', value: entries.length },
              { label: '다 자란 식물', value: stats.bloomed },
              { label: '정원 가꾼 날', value: stats.days },
            ].map((s) => (
              <View key={s.label} style={styles.stat}>
                <AppText variant="title" color={brand.primaryInk}>
                  {s.value}
                </AppText>
                <AppText variant="caption" tone="tertiary">
                  {s.label}
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <AppText variant="heading">감정별 기록</AppText>
          {EMOTION_ORDER.map((k) => (
            <Bar key={k} emotionKey={k} count={stats.counts[k]} max={stats.max} />
          ))}
        </Card>

        <View>
          <AppText variant="bodySmall" tone="tertiary" style={styles.sectionLabel}>
            설정
          </AppText>
          <Card style={styles.listCard}>
            {/* TODO: 각 항목 화면 연결. 테마 설정은 MVP 제외 */}
            <ListRow label="알림" value="준비 중" />
            <ListRow label="앱 소개" />
            <ListRow label="개인정보처리방침" last />
          </Card>
        </View>

        {/* 임시: 테스트용 로그아웃 */}
        <Button label="로그아웃" variant="ghost" onPress={() => supabase?.auth.signOut()} />

        {/* 개발 빌드에서만 보이는 시간 조절 도구 (출시 빌드에서는 숨김) */}
        {__DEV__ ? <DevClockPanel /> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: space[4], paddingBottom: space[10] },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', gap: space[1] },
  sectionLabel: { paddingHorizontal: space[1], paddingBottom: space[2] },
  listCard: { padding: 0, gap: 0, overflow: 'hidden' },
});
