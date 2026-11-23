import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { EmotionKey } from '@/theme/theme';

import { useAuth } from './auth';
import { now as appNow } from './clock';
import { canEditMemo, PlantKind } from './growth';
import { makeSeedEntries, SEED_PREFIX } from './seed';

/** 묻은 감정 하나 */
export type Entry = {
  id: string;
  emotion: EmotionKey;
  kind: PlantKind;
  memo: string;
  createdAt: number; // ms
  updatedAt: number;
};

type GardenState = {
  entries: Entry[];
  ready: boolean;
  bury: (input: { emotion: EmotionKey; kind: PlantKind; memo: string }) => Entry;
  updateMemo: (id: string, memo: string) => boolean;
  remove: (id: string) => void;
  /** 개발용: 더미 데이터 넣기 / 비우기 (실제 기록은 그대로) */
  addSeed: () => void;
  clearSeed: () => void;
};

const GardenContext = createContext<GardenState | null>(null);

/**
 * 지금은 기기 안(AsyncStorage)에만 저장합니다.
 * TODO(Supabase): Emotion 테이블 연결 자리
 *   - bury → supabase.from('emotions').insert(...)
 *   - updateMemo → update (24시간 제한은 DB 정책에서도 한 번 더 막기)
 *   - remove → delete
 *   - 첫 로드 → select ... order by created_at desc
 */
export function GardenProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const storageKey = `garden:entries:${session?.user.id ?? 'local'}`;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const ready = loadedKey === storageKey;

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(storageKey)
      .then((raw) => alive && setEntries(raw ? (JSON.parse(raw) as Entry[]) : []))
      .catch(() => alive && setEntries([]))
      .finally(() => alive && setLoadedKey(storageKey));
    return () => {
      alive = false;
    };
  }, [storageKey]);

  const persist = useCallback(
    (next: Entry[]) => {
      setEntries(next);
      AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch(() => {});
    },
    [storageKey]
  );

  const value = useMemo<GardenState>(
    () => ({
      entries,
      ready,
      bury: ({ emotion, kind, memo }) => {
        const now = Date.now(); // 기록 시각은 실제 시각 그대로
        const entry: Entry = {
          id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
          emotion,
          kind,
          memo: memo.trim(),
          createdAt: now,
          updatedAt: now,
        };
        persist([entry, ...entries]);
        return entry;
      },
      updateMemo: (id, memo) => {
        const target = entries.find((e) => e.id === id);
        if (!target || !canEditMemo(target.createdAt, appNow())) return false;
        persist(entries.map((e) => (e.id === id ? { ...e, memo: memo.trim(), updatedAt: Date.now() } : e)));
        return true;
      },
      remove: (id) => persist(entries.filter((e) => e.id !== id)),
      addSeed: () => {
        const real = entries.filter((e) => !e.id.startsWith(SEED_PREFIX));
        persist([...real, ...makeSeedEntries(appNow())].sort((a, b) => b.createdAt - a.createdAt));
      },
      clearSeed: () => persist(entries.filter((e) => !e.id.startsWith(SEED_PREFIX))),
    }),
    [entries, ready, persist]
  );

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
}

export function useGarden() {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error('useGarden must be used inside GardenProvider');
  return ctx;
}
