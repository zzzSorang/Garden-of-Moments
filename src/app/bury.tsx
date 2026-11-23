import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, BackLink, Button, CloseIcon, EMOTION_ORDER, Emoji, EmotionBadge, MemoInput, ProgressDots, Screen, SelectCard } from '@/components';
import { useAuth } from '@/lib/auth';
import { useGarden } from '@/lib/garden';
import { MEMO_MAX, PlantKind } from '@/lib/growth';
import { useToast } from '@/lib/toast';
import { brand, elevation, emotion, EmotionKey, makeEmotion, neutral, radius, size, space } from '@/theme/theme';

const STEPS = 3;

const SEEDS: { kind: PlantKind; emoji: string; tile: string; title: string; desc: string; stages: string[] }[] = [
  { kind: 'flower', emoji: '🌸', tile: makeEmotion.anger.lightColor, title: '꽃 씨앗', desc: '7일 동안 자라요', stages: ['씨앗', '새싹', '봉오리', '꽃'] },
  { kind: 'tree', emoji: '🌳', tile: brand.primarySoft, title: '나무 씨앗', desc: '60일 동안 자라요', stages: ['씨앗', '새싹', '묘목', '나무'] },
];

/** 감정 묻기 (Make BuryEmotionModal) — 기획 순서: 감정 → 꽃/나무 → 메모 */
export default function BuryScreen() {
  const { session, loading } = useAuth();
  const { bury } = useGarden();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<EmotionKey | null>(null);
  const [kind, setKind] = useState<PlantKind | null>(null);
  const [memo, setMemo] = useState('');

  if (!loading && !session) return <Redirect href="/login" />;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const canNext = (step === 0 && !!picked) || (step === 1 && !!kind);

  const submit = () => {
    if (!picked || !kind) return;
    bury({ emotion: picked, kind, memo });
    toast(`${emotion[picked].label} 감정을 묻었어요`);
    close();
  };

  return (
    <Screen edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.top}>
        {step > 0 ? <BackLink label="돌아가기" onPress={() => setStep(step - 1)} /> : <View />}
        <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={close} style={styles.close}>
          <CloseIcon color={neutral.decor} />
        </Pressable>
      </View>
      <View style={styles.dots}>
        <ProgressDots total={STEPS} current={step} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {step === 0 ? (
            <>
              <Title title="어떤 감정을 묻을까요?" sub="지금 느끼는 감정을 골라요" />
              <View style={styles.list}>
                {EMOTION_ORDER.map((k) => {
                  const e = makeEmotion[k];
                  return (
                    <SelectCard key={k} selected={picked === k} onPress={() => setPicked(k)} accent={e.color} selectedBg={e.lightColor}>
                      <Emoji size="xl">{e.emoji}</Emoji>
                      {/* 기획: 식물 이름은 보여주지 않음 */}
                      <AppText variant="body">{emotion[k].label}</AppText>
                    </SelectCard>
                  );
                })}
              </View>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Title title="어떤 씨앗에 담을까요?" sub="자라는 속도가 달라요" />
              <View style={styles.seeds}>
                {SEEDS.map((s) => (
                  <SelectCard key={s.kind} large selected={kind === s.kind} onPress={() => setKind(s.kind)}>
                    <View style={[styles.tile, { backgroundColor: s.tile }]}>
                      <Emoji size="xxl">{s.emoji}</Emoji>
                    </View>
                    <View style={styles.seedText}>
                      <AppText variant="body">{s.title}</AppText>
                      <AppText variant="caption" tone="tertiary">
                        {s.desc}
                      </AppText>
                      <View style={styles.stages}>
                        {s.stages.map((st, i) => (
                          <AppText key={st} variant="caption" tone="tertiary">
                            {st}
                            {i < s.stages.length - 1 ? <AppText variant="caption" color={neutral.faint}>{'  →  '}</AppText> : null}
                          </AppText>
                        ))}
                      </View>
                    </View>
                  </SelectCard>
                ))}
              </View>
            </>
          ) : null}

          {step === 2 && picked ? (
            <>
              <Title title="무슨 일이 있었나요?" sub="짧게 적어도 괜찮아요 (생략 가능)" />
              <EmotionBadge emotionKey={picked} size="lg" />
              <View style={[styles.memoCard, elevation.soft]}>
                <MemoInput value={memo} onChangeText={setMemo} placeholder="무슨 일이 있었나요?" />
                <AppText variant="caption" tone="tertiary" align="right">
                  {memo.length} / {MEMO_MAX}
                </AppText>
              </View>
              <AppText variant="caption" tone="tertiary">
                메모는 묻은 뒤 24시간 동안만 고칠 수 있어요
              </AppText>
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {step < STEPS - 1 ? (
            <Button label="다음" disabled={!canNext} onPress={() => setStep(step + 1)} />
          ) : (
            <Button label="🌱 묻기" glow onPress={submit} />
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Title({ title, sub }: { title: string; sub: string }) {
  return (
    <View style={styles.title}>
      <AppText variant="title">{title}</AppText>
      <AppText variant="bodySmall" tone="tertiary">
        {sub}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: neutral.overlay },
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: space[4], paddingBottom: space[4], paddingHorizontal: space[6] },
  close: { width: size.iconButton, height: size.iconButton, borderRadius: radius.full, backgroundColor: brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  dots: { paddingBottom: space[6] },
  body: { gap: space[6], paddingHorizontal: space[6], paddingBottom: space[6] },
  title: { gap: space[1] },
  list: { gap: space[3] },
  seeds: { gap: space[4] },
  tile: { width: size.tile, height: size.tile, borderRadius: radius.icon, alignItems: 'center', justifyContent: 'center' },
  seedText: { flex: 1, gap: space[1] },
  stages: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space[1] },
  memoCard: { backgroundColor: neutral.surface, borderRadius: radius.md, padding: space[4], gap: space[1] },
  footer: { paddingHorizontal: space[6], paddingTop: space[4], paddingBottom: space[6] },
});
