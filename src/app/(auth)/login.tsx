import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { InputField, PasswordField, PrimaryButton, SecondaryButton } from '@/components';
import { useAuthStore } from '@/store/auth.store';
import { mockLogin } from '@/mocks/auth.mock';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAuth = useAuthStore(s => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = 'E-mail é obrigatório';
    else if (!email.includes('@')) e.email = 'E-mail inválido';
    if (!password) e.password = 'Senha é obrigatória';
    else if (password.length < 6) e.password = 'Mínimo de 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await mockLogin(email, password);
      setAuth(res.user, res.token);
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      Alert.alert('Erro', err.message ?? 'Não foi possível fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + Spacing[8], paddingBottom: insets.bottom + Spacing[8] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>
            Io<Text style={styles.accent}>Pet</Text>
          </Text>
          <Text style={styles.title}>Bem-vindo de volta! 👋</Text>
          <Text style={styles.subtitle}>Entre para continuar</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="E-mail"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />

          <PasswordField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <PrimaryButton
            label="Entrar"
            onPress={handleLogin}
            loading={loading}
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>ou</Text>
            <View style={styles.line} />
          </View>

          <SecondaryButton
            label="Cadastrar nova conta"
            onPress={() => router.push('/(auth)/register' as any)}
          />
        </View>

        {/* Footer */}
        <Text style={styles.terms}>
          Ao continuar, você concorda com os{' '}
          <Text style={styles.link}>Termos de Uso</Text>
          {' '}e{' '}
          <Text style={styles.link}>Política de Privacidade</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background.primary },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    gap: Spacing[8],
  },
  header: {
    alignItems: 'center',
    gap: Spacing[2],
  },
  appName: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['2xl'],
    color: Colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: Spacing[4],
  },
  accent: { color: Colors.primary.default },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text.primary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
  form: { gap: Spacing[5] },
  forgotBtn: { alignSelf: 'flex-start', marginTop: -Spacing[2] },
  forgotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary.light,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  line: { flex: 1, height: 1, backgroundColor: Colors.border.default },
  orText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  terms: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.6,
  },
  link: { color: Colors.primary.light },
});
