import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Chip, EMOTION_ORDER, Emoji, EmotionBadge, PlantIllustration, Screen, ScreenHeader, SegmentedTabs } from '@/components';
import { Entry, useGarden } from '@/lib/garden';
import { formatDate, growthStage, STAGE_LABEL, visualStage } from '@/lib/growth';
import { useNow } from '@/lib/useNow';
import { elevation, emotion, EmotionKey, makeEmotion, neutral, radius, size, space, stageDot } from '@/theme/theme';

type Sort = 'date' | 'emotion';

/** 기억함 (Make SeedBoxScreen) */
export default function MemoriesScreen() {
  const { entries } = useGarden();
  const now = useNow();
  const [sort, setSort] = useState<Sort>('date');
  const [filter, setFilter] = useState<EmotionKey | null>(null);

  const list = useMemo(() => {
    const filtered = filter ? entries.filter((e) => e.emotion === filter) : entries;
    const byDate = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    return sort === 'date' ? byDate : byDate.sort((a, b) => EMOTION_ORDER.indexOf(a.emotion) - EMOTION_ORDER.indexOf(b.emotion));
  }, [entries, filter, sort]);

  if (entries.length === 0) {
    return (
      <Screen style={styles.emptyAll}>
        <Emoji size="hero">🌱</Emoji>
        <AppText variant="body" tone="tertiary" style={styles.emptyTitle}>
          아직 묻은 기억이 없어요
        </AppText>
        <AppText variant="bodySmall" tone="tertiary">
          감정을 묻어보아요
        </AppText>
      </Screen>
    );
  }

  const renderItem = ({ item }: { item: Entry }) => {
    const stage = visualStage(item.kind, growthStage(item.kind, item.createdAt, now));
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/memory/[id]', params: { id: item.id } })}
        style={({ pressed }) => [styles.card, elevation.card, pressed && styles.pressed]}>
        <PlantIllustration emotion={item.emotion} stage={stage} size={size.plantThumb} />
        <View style={styles.cardBody}>
          <EmotionBadge emotionKey={item.emotion} size="xs" />
          <AppText variant="bodySmall" tone={item.memo ? 'secondary' : 'tertiary'} numberOfLines={2}>
            {item.memo || '메모 없음'}
          </AppText>
          <AppText variant="caption" tone="tertiary">
            {formatDate(item.createdAt)}
          </AppText>
        </View>
        <View style={styles.stage}>
          <View style={[styles.stageDot, { backgroundColor: stageDot[stage] }]} />
          <AppText variant="caption" tone="tertiary">
            {STAGE_LABEL[item.kind][growthStage(item.kind, item.createdAt, now)]}
          </AppText>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen>
      <ScreenHeader title="기억함" subtitle={filter ? `${emotion[filter].label} ${list.length}개` : `묻은 감정 ${entries.length}개`} />
      <View style={styles.segment}>
        <SegmentedTabs
          value={sort}
          onChange={setSort}
          options={[
            { value: 'date', label: '날짜순' },
            { value: 'emotion', label: '감정별' },
          ]}
        />
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Chip label="전체" selected={filter === null} onPress={() => setFilter(null)} />
          {EMOTION_ORDER.map((k) => (
            <Chip
              key={k}
              label={emotion[k].label}
              emotionKey={k}
              count={entries.filter((e) => e.emotion === k).length}
              selected={filter === k}
              onPress={() => setFilter(filter === k ? null : k)}
            />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={list}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          filter ? (
            <View style={styles.emptyFilter}>
              <Emoji size="xxl">{makeEmotion[filter].emoji}</Emoji>
              <AppText variant="bodySmall" tone="tertiary">
                {emotion[filter].label} 감정의 기억이 없어요
              </AppText>
            </View>
          ) : undefined
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyAll: { alignItems: 'center', justifyContent: 'center', paddingBottom: space[16] + space[4] },
  emptyTitle: { marginTop: space[4] },
  segment: { paddingHorizontal: space[6], marginBottom: space[3] },
  filters: { gap: space[2], paddingHorizontal: space[6], paddingBottom: space[1], marginBottom: space[4] },
  list: { gap: space[3], paddingHorizontal: space[6], paddingBottom: space[6] },
  card: { flexDirection: 'row', alignItems: 'center', gap: space[4], padding: space[4], borderRadius: radius.card, backgroundColor: neutral.surface },
  pressed: { transform: [{ scale: 0.98 }] },
  cardBody: { flex: 1, minWidth: 0, gap: space[1] },
  stage: { alignItems: 'center', gap: space[1] },
  stageDot: { width: space[2], height: space[2], borderRadius: radius.full },
  emptyFilter: { alignItems: 'center', paddingVertical: space[16], gap: space[3] },
});
