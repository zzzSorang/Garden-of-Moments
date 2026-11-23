import type { EmotionKey } from '@/theme/theme';

import type { Entry } from './garden';
import type { PlantKind } from './growth';

/** 더미 데이터 id 접두사 — 이걸로 실제 기록과 구분해서 지웁니다. */
export const SEED_PREFIX = 'seed-';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** [감정, 종류, 몇 시간/일 전, 메모] — 꽃·나무의 모든 성장 단계가 나오도록 날짜를 흩어 둠 */
const ROWS: [EmotionKey, PlantKind, number, string][] = [
  ['anger', 'flower', 2 * HOUR, '회의에서 내 말이 또 끊겼다'],
  ['sadness', 'flower', 20 * HOUR, ''],
  ['anxiety', 'flower', 2 * DAY, '내일 발표가 걱정돼서 잠이 안 온다'],
  ['hurt', 'flower', 5 * DAY, '친구가 약속을 잊어버렸다'],
  ['shame', 'flower', 8 * DAY, '다 같이 있는 자리에서 실수했다'],
  ['depression', 'flower', 14 * DAY, '아무것도 하기 싫은 하루'],
  ['sadness', 'tree', 3 * DAY, '이사 가는 친구를 배웅했다'],
  ['anxiety', 'tree', 10 * DAY, '취업 준비가 끝이 안 보인다. 다른 사람들은 다 잘하고 있는 것 같고 나만 제자리인 기분이 계속 든다.'],
  ['anger', 'tree', 40 * DAY, ''],
  ['hurt', 'tree', 70 * DAY, '오래 믿었던 사람에게 실망했다'],
  ['depression', 'flower', 30 * DAY, '비 오는 날이 계속된다'],
  ['shame', 'tree', 20 * DAY, '그때 왜 그렇게 말했을까'],
];

export function makeSeedEntries(now: number): Entry[] {
  return ROWS.map(([emotion, kind, ago, memo], i) => {
    const createdAt = now - ago;
    return { id: `${SEED_PREFIX}${i}`, emotion, kind, memo, createdAt, updatedAt: createdAt };
  });
}
