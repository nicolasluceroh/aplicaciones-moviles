import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { login } from "../state/session";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Datos incompletos", "Completá todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Contraseñas diferentes", "Las contraseñas deben coincidir.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Términos pendientes", "Aceptá los términos para continuar.");
      return;
    }

    Alert.alert("Registro simulado", "El alta real se conectará con Supabase Auth.", [
      {
        text: "Continuar",
        onPress: () => {
          login({ name: name.trim(), email: email.trim() });
          navigation.navigate("Account");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Sumate a Pilar de Sonrisas</Text>
      <Text style={styles.subtitle}>Tu cuenta te permite guardar el historial.</Text>

      <Text style={styles.label}>Nombre y apellido</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre y apellido"
        placeholderTextColor={COLORS.textSecondary}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="nombre@correo.com"
        placeholderTextColor={COLORS.textSecondary}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
      />

      <Text style={styles.label}>Repetir contraseña</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Repetir contraseña"
        placeholderTextColor={COLORS.textSecondary}
      />

      <Pressable
        style={styles.termsRow}
        onPress={() => setAcceptedTerms(!acceptedTerms)}
      >
        <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
          {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.termsText}>
          Acepto los términos y la política de privacidad.
        </Text>
      </Pressable>

      <Pressable style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Crear cuenta</Text>
      </Pressable>

      <Text style={styles.helper}>¿Ya tenés cuenta?</Text>
      <Pressable onPress={() => navigation.navigate("Login", { userType: "donor" })}>
        <Text style={styles.link}>Iniciar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 40 },

  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, lineHeight: 20, color: COLORS.textSecondary, marginTop: 6, marginBottom: 24 },

  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 16,
  },

  termsRow: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 20 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  termsText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, marginLeft: 10 },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  helper: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginTop: 22 },
  link: { fontSize: 15, fontWeight: "800", color: COLORS.primary, textAlign: "center", marginTop: 6 },
});
