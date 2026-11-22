import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Chip, Plant, Screen, ScreenHeader, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useGarden } from '@/lib/garden';
import { canEditMemo, formatDate, formatDuration, growthStage, KIND_LABEL, MEMO_EDIT_WINDOW, STAGE_LABEL, timeToNextStage } from '@/lib/growth';
import { useNow } from '@/lib/useNow';
import { emotion, space } from '@/theme/theme';

export default function MemoryDetailScreen() {
  const { session, loading } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, updateMemo, remove } = useGarden();
  const now = useNow(15_000);
  const entry = entries.find((e) => e.id === id);
  const [draft, setDraft] = useState(entry?.memo ?? '');
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!loading && !session) return <Redirect href="/login" />;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!entry) {
    return (
      <Screen>
        <ScreenHeader title="기억" left={<Button label="‹" variant="ghost" onPress={close} />} />
        <AppText tone="tertiary">이 기억을 찾을 수 없어요.</AppText>
      </Screen>
    );
  }

  const e = emotion[entry.emotion];
  const stage = growthStage(entry.kind, entry.createdAt, now);
  const next = timeToNextStage(entry.kind, entry.createdAt, now);
  const editable = canEditMemo(entry.createdAt, now);
  const editLeft = MEMO_EDIT_WINDOW - (now - entry.createdAt);

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="기억" left={<Button label="‹ 뒤로" variant="ghost" onPress={close} />} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card sunken style={styles.hero}>
          <Plant kind={entry.kind} emotionKey={entry.emotion} stage={stage} scale={2} />
        </Card>

        <Card>
          <Row label="감정">
            <Chip label={e.label} emotionKey={entry.emotion} />
          </Row>
          <Row label="성장 단계">
            <AppText variant="body">
              {KIND_LABEL[entry.kind]} · {STAGE_LABEL[entry.kind][stage]}
            </AppText>
          </Row>
          <Row label="묻은 날">
            <AppText variant="body">{formatDate(entry.createdAt)}</AppText>
          </Row>
          <Row label="지난 시간">
            <AppText variant="body">{formatDuration(now - entry.createdAt)}</AppText>
          </Row>
          {next !== null ? (
            <Row label="다음 단계까지">
              <AppText variant="body" tone="secondary">
                {formatDuration(next)}
              </AppText>
            </Row>
          ) : null}
        </Card>

        <Card>
          <View style={styles.memoHead}>
            <AppText variant="heading">메모</AppText>
            <AppText variant="caption" tone="tertiary">
              {editable ? `${formatDuration(editLeft)} 동안 고칠 수 있어요` : '24시간이 지나 고칠 수 없어요'}
            </AppText>
          </View>
          {editing && editable ? (
            <>
              <TextField value={draft} onChangeText={setDraft} multiline maxLength={500} autoFocus />
              <View style={styles.row}>
                <Button label="취소" variant="secondary" style={styles.flex} onPress={() => { setDraft(entry.memo); setEditing(false); }} />
                <Button label="저장" style={styles.flex} onPress={() => { updateMemo(entry.id, draft); setEditing(false); }} />
              </View>
            </>
          ) : (
            <>
              <AppText variant="poem" tone={entry.memo ? 'primary' : 'tertiary'}>
                {entry.memo || '메모 없음'}
              </AppText>
              {editable ? <Button label="메모 고치기" variant="secondary" onPress={() => { setDraft(entry.memo); setEditing(true); }} /> : null}
            </>
          )}
        </Card>

        {confirmDelete ? (
          <Card sunken>
            <AppText variant="body">이 기억을 지울까요? 지우면 되돌릴 수 없어요.</AppText>
            <View style={styles.row}>
              <Button label="취소" variant="secondary" style={styles.flex} onPress={() => setConfirmDelete(false)} />
              <Button label="지우기" variant="danger" style={styles.flex} onPress={() => { remove(entry.id); close(); }} />
            </View>
          </Card>
        ) : (
          <Button label="기억 지우기" variant="ghost" onPress={() => setConfirmDelete(true)} />
        )}
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
  content: { gap: space[4], paddingBottom: space[10] },
  hero: { alignItems: 'center', justifyContent: 'flex-end', minHeight: space[16] * 3, paddingBottom: space[8] },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[3] },
  memoHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space[2], flexWrap: 'wrap' },
  row: { flexDirection: 'row', gap: space[3] },
  flex: { flex: 1 },
});
