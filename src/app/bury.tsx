import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Button, ChoiceCard, EmotionGrid, Plant, ProgressDots, Screen, TextField } from '@/components';
import { useAuth } from '@/lib/auth';
import { useGarden } from '@/lib/garden';
import { PlantKind } from '@/lib/growth';
import { useToast } from '@/lib/toast';
import { emotion, EmotionKey, space } from '@/theme/theme';

const STEPS = 3;

/** 감정 묻기: 감정 → 꽃/나무 → 메모 (식물 이름은 보여주지 않음) */
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
  const back = () => (step === 0 ? close() : setStep(step - 1));
  const canNext = (step === 0 && picked) || (step === 1 && kind) || step === 2;

  const submit = () => {
    if (!picked || !kind) return;
    bury({ emotion: picked, kind, memo });
    toast(`${emotion[picked].label} 감정을 묻었어요`);
    close();
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Button label={step === 0 ? '닫기' : '이전'} variant="ghost" onPress={back} style={styles.navBtn} />
        <ProgressDots total={STEPS} current={step} />
        <View style={styles.navBtn} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {step === 0 ? (
            <>
              <Title title="지금 어떤 감정인가요?" sub="하나만 골라주세요" />
              <EmotionGrid value={picked} onChange={setPicked} />
            </>
          ) : null}

          {step === 1 && picked ? (
            <>
              <Title title="어떻게 키워볼까요?" sub="꽃은 일주일, 나무는 두 달에 걸쳐 자라요" />
              <View style={styles.choices}>
                <ChoiceCard
                  title="꽃"
                  description={'금방 피어나요\n7일'}
                  selected={kind === 'flower'}
                  onPress={() => setKind('flower')}
                  visual={<Plant kind="flower" emotionKey={picked} stage="bloom" scale={1.3} />}
                />
                <ChoiceCard
                  title="나무"
                  description={'천천히 자라요\n60일'}
                  selected={kind === 'tree'}
                  onPress={() => setKind('tree')}
                  visual={<Plant kind="tree" emotionKey={picked} stage="bloom" />}
                />
              </View>
            </>
          ) : null}

          {step === 2 && picked ? (
            <>
              <Title title="마음을 조금 적어볼까요?" sub="비워둬도 괜찮아요" />
              <TextField
                value={memo}
                onChangeText={setMemo}
                placeholder="무슨 일이 있었나요?"
                multiline
                maxLength={500}
                hint="메모는 묻은 뒤 24시간 동안만 고칠 수 있어요"
              />
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {step < STEPS - 1 ? (
            <Button label="다음" disabled={!canNext} onPress={() => setStep(step + 1)} />
          ) : (
            <Button label="묻기" onPress={submit} />
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
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space[2] },
  navBtn: { minWidth: space[16], paddingHorizontal: space[2] },
  body: { gap: space[6], paddingTop: space[6], paddingBottom: space[6] },
  title: { gap: space[1] },
  choices: { flexDirection: 'row', gap: space[3] },
  footer: { paddingVertical: space[4] },
});
