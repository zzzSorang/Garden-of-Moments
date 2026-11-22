import { useEffect, useState } from 'react';

/** 현재 시각 — 기본 30초마다 갱신되어 성장 단계·경과 시간이 살아 움직입니다. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
