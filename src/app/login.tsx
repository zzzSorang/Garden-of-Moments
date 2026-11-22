import { Redirect } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Pingongi, Screen, TextField } from '@/components';
import { friendlyAuthError, useAuth } from '@/lib/auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { brand, space } from '@/theme/theme';

type Mode = 'signIn' | 'signUp';

export default function LoginScreen() {
  const { session } = useAuth();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (session) return <Redirect href="/" />;

  const submit = async () => {
    setError(null);
    setNotice(null);
    if (!supabase) return;
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 모두 적어주세요.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) setError(friendlyAuthError(error.message));
      } else {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) setError(friendlyAuthError(error.message));
        else if (!data.session) setNotice('메일함에서 인증 링크를 눌러주신 뒤 로그인해 주세요.');
      }
    } catch (e) {
      setError(friendlyAuthError(e instanceof Error ? e.message : ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* 로그인은 Make에 없는 화면 — Make 톤(핑옹이·초록)으로 맞춤 */}
          <View style={styles.hero}>
            <Pingongi size={96} pose="greet" />
            <AppText variant="title" color={brand.primaryInk} align="center">
              사이의 정원
            </AppText>
            <AppText variant="bodySmall" tone="tertiary" align="center">
              감정을 묻고, 천천히 피워내는 곳
            </AppText>
          </View>

          {!isSupabaseConfigured ? (
            <Card>
              <AppText variant="body">아직 서버와 연결되지 않았어요</AppText>
              <AppText variant="bodySmall" tone="secondary">
                프로젝트 폴더의 .env 파일에 Supabase 주소와 키를 넣고 앱을 다시 실행해 주세요.
              </AppText>
            </Card>
          ) : null}

          <View style={styles.form}>
            <TextField
              label="이메일"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <TextField
              label="비밀번호"
              value={password}
              onChangeText={setPassword}
              placeholder="6자 이상"
              secureTextEntry
              autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
              textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
            />
            {error ? (
              <AppText variant="bodySmall" tone="secondary">
                {error}
              </AppText>
            ) : null}
            {notice ? (
              <AppText variant="bodySmall" color={brand.primaryInk}>
                {notice}
              </AppText>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Button
              label={mode === 'signIn' ? '로그인' : '가입하기'}
              onPress={submit}
              loading={loading}
              disabled={!isSupabaseConfigured}
            />
            <Button
              label={mode === 'signIn' ? '처음이에요 · 가입하기' : '이미 계정이 있어요 · 로그인'}
              variant="secondary"
              onPress={() => {
                setMode(mode === 'signIn' ? 'signUp' : 'signIn');
                setError(null);
                setNotice(null);
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', gap: space[6], paddingVertical: space[8], paddingHorizontal: space[6] },
  hero: { gap: space[2], alignItems: 'center' },
  form: { gap: space[4] },
  actions: { gap: space[3] },
});
