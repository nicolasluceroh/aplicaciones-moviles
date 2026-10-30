import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { supabase } from "../config/supabase";

export default function RegisterScreen({ route, navigation }) {
  const returnTo = route.params?.returnTo || "Account";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const resendConfirmation = async (cleanEmail) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
      });

      if (error) throw error;
      Alert.alert("Email enviado", "Te enviamos un nuevo correo de confirmación.");
    } catch (error) {
      Alert.alert("No se pudo reenviar", error?.message || "Intentá nuevamente.");
    }
  };

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Datos incompletos", "Completá todos los campos.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña muy corta", "Usá al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Contraseñas diferentes", "Las contraseñas deben coincidir.");
      return;
    }
  };

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const errors = {};

    if (!cleanName) errors.name = "Ingresá tu nombre completo.";
    if (!cleanEmail) errors.email = "Ingresá tu email.";
    if (!password.trim()) errors.password = "Ingresá una contraseña.";
    else if (password.length < 6) errors.password = "Usá al menos 6 caracteres.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!acceptedTerms) {
      alert("Términos pendientes", "Aceptá los términos para continuar.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) {
        Alert.alert("No se pudo crear la cuenta", error.message);
        return;
      }

      // Con confirmación de email activada, Supabase puede devolver un usuario sin
      // identidades cuando el email ya está registrado. Lo tratamos como cuenta existente.
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        Alert.alert(
          "Ese email ya está registrado",
          "Iniciá sesión con tu contraseña. Si todavía no confirmaste el correo, podés reenviar la confirmación desde el login.",
          [
            {
              text: "Ir al login",
              onPress: () => navigation.navigate("Login", { userType: "donor", returnTo }),
            },
          ]
        );
        return;
      }

      if (data.session) {
        Alert.alert("Cuenta creada", "Tu cuenta fue creada correctamente.", [
          {
            text: "Continuar",
            onPress: () => navigation.navigate(returnTo),
          },
        ]);
        return;
      }

      Alert.alert(
        "Revisá tu email",
        "La cuenta fue creada, pero todavía no puede iniciar sesión. Confirmá el correo y después volvé a la app.",
        [
          { text: "Reenviar email", onPress: () => resendConfirmation(cleanEmail) },
          {
            text: "Ir al login",
            onPress: () => navigation.navigate("Login", { userType: "donor", returnTo }),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error?.message || "Ocurrió un problema al crear la cuenta.");
    } finally {
      setLoading(false);
    }
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
        editable={!loading}
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
        editable={!loading}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
        editable={!loading}
      />

      <Text style={styles.label}>Repetir contraseña</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Repetir contraseña"
        placeholderTextColor={COLORS.textSecondary}
        editable={!loading}
      />

      <Pressable
        style={styles.termsRow}
        onPress={() => setAcceptedTerms(!acceptedTerms)}
        disabled={loading}
      >
        <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
          {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.termsText}>
          Acepto los términos y la política de privacidad.
        </Text>
      </Pressable>

      <Pressable
        style={[styles.primaryButton, loading && styles.disabledButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Text>
      </Pressable>

      <Text style={styles.helper}>¿Ya tenés cuenta?</Text>
      <Pressable
        onPress={() => navigation.navigate("Login", { userType: "donor", returnTo })}
        disabled={loading}
      >
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
    borderWidth: 1,
    borderColor: WEB.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 14,
    fontSize: 14,
    color: WEB.ink,
    backgroundColor: WEB.surface,
  },
  termsRow: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 20 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: WEB.border,
    backgroundColor: WEB.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  termsText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, marginLeft: 10 },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: WEB.sol,
    borderRadius: 12,
    paddingVertical: 13,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  disabledButton: { opacity: 0.6 },
  helper: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginTop: 22 },
  link: { fontSize: 15, fontWeight: "800", color: COLORS.primary, textAlign: "center", marginTop: 6 },
});
