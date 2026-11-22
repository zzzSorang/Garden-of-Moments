import type { GrowthStage } from '@/theme/theme';

export type PlantKind = 'flower' | 'tree';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** 기록 시각부터 각 단계에 도달하는 데 걸리는 시간 (ms) — 기획 결정값 */
export const GROWTH_THRESHOLDS: Record<PlantKind, { sprout: number; bud: number; bloom: number }> = {
  flower: { sprout: 24 * HOUR, bud: 96 * HOUR, bloom: 168 * HOUR },
  tree: { sprout: 7 * DAY, bud: 32 * DAY, bloom: 60 * DAY },
};

export const KIND_LABEL: Record<PlantKind, string> = { flower: '꽃', tree: '나무' };

export const STAGE_LABEL: Record<PlantKind, Record<GrowthStage, string>> = {
  flower: { seed: '씨앗', sprout: '새싹', bud: '봉오리', bloom: '꽃' },
  tree: { seed: '씨앗', sprout: '새싹', bud: '묘목', bloom: '나무' },
};

/** 메모를 고칠 수 있는 시간 — 기록 후 24시간 */
export const MEMO_EDIT_WINDOW = 24 * HOUR;

export function growthStage(kind: PlantKind, createdAt: number, now: number): GrowthStage {
  const t = GROWTH_THRESHOLDS[kind];
  const elapsed = now - createdAt;
  if (elapsed >= t.bloom) return 'bloom';
  if (elapsed >= t.bud) return 'bud';
  if (elapsed >= t.sprout) return 'sprout';
  return 'seed';
}

/** 다음 단계까지 남은 시간 (ms). 다 자랐으면 null */
export function timeToNextStage(kind: PlantKind, createdAt: number, now: number): number | null {
  const t = GROWTH_THRESHOLDS[kind];
  const elapsed = now - createdAt;
  for (const v of [t.sprout, t.bud, t.bloom]) if (elapsed < v) return v - elapsed;
  return null;
}

export function canEditMemo(createdAt: number, now: number) {
  return now - createdAt < MEMO_EDIT_WINDOW;
}

/** "3일 4시간 12분" 형식의 정확한 경과 시간 */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  const parts = [];
  if (d) parts.push(`${d}일`);
  if (h) parts.push(`${h}시간`);
  parts.push(`${m}분`);
  return parts.join(' ');
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 그림·점 색에 쓰는 단계 (나무의 bud/bloom 은 묘목/나무 그림) */
export type VisualStage = 'seed' | 'sprout' | 'bud' | 'bloom' | 'sapling' | 'tree';
export function visualStage(kind: PlantKind, stage: GrowthStage): VisualStage {
  if (kind === 'tree' && stage === 'bud') return 'sapling';
  if (kind === 'tree' && stage === 'bloom') return 'tree';
  return stage;
}

/** 단계별 한 줄 문구 (Make) */
export const STAGE_MESSAGE: Record<VisualStage, string> = {
  seed: '씨앗이 땅 속에서 잠들어 있어요',
  sprout: '조용히 고개를 들기 시작했어요',
  bud: '곧 피어날 준비를 하고 있어요',
  bloom: '아, 내가 이걸 이겨냈구나 🌸',
  sapling: '든든하게 뿌리를 내리고 있어요',
  tree: '긴 시간을 견뎌낸 나무가 되었어요 🌳',
};

/** 다 자라는 데 걸리는 날 (꽃 7일, 나무 60일) */
export const TOTAL_DAYS: Record<PlantKind, number> = { flower: 7, tree: 60 };
