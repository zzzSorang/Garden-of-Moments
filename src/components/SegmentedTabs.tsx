import { Pressable, StyleSheet, View } from 'react-native';

import { brand, elevation, layout, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props<T extends string> = { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void };

export function SegmentedTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.item, active && styles.active, active && elevation.card]}>
            <AppText variant="label" color={active ? brand.primaryInk : neutral.textTertiary}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', backgroundColor: neutral.surfaceSunken, borderRadius: radius.md, padding: space[1] },
  item: { flex: 1, minHeight: layout.minTouch - space[1], alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },
  active: { backgroundColor: neutral.surface },
});
