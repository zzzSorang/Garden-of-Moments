import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { textStyle } from '@/theme/fonts';
import { brand, layout, neutral, radius, space } from '@/theme/theme';

import { AppText } from './AppText';

type Props = TextInputProps & { label?: string; hint?: string };

export function TextField({ label, hint, style, onFocus, onBlur, multiline, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="bodySmall" tone="secondary">
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={neutral.textDisabled}
        multiline={multiline}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, multiline && styles.multiline, focused && styles.focused, rest.editable === false && styles.readonly, style]}
      />
      {hint ? (
        <AppText variant="caption" tone="tertiary">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[2] },
  input: {
    ...textStyle('body'),
    color: neutral.textPrimary,
    minHeight: layout.minTouch + space[2],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: neutral.borderSoft,
    backgroundColor: neutral.surface,
  },
  multiline: { minHeight: space[16] * 2, paddingTop: space[3], paddingBottom: space[3], textAlignVertical: 'top' },
  focused: { borderColor: brand.primary },
  readonly: { backgroundColor: neutral.surfaceSunken },
});
