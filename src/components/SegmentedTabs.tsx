import { Pressable, StyleSheet, View } from 'react-native';

import { brand, elevation, neutral, radius, space } from '@/theme/theme';

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
            style={[styles.item, active && styles.active, active && elevation.segment]}>
            <AppText variant="bodySmall" color={active ? brand.primaryInk : neutral.textTertiary}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', gap: space[1], backgroundColor: neutral.surfaceSunken, borderRadius: radius.input, padding: space[1] },
  item: { flex: 1, paddingVertical: space[2], alignItems: 'center', justifyContent: 'center', borderRadius: radius.xs },
  active: { backgroundColor: neutral.surface },
});
