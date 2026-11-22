import { Pressable, StyleSheet } from 'react-native';

import { brand, emotion, EmotionKey, layout, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  /** 감정 칩이면 감정 키를 넘기면 파스텔 배경 + ink 글자로 보입니다. */
  emotionKey?: EmotionKey;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, emotionKey, selected, onPress }: Props) {
  const e = emotionKey ? emotion[emotionKey] : null;
  const bg = e ? (selected ? e[300] : e[100]) : selected ? brand.primarySoft : neutral.surface;
  const border = e ? e[300] : selected ? brand.primary : neutral.border;
  const text = selected && e ? neutral.textPrimary : e ? e.ink : selected ? brand.primaryInk : neutral.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.base, { backgroundColor: bg, borderColor: border }]}>
      <AppText variant="label" color={text}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.minTouch - space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
