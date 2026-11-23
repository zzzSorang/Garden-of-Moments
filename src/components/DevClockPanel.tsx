import { StyleSheet, View } from 'react-native';

import { advance, getClock, resetClock, setSpeed } from '@/lib/clock';
import { formatDate, formatDuration } from '@/lib/growth';
import { useNow } from '@/lib/useNow';
import { border, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';
import { Button } from './Button';
import { Chip } from './Chip';

const HOUR = 3_600_000;
const JUMPS = [
  { label: '+1시간', ms: HOUR },
  { label: '+24시간', ms: 24 * HOUR },
  { label: '+7일', ms: 7 * 24 * HOUR },
  { label: '+30일', ms: 30 * 24 * HOUR },
];
const SPEEDS = [1, 60, 1440];

/** 개발자 메뉴 — 성장 테스트용 시간 조절. 개발 빌드(__DEV__)에서만 화면에 나옵니다. */
export function DevClockPanel() {
  'use no memo'; // 시계 값을 매번 새로 읽도록 자동 최적화 끔
  const now = useNow(1000);
  const { offset, speed } = getClock();

  return (
    <View style={styles.wrap}>
      <AppText variant="bodyStrong">개발자 메뉴 · 시간 조절</AppText>
      <View>
        <AppText variant="bodySmall" tone="secondary">
          앱 시각 {formatDate(now)}
        </AppText>
        <AppText variant="caption" tone="tertiary">
          {offset > 1000 ? `실제보다 ${formatDuration(offset)} 앞서 있어요` : '실제 시각과 같아요'}
        </AppText>
      </View>
      <View style={styles.row}>
        {JUMPS.map((j) => (
          <Chip key={j.label} label={j.label} onPress={() => advance(j.ms)} />
        ))}
      </View>
      <View style={styles.row}>
        <AppText variant="caption" tone="tertiary">
          배속
        </AppText>
        {SPEEDS.map((s) => (
          <Chip key={s} label={`${s}x`} selected={speed === s} onPress={() => setSpeed(s)} />
        ))}
      </View>
      <Button label="원래 시각으로" variant="secondary" onPress={resetClock} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space[3],
    padding: space[4],
    borderRadius: radius.lg,
    borderWidth: border.thin,
    borderStyle: 'dashed',
    borderColor: neutral.borderStrong,
    backgroundColor: neutral.surfaceSunken,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[2] },
});
