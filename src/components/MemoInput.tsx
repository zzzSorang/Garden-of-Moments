import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { MEMO_MAX } from '@/lib/growth';
import { textStyle } from '@/theme/fonts';
import { neutral, size } from '@/theme/theme';

/** 감정 메모 입력창 — 묻기 화면과 기억 상세에서 같이 씀 */
export function MemoInput({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      multiline
      maxLength={MEMO_MAX}
      placeholderTextColor={neutral.textDisabled}
      style={[styles.input, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: { ...textStyle('bodySmall'), color: neutral.textPrimary, minHeight: size.memoMin, textAlignVertical: 'top', padding: 0 },
});
