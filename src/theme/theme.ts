/**
 * 사이의 정원 — 디자인 토큰 (v0.3, 2026-11-22 · Figma Make 기준, 글꼴은 v0.2 유지)
 * 이 파일이 색·글자·간격·라운드의 단일 기준입니다. 화면 값은 여기서만 바꿉니다.
 * - 감정 원색은 쓰지 않고 파스텔 단계만. 감정 색은 식물과 작은 포인트(칩·태그)에만.
 * - 감정 파스텔(100~400)은 글자색 금지. 글자는 `ink`만. 200 이상 위에는 textPrimary.
 * - 성장할수록 맑고 선명해짐: growth.seed → sprout → bud → bloom.
 * - 글꼴: Pretendard(본문) + 고운바탕(poem). 굵기는 fontWeight가 아니라 fontFamily로 표현합니다.
 * - neutral.decor 는 아이콘·장식 전용. 글자색으로 쓰지 않습니다.
 * (감정 팔레트는 v0.2 그대로 유지)
 */
export type EmotionKey = 'anger' | 'sadness' | 'depression' | 'anxiety' | 'hurt' | 'shame';
export type GrowthStage = 'seed' | 'sprout' | 'bud' | 'bloom';
type EmotionScale = { label: string; plant: string; 50: string; 100: string; 200: string; 300: string; 400: string; ink: string; growth: Record<GrowthStage, string>; };
export const emotion: Record<EmotionKey, EmotionScale> = {
  anger: { label: '분노', plant: '장미', 50: '#FFF4F4', 100: '#FEE8E8', 200: '#FED6D6', 300: '#FFBEBE', 400: '#FF9FA2', ink: '#A35055', growth: { seed: '#E7C8C8', sprout: '#F7C6C7', bud: '#FFBEBE', bloom: '#FF9FA2' } },
  sadness: { label: '슬픔', plant: '수레국화', 50: '#F1F8FF', 100: '#E3F0FE', 200: '#CBE4FF', 300: '#AED5FF', 400: '#89C3FF', ink: '#326EA7', growth: { seed: '#C0D3E8', sprout: '#BAD8F8', bud: '#AED5FF', bloom: '#89C3FF' } },
  depression: { label: '우울', plant: '라벤더', 50: '#F5F7FA', 100: '#EBEFF6', 200: '#DBE2ED', 300: '#C7D2E3', 400: '#B1BED6', ink: '#5F6B7F', growth: { seed: '#CDD1D9', sprout: '#CED5E0', bud: '#C7D2E3', bloom: '#B1BED6' } },
  anxiety: { label: '불안', plant: '아네모네', 50: '#F7F5FE', 100: '#F0EBFE', 200: '#E5DBFE', 300: '#D7C6FF', 400: '#C7AEFE', ink: '#755EA4', growth: { seed: '#D3CDE6', sprout: '#D8CDF4', bud: '#D7C6FF', bloom: '#C7AEFE' } },
  hurt: { label: '상처', plant: '금잔화', 50: '#FEF5EB', 100: '#FCECD8', 200: '#F9DCBA', 300: '#F4C893', 400: '#ECB166', ink: '#92600B', growth: { seed: '#E0CEB9', sprout: '#EBCFAD', bud: '#F4C893', bloom: '#ECB166' } },
  shame: { label: '창피', plant: '작약', 50: '#FEF4F8', 100: '#FDE8F1', 200: '#FBD6E6', 300: '#F7BFD8', 400: '#F09FC5', ink: '#A44D78', growth: { seed: '#E3CCD6', sprout: '#F2C7DA', bud: '#F7BFD8', bloom: '#F09FC5' } },
};
export const neutral = { bg: '#FAFCF8', surface: '#FFFFFF', surfaceSunken: '#EEF5F0', border: '#F0F5F1', borderSoft: '#D4E8DA', borderStrong: '#748F7B', textPrimary: '#2C3E2D', textSecondary: '#4A6A52', textTertiary: '#557A5D', textDisabled: '#B8CEC0', decor: '#7A9E82' } as const;
export const brand = { primary: '#2D6A4F', primaryPressed: '#245A42', primarySoft: '#EEF5F0', primaryMuted: '#95C4A8', primaryDisabled: '#C8DDD0', primaryInk: '#2D6A4F', onPrimary: '#FFFFFF' } as const;
export const font = { sans: { regular: 'Pretendard-Regular', medium: 'Pretendard-Medium', semibold: 'Pretendard-SemiBold', bold: 'Pretendard-Bold' }, serif: { regular: 'GowunBatang-Regular', bold: 'GowunBatang-Bold' } } as const;
export const type = {
  display: { fontFamily: font.sans.bold, fontSize: 28, lineHeight: 38, letterSpacing: -0.4 },
  title: { fontFamily: font.sans.semibold, fontSize: 22, lineHeight: 30, letterSpacing: -0.3 },
  heading: { fontFamily: font.sans.semibold, fontSize: 18, lineHeight: 26, letterSpacing: -0.2 },
  body: { fontFamily: font.sans.regular, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  bodyStrong: { fontFamily: font.sans.semibold, fontSize: 16, lineHeight: 24, letterSpacing: 0 }, // 버튼
  bodySmall: { fontFamily: font.sans.regular, fontSize: 14, lineHeight: 22, letterSpacing: 0 },
  label: { fontFamily: font.sans.medium, fontSize: 14, lineHeight: 20, letterSpacing: 0 }, // 칩
  caption: { fontFamily: font.sans.regular, fontSize: 12, lineHeight: 18, letterSpacing: 0.1 },
  tab: { fontFamily: font.sans.medium, fontSize: 11, lineHeight: 14, letterSpacing: 0 },
  poem: { fontFamily: font.serif.regular, fontSize: 18, lineHeight: 30, letterSpacing: -0.1 }, // 감성 멘트·핑옹이 대사
} as const;
export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 } as const;
export const layout = { screenGutter: space[5], minTouch: 44 } as const;
export const radius = { sm: 10, md: 16, lg: 20, xl: 24, full: 999 } as const;
export const elevation = {
  float: { shadowColor: '#2D6A4F', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  card: { shadowColor: '#2D6A4F', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
} as const;
export const theme = { emotion, neutral, brand, font, type, space, layout, radius, elevation } as const;
export type Theme = typeof theme;
export default theme;
