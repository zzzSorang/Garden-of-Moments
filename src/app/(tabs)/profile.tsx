import Constants from 'expo-constants';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Bar, BellIcon, Button, Card, DevClockPanel, EMOTION_ORDER, Emoji, InfoIcon, ListRow, LockIcon, Pingongi, Screen, ScreenHeader } from '@/components';
import { useGarden } from '@/lib/garden';
import { DAY, growthStage } from '@/lib/growth';
import { supabase } from '@/lib/supabase';
import { useNow } from '@/lib/useNow';
import { border, brand, elevation, EmotionKey, neutral, radius, size, space } from '@/theme/theme';

/** 프로필 (Make ProfileScreen) */
export default function ProfileScreen() {
  const { entries, addSeed, clearSeed } = useGarden();
  const now = useNow();

  const stats = useMemo(() => {
    const counts = Object.fromEntries(EMOTION_ORDER.map((k) => [k, 0])) as Record<EmotionKey, number>;
    let growing = 0;
    let done = 0;
    entries.forEach((e) => {
      counts[e.emotion]++;
      const s = growthStage(e.kind, e.createdAt, now);
      if (s === 'bloom') done++;
      else if (s !== 'seed') growing++;
    });
    const first = entries.length ? Math.min(...entries.map((e) => e.createdAt)) : null;
    const days = first === null ? null : Math.floor((now - first) / DAY) + 1;
    return { counts, growing, done, days, max: Math.max(1, ...Object.values(counts)) };
  }, [entries, now]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="나의 정원" />

        <View style={[styles.hero, elevation.hero]}>
          <View style={styles.avatar}>
            <Pingongi size={size.mascotAvatar} />
          </View>
          <View style={styles.flex}>
            <AppText variant="body">핑옹이의 정원</AppText>
            <AppText variant="caption" tone="tertiary">
              {stats.days === null ? '아직 묻은 감정이 없어요' : `감정을 묻기 시작한 지 ${stats.days}일째`}
            </AppText>
            <View style={styles.badge}>
              <Emoji size="sm">🌱</Emoji>
              <AppText variant="caption" color={brand.primaryInk}>
                정원사
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          {[
            { value: entries.length, label: '총 감정' },
            { value: stats.growing, label: '자라는 중' },
            { value: stats.done, label: '피어난 꽃·나무' },
          ].map((s) => (
            <View key={s.label} style={[styles.stat, elevation.card]}>
              <AppText variant="stat" color={brand.primaryInk}>
                {s.value}
              </AppText>
              <AppText variant="tab" tone="tertiary">
                {s.label}
              </AppText>
            </View>
          ))}
        </View>

        <Card style={styles.section}>
          <AppText variant="bodySmall" tone="tertiary">
            감정별 기록
          </AppText>
          <View style={styles.bars}>
            {EMOTION_ORDER.map((k) => (
              <Bar key={k} emotionKey={k} count={stats.counts[k]} max={stats.max} />
            ))}
          </View>
          {entries.length === 0 ? (
            <AppText variant="bodySmall" tone="tertiary" align="center">
              아직 묻은 감정이 없어요
            </AppText>
          ) : null}
        </Card>

        {/* 기획: '테마'는 MVP 제외. 각 항목 화면은 아직 연결 전 */}
        <Card style={[styles.section, styles.list]}>
          <ListRow icon={<BellIcon color={brand.primary} />} label="알림 설정" />
          <ListRow icon={<InfoIcon color={brand.primary} />} label="앱 소개" />
          <ListRow icon={<LockIcon color={brand.primary} />} label="개인정보 처리방침" last />
        </Card>

        {/* 개발 빌드에서만 보이는 시간 조절 도구 (출시 빌드에서는 숨김) */}
        {__DEV__ ? (
          <View style={styles.section}>
            <DevClockPanel />
            <View style={styles.seedRow}>
              <Button label="더미 데이터 넣기" variant="secondary" onPress={addSeed} style={styles.flex} />
              <Button label="더미 비우기" variant="ghost" onPress={clearSeed} style={styles.flex} />
            </View>
          </View>
        ) : null}

        <AppText variant="caption" color={neutral.faint} align="center">
          사이의 정원 v{Constants.expoConfig?.version}
        </AppText>
        {/* 임시: 테스트용 로그아웃 */}
        <Button label="로그아웃" variant="ghost" onPress={() => supabase?.auth.signOut()} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space[6] },
  flex: { flex: 1, minWidth: 0, gap: 2 },
  hero: {
    marginHorizontal: space[6],
    marginTop: space[2],
    marginBottom: space[5],
    padding: space[5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    backgroundColor: neutral.surface,
    borderRadius: radius.xl,
  },
  avatar: {
    width: size.avatar,
    height: size.avatar,
    borderRadius: radius.full,
    backgroundColor: brand.primarySoft,
    borderWidth: border.thick,
    borderColor: neutral.borderSoft,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
    alignSelf: 'flex-start',
    marginTop: space[2],
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: radius.full,
    backgroundColor: brand.primarySoft,
  },
  stats: { flexDirection: 'row', gap: space[3], paddingHorizontal: space[6], marginBottom: space[5] },
  stat: { flex: 1, alignItems: 'center', gap: space[1], paddingVertical: space[4], backgroundColor: neutral.surface, borderRadius: radius.md },
  section: { marginHorizontal: space[6], marginBottom: space[5] },
  bars: { gap: space[3] },
  seedRow: { flexDirection: 'row', gap: space[3], marginTop: space[3] },
  list: { padding: 0, gap: 0, overflow: 'hidden', marginBottom: space[8] },
});
