import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, BackLink, Button, Card, EmotionBadge, HeroGradient, MemoInput, PlantIllustration, Screen } from '@/components';
import { useAuth } from '@/lib/auth';
import { useGarden } from '@/lib/garden';
import { canEditMemo, DAY, formatDate, formatDuration, growthStage, MEMO_EDIT_WINDOW, STAGE_LABEL, STAGE_MESSAGE, TOTAL_DAYS, visualStage } from '@/lib/growth';
import { useNow } from '@/lib/useNow';
import { border, brand, makeEmotion, neutral, opacity, radius, size, space, stageDot } from '@/theme/theme';

/** 기억 상세 (Make DetailScreen) */
export default function MemoryDetailScreen() {
  const { session, loading } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, updateMemo, remove } = useGarden();
  const now = useNow(15 * 1000);
  const entry = entries.find((e) => e.id === id);
  const [draft, setDraft] = useState(entry?.memo ?? '');
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!loading && !session) return <Redirect href="/login" />;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/memories'));

  if (!entry) {
    return (
      <Screen>
        <View style={styles.top}>
          <BackLink label="기억함" onPress={close} />
        </View>
        <AppText tone="tertiary" align="center">
          이 기억을 찾을 수 없어요.
        </AppText>
      </Screen>
    );
  }

  const e = makeEmotion[entry.emotion];
  const growth = growthStage(entry.kind, entry.createdAt, now);
  const stage = visualStage(entry.kind, growth);
  const elapsed = now - entry.createdAt;
  const days = Math.floor(elapsed / DAY);
  const editable = canEditMemo(entry.createdAt, now);
  const plantSize = stage === 'tree' ? 140 : stage === 'sapling' ? 120 : 100;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.top}>
        <BackLink label="기억함" onPress={close} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <HeroGradient from={e.lightColor} />
          <View style={[styles.glow, { backgroundColor: e.color }]} />
          <View style={styles.heroPlant}>
            <PlantIllustration emotion={entry.emotion} stage={stage} size={plantSize} />
          </View>
        </View>

        <View style={styles.content}>
          <AppText variant="body" color={brand.primaryInk} align="center">
            {STAGE_MESSAGE[stage]}
          </AppText>

          <Card style={styles.info}>
            <Row label="감정">
              <EmotionBadge emotionKey={entry.emotion} />
            </Row>
            <View style={styles.divider} />
            <Row label="성장 단계">
              <View style={styles.stageRow}>
                <View style={[styles.stageDot, { backgroundColor: stageDot[stage] }]} />
                <AppText variant="bodySmall">{STAGE_LABEL[entry.kind][growth]}</AppText>
              </View>
            </Row>
            <View style={styles.divider} />
            <Row label="묻은 날">
              <AppText variant="bodySmall">{formatDate(entry.createdAt)}</AppText>
            </Row>
            <View style={styles.divider} />
            <Row label="경과 일수">
              <AppText variant="bodySmall">
                {days}일 / {TOTAL_DAYS[entry.kind]}일
              </AppText>
            </Row>
          </Card>

          {editing && editable ? (
            <Card>
              <AppText variant="caption" tone="tertiary">
                그날의 메모
              </AppText>
              <MemoInput value={draft} onChangeText={setDraft} autoFocus />
              <View style={styles.row}>
                <Button label="취소" variant="secondary" style={styles.flex} onPress={() => setEditing(false)} />
                <Button label="저장" style={styles.flex} onPress={() => { updateMemo(entry.id, draft); setEditing(false); }} />
              </View>
            </Card>
          ) : entry.memo ? (
            <Card style={styles.memoCard}>
              <AppText variant="caption" tone="tertiary">
                그날의 메모
              </AppText>
              <AppText variant="bodySmall">{entry.memo}</AppText>
            </Card>
          ) : (
            <View style={styles.memoEmpty}>
              <AppText variant="bodySmall" tone="tertiary" align="center">
                메모가 없어요
              </AppText>
            </View>
          )}

          {/* 기획: 메모는 24시간 안에만 수정, 삭제는 언제든 — 메모 카드 아래 작게 */}
          {!editing ? (
            confirmDelete ? (
              <View style={styles.confirm}>
                <AppText variant="bodySmall" align="center">
                  이 기억을 지울까요? 지우면 되돌릴 수 없어요.
                </AppText>
                <View style={styles.row}>
                  <Button label="취소" variant="secondary" style={styles.flex} onPress={() => setConfirmDelete(false)} />
                  <Button label="지우기" style={styles.flex} onPress={() => { remove(entry.id); close(); }} />
                </View>
              </View>
            ) : (
              <View style={styles.actions}>
                {editable ? (
                  <Button
                    label={`메모 고치기 · ${formatDuration(MEMO_EDIT_WINDOW - elapsed)} 남음`}
                    variant="ghost"
                    onPress={() => { setDraft(entry.memo); setEditing(true); }}
                  />
                ) : null}
                <Button label="기억 지우기" variant="danger" onPress={() => setConfirmDelete(true)} />
              </View>
            )
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="bodySmall" tone="tertiary">
        {label}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: space[4], paddingBottom: space[4], paddingHorizontal: space[6] },
  scroll: { paddingBottom: space[6] },
  hero: {
    marginHorizontal: space[6],
    minHeight: size.heroMin,
    borderRadius: radius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: space[8],
  },
  heroPlant: { zIndex: 1 },
  glow: { position: 'absolute', width: size.heroGlow, height: size.heroGlow, borderRadius: radius.full, opacity: opacity.glow, bottom: -space[10] },
  content: { paddingHorizontal: space[6], paddingTop: space[6], gap: space[5] },
  info: { gap: space[4] },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: neutral.divider },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  stageDot: { width: size.stageDot, height: size.stageDot, borderRadius: radius.full },
  memoCard: { gap: space[3] },
  memoEmpty: { padding: space[5], borderRadius: radius.lg, backgroundColor: neutral.gardenSky, borderWidth: border.regular, borderStyle: 'dashed', borderColor: neutral.borderSoft },
  actions: { alignItems: 'center' },
  confirm: { gap: space[3] },
  row: { flexDirection: 'row', gap: space[3] },
  flex: { flex: 1 },
});
