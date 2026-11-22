import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 앱 시계 — 앱이 "지금"이라고 보는 시각.
 * 성장 단계·메모 24시간 제한·경과 시간 표시는 모두 이 now() 를 씁니다.
 * (기록 시각 createdAt 은 실제 시각 그대로 저장)
 *
 * now() = 실제 시각 + 누적 오프셋 + (배속 - 1) × (배속 켠 이후 실제 경과)
 * 개발자 메뉴(프로필 맨 아래, 개발 빌드에서만)에서 조절합니다.
 */
type ClockState = { offset: number; speed: number; speedSince: number };

const STORAGE_KEY = 'dev:clock';
let state: ClockState = { offset: 0, speed: 1, speedSince: Date.now() };
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());
const save = () => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});

export function now(): number {
  const real = Date.now();
  return real + state.offset + (state.speed - 1) * (real - state.speedSince);
}

export function getClock() {
  return { offset: now() - Date.now(), speed: state.speed };
}

export function subscribeClock(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 앱 시각을 앞으로 감기 (ms) */
export function advance(ms: number) {
  state = { ...state, offset: state.offset + ms };
  save();
  notify();
}

/** 배속 바꾸기 — 지금까지 흐른 만큼은 오프셋으로 굳혀 둡니다 */
export function setSpeed(speed: number) {
  const real = Date.now();
  state = { offset: now() - real, speed, speedSince: real };
  save();
  notify();
}

/** 원래 시각으로 */
export function resetClock() {
  state = { offset: 0, speed: 1, speedSince: Date.now() };
  save();
  notify();
}

// 앱을 다시 켜도 유지
AsyncStorage.getItem(STORAGE_KEY)
  .then((raw) => {
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<ClockState>;
    state = {
      offset: Number(saved.offset) || 0,
      speed: Number(saved.speed) || 1,
      speedSince: Number(saved.speedSince) || Date.now(),
    };
    notify();
  })
  .catch(() => {});
