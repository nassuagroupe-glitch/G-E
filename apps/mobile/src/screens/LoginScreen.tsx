import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../auth/AuthProvider";
import { colors, headingFont } from "../theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password, remember);
    } catch (e) {
      console.error("Sign-in failed:", e);
      setError("Connexion impossible — vérifiez l'e-mail et le mot de passe.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={[styles.brand, headingFont]}>G&amp;E</Text>
        <Text style={styles.subtitle}>Vente comptoir — Yopougon</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRemember((r) => !r)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember && <Text style={styles.checkboxMark}>✓</Text>}
          </View>
          <Text style={styles.rememberLabel}>Se souvenir de moi</Text>
        </TouchableOpacity>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          onPress={onSubmit}
          disabled={submitting || !email || !password}
        >
          {submitting ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.primaryBtnText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 28,
  },
  brand: { fontSize: 32, color: colors.text, textAlign: "center" },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: 4, marginBottom: 28 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
  },
  rememberRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkboxMark: { color: colors.bg, fontSize: 13, fontWeight: "700" },
  rememberLabel: { fontSize: 14, color: colors.text },
  error: { color: colors.accent2_700, fontSize: 13, marginBottom: 12 },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 4,
    marginTop: 4,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: colors.bg, fontSize: 15, fontWeight: "700" },
});
