import type { EmotionKey, GrowthStage } from '@/theme/theme';

import type { Entry } from './garden';
import { DAY, GROWTH_THRESHOLDS, PlantKind } from './growth';

/** 알림 한 건 — 식물이 다음 단계로 자란 순간 */
export type GardenNotice = {
  id: string;
  entryId: string;
  emotion: EmotionKey;
  kind: PlantKind;
  stage: Exclude<GrowthStage, 'seed'>;
  at: number;
  memo: string;
};

/** 단계별 문구 (나무는 봉오리 대신 묘목, 꽃 대신 나무) */
export const NOTICE_TEXT: Record<PlantKind, Record<GardenNotice['stage'], string>> = {
  flower: { sprout: '새싹이 돋았어요', bud: '봉오리가 맺혔어요', bloom: '꽃이 피었어요' },
  tree: { sprout: '새싹이 돋았어요', bud: '묘목으로 자랐어요', bloom: '나무가 되었어요' },
};

/** 이 시간 안의 알림은 '새 알림'으로 점을 찍어요 */
export const NEW_WINDOW = DAY;
/** 너무 오래된 알림은 보여주지 않아요 */
const KEEP = 30 * DAY;

/** 기록의 성장 시각으로 알림 목록 만들기 (최신순). 따로 저장하지 않고 매번 계산해요 */
export function buildNotices(entries: Entry[], now: number): GardenNotice[] {
  const out: GardenNotice[] = [];
  for (const e of entries) {
    const t = GROWTH_THRESHOLDS[e.kind];
    for (const stage of ['sprout', 'bud', 'bloom'] as const) {
      const at = e.createdAt + t[stage];
      if (at <= now && now - at <= KEEP) {
        out.push({ id: `${e.id}:${stage}`, entryId: e.id, emotion: e.emotion, kind: e.kind, stage, at, memo: e.memo });
      }
    }
  }
  return out.sort((a, b) => b.at - a.at);
}

export function hasNewNotice(entries: Entry[], now: number) {
  return buildNotices(entries, now).some((n) => now - n.at < NEW_WINDOW);
}

/** "방금 전", "12분 전", "3시간 전", "2일 전" */
export function formatAgo(ts: number, now: number): string {
  const min = Math.floor((now - ts) / 60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

/** 오늘 / 이번 주 / 지난 알림 묶음 */
export function groupNotices(list: GardenNotice[], now: number) {
  const groups: { title: string; items: GardenNotice[] }[] = [
    { title: '오늘', items: [] },
    { title: '이번 주', items: [] },
    { title: '지난 알림', items: [] },
  ];
  for (const n of list) groups[now - n.at < DAY ? 0 : now - n.at < 7 * DAY ? 1 : 2].items.push(n);
  return groups.filter((g) => g.items.length > 0);
}
