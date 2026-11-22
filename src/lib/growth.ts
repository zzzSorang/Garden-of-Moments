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
  tree: { seed: '씨앗', sprout: '새싹', bud: '어린 나무', bloom: '나무' },
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
