import { useEffect, useState } from 'react';

import { getClock, now, subscribeClock } from './clock';

/**
 * 앱 시계 기준 현재 시각.
 * 시계를 조절하면 바로, 평소엔 intervalMs 마다(배속 중이면 1초마다) 다시 계산됩니다.
 */
export function useNow(intervalMs = 30_000) {
  const [value, setValue] = useState(now);
  const [speed, setSpeedState] = useState(() => getClock().speed);

  useEffect(() => {
    return subscribeClock(() => {
      setValue(now());
      setSpeedState(getClock().speed);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setValue(now()), speed > 1 ? 1000 : intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, speed]);

  return value;
}
