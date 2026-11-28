import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, BackLink, Card, Pingongi, PlantIllustration, Screen } from '@/components';
import { useAuth } from '@/lib/auth';
import { useGarden } from '@/lib/garden';
import { KIND_LABEL, visualStage } from '@/lib/growth';
import { buildNotices, formatAgo, GardenNotice, groupNotices, NEW_WINDOW, NOTICE_TEXT } from '@/lib/notifications';
import { useNow } from '@/lib/useNow';
import { brand, emotion, makeEmotion, neutral, radius, size, space } from '@/theme/theme';

/** 알림 — 정원의 식물이 자란 소식 (최신순, 오늘 / 이번 주 / 지난 알림) */
export default function NotificationsScreen() {
  const { session, loading } = useAuth();
  const { entries } = useGarden();
  const now = useNow(60 * 1000);

  if (!loading && !session) return <Redirect href="/login" />;

  const groups = groupNotices(buildNotices(entries, now), now);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.top}>
        <BackLink label="정원" onPress={close} />
        <AppText variant="title">알림</AppText>
        <AppText variant="bodySmall" tone="tertiary">
          정원에서 자라난 소식을 모아 두었어요
        </AppText>
      </View>

      {groups.length === 0 ? (
        <View style={styles.empty}>
          <Pingongi size={size.mascotHero} />
          <AppText variant="poem" align="center" color={brand.primaryInk}>
            {'아직 새 소식이 없어요.\n씨앗이 자라면 알려 줄게요.'}
          </AppText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {groups.map((g) => (
            <View key={g.title} style={styles.group}>
              <AppText variant="label" tone="tertiary" style={styles.groupTitle}>
                {g.title}
              </AppText>
              <Card style={styles.card}>
                {g.items.map((n, i) => (
                  <NoticeRow key={n.id} n={n} now={now} last={i === g.items.length - 1} />
                ))}
              </Card>
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

function NoticeRow({ n, now, last }: { n: GardenNotice; now: number; last: boolean }) {
  const e = makeEmotion[n.emotion];
  const isNew = now - n.at < NEW_WINDOW;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/memory/[id]', params: { id: n.entryId } })}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}>
      <View style={[styles.thumb, { backgroundColor: e.lightColor }]}>
        <PlantIllustration emotion={n.emotion} kind={n.kind} stage={visualStage(n.kind, n.stage)} size={size.plantThumb - space[2]} />
      </View>
      <View style={styles.body}>
        <AppText variant="bodySmall">
          <AppText variant="bodySmall" color={brand.primaryInk} style={styles.strong}>
            {emotion[n.emotion].label} {KIND_LABEL[n.kind]}
          </AppText>
          에 {NOTICE_TEXT[n.kind][n.stage]}
        </AppText>
        {n.memo ? (
          <AppText variant="caption" tone="tertiary" numberOfLines={1}>
            {n.memo}
          </AppText>
        ) : null}
        <AppText variant="micro" tone="tertiary">
          {formatAgo(n.at, now)}
        </AppText>
      </View>
      {isNew ? <View style={styles.dot} accessibilityLabel="새 알림" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: space[4], paddingBottom: space[4], paddingHorizontal: space[6], gap: space[2] },
  scroll: { paddingHorizontal: space[6], paddingBottom: space[8], gap: space[5] },
  group: { gap: space[2] },
  groupTitle: { paddingLeft: space[1] },
  card: { padding: 0, gap: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4] },
  divider: { borderBottomWidth: 1, borderBottomColor: neutral.divider },
  pressed: { backgroundColor: neutral.gardenSky },
  thumb: { width: size.plantThumb, height: size.plantThumb, borderRadius: radius.icon, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  body: { flex: 1, gap: space[0.5] },
  strong: { fontWeight: '600' },
  dot: { width: size.progressDot + 2, height: size.progressDot + 2, borderRadius: radius.full, backgroundColor: brand.primary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[4], paddingBottom: space[16] },
});
