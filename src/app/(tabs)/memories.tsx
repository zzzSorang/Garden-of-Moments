import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Card, Chip, EMOTION_ORDER, Plant, Screen, ScreenHeader, SegmentedTabs } from '@/components';
import { Entry, useGarden } from '@/lib/garden';
import { formatDate, growthStage, KIND_LABEL, STAGE_LABEL } from '@/lib/growth';
import { useNow } from '@/lib/useNow';
import { emotion, EmotionKey, space } from '@/theme/theme';

type Sort = 'date' | 'emotion';

export default function MemoriesScreen() {
  const { entries } = useGarden();
  const now = useNow();
  const [sort, setSort] = useState<Sort>('date');
  const [filter, setFilter] = useState<EmotionKey | 'all'>('all');

  const counts = useMemo(() => {
    const c = Object.fromEntries(EMOTION_ORDER.map((k) => [k, 0])) as Record<EmotionKey, number>;
    entries.forEach((e) => c[e.emotion]++);
    return c;
  }, [entries]);

  const list = useMemo(() => {
    const filtered = filter === 'all' ? entries : entries.filter((e) => e.emotion === filter);
    const byDate = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    if (sort === 'date') return byDate;
    return byDate.sort((a, b) => EMOTION_ORDER.indexOf(a.emotion) - EMOTION_ORDER.indexOf(b.emotion));
  }, [entries, filter, sort]);

  const renderItem = ({ item }: { item: Entry }) => {
    const stage = growthStage(item.kind, item.createdAt, now);
    const e = emotion[item.emotion];
    return (
      <Card onPress={() => router.push({ pathname: '/memory/[id]', params: { id: item.id } })} style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.plantBox}>
            <Plant kind={item.kind} emotionKey={item.emotion} stage={stage} scale={0.7} />
          </View>
          <View style={styles.flex}>
            <View style={styles.titleRow}>
              <Chip label={e.label} emotionKey={item.emotion} />
              <AppText variant="bodySmall" tone="tertiary">
                {KIND_LABEL[item.kind]} · {STAGE_LABEL[item.kind][stage]}
              </AppText>
            </View>
            <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
              {item.memo || '메모 없음'}
            </AppText>
            <AppText variant="caption" tone="tertiary">
              {formatDate(item.createdAt)}
            </AppText>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <Screen>
      <ScreenHeader title="기억함" subtitle={`모두 ${entries.length}개`} />
      <View style={styles.controls}>
        <SegmentedTabs
          value={sort}
          onChange={setSort}
          options={[
            { value: 'date', label: '날짜순' },
            { value: 'emotion', label: '감정별' },
          ]}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Chip label="전체" count={entries.length} selected={filter === 'all'} onPress={() => setFilter('all')} />
          {EMOTION_ORDER.map((k) => (
            <Chip key={k} label={emotion[k].label} emotionKey={k} count={counts[k]} selected={filter === k} onPress={() => setFilter(k)} />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={list}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant="body" tone="tertiary" align="center">
              {entries.length ? '이 감정으로 묻은 기억이 없어요' : '아직 기억이 없어요'}
            </AppText>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: { gap: space[3], paddingBottom: space[3] },
  filters: { gap: space[2], paddingRight: space[5] },
  list: { gap: space[3], paddingBottom: space[8] },
  card: { padding: space[4] },
  cardRow: { flexDirection: 'row', gap: space[4], alignItems: 'center' },
  plantBox: { width: space[12], alignItems: 'center', justifyContent: 'flex-end' },
  flex: { flex: 1, gap: space[1] },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  empty: { paddingVertical: space[16] },
});
