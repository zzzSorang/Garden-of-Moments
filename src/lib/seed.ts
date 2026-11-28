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

/** 더미 데이터 총 개수 — 정원이 바깥 고리까지 넓어지는 걸 보려고 100개 */
export const SEED_COUNT = 100;

const EMOTIONS: EmotionKey[] = ['anger', 'sadness', 'depression', 'anxiety', 'hurt', 'shame'];
const MEMOS = [
  '',
  '별일 아닌데 계속 마음에 걸린다',
  '답장이 오지 않았다',
  '오늘따라 모든 게 버겁다',
  '괜히 예민하게 굴었다',
  '하고 싶은 말을 끝내 못 했다',
  '지하철에서 누가 밀쳤다',
  '기대했던 결과가 아니었다',
  '혼자 밥 먹는 게 유난히 외로웠다',
  '실수한 장면이 자꾸 떠오른다',
];

/** 매번 같은 결과가 나오는 간단한 난수 (더미 데이터가 넣을 때마다 바뀌지 않도록) */
function seeded(seed: number) {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

export function makeSeedEntries(now: number): Entry[] {
  const rand = seeded(42);
  const rows: [EmotionKey, PlantKind, number, string][] = [...ROWS];
  // 직접 쓴 12개 뒤로 나머지를 채움 — 꽃 위주(약 85%), 최근 120일 안에 흩어 둠
  while (rows.length < SEED_COUNT) {
    rows.push([
      EMOTIONS[Math.floor(rand() * EMOTIONS.length)],
      rand() < 0.85 ? 'flower' : 'tree',
      Math.floor(rand() * 120 * DAY),
      MEMOS[Math.floor(rand() * MEMOS.length)],
    ]);
  }
  return rows.map(([emotion, kind, ago, memo], i) => {
    const createdAt = now - ago;
    return { id: `${SEED_PREFIX}${i}`, emotion, kind, memo, createdAt, updatedAt: createdAt };
  });
}
