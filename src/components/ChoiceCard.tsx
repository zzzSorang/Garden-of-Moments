import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { brand, elevation, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = { title: string; description: string; selected: boolean; onPress: () => void; visual?: ReactNode };

/** 큰 선택 카드 (꽃 / 나무 고르기) */
export function ChoiceCard({ title, description, selected, onPress, visual }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.base, elevation.card, selected && styles.selected]}>
      <View style={styles.visual}>{visual}</View>
      <AppText variant="heading" color={selected ? brand.primaryInk : neutral.textPrimary} align="center">
        {title}
      </AppText>
      <AppText variant="bodySmall" tone="tertiary" align="center">
        {description}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'center',
    gap: space[2],
    padding: space[5],
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: neutral.border,
    backgroundColor: neutral.surface,
  },
  selected: { borderColor: brand.primary, backgroundColor: brand.primarySoft },
  visual: { height: space[16] + space[4], justifyContent: 'flex-end', alignItems: 'center' },
});
