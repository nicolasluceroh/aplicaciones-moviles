import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { supabase } from "../config/supabase";

export default function RegisterScreen({ route, navigation }) {
  const returnTo = route.params?.returnTo || "Account";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const fullName = name.trim();
    const address = email.trim().toLowerCase();
    if (!fullName || !address || !password || !confirmPassword) {
      Alert.alert("Datos incompletos", "Completá todos los campos."); return;
    }
    if (password.length < 6) { Alert.alert("Contraseña muy corta", "Usá al menos 6 caracteres."); return; }
    if (password !== confirmPassword) { Alert.alert("Las contraseñas no coinciden"); return; }
    if (!acceptedTerms) { Alert.alert("Términos pendientes", "Aceptá los términos para continuar."); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: address, password, options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      if (data.user && Array.isArray(data.user.identities) && !data.user.identities.length) {
        Alert.alert("Email ya registrado", "Iniciá sesión o recuperá tu cuenta.");
      } else if (data.session) {
        Alert.alert("Cuenta creada", "Ya podés continuar.", [
          { text: "Continuar", onPress: () => navigation.replace(returnTo) },
        ]);
      } else {
        Alert.alert("Revisá tu email", "Confirmá tu cuenta antes de ingresar.", [
          { text: "Ir al login", onPress: () => navigation.replace("Login", { userType: "donor", returnTo }) },
        ]);
      }
    } catch (error) { Alert.alert("No se pudo registrar", error.message || "Intentá nuevamente."); }
    finally { setLoading(false); }
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Crear cuenta</Text>
    <Text style={styles.subtitle}>Registrate para donar y consultar tu historial.</Text>
    <Text style={styles.label}>Nombre completo</Text>
    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre y apellido" placeholderTextColor={COLORS.textSecondary} editable={!loading} />
    <Text style={styles.label}>Email</Text>
    <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} placeholder="nombre@correo.com" placeholderTextColor={COLORS.textSecondary} editable={!loading} />
    <Text style={styles.label}>Contraseña</Text>
    <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Al menos 6 caracteres" placeholderTextColor={COLORS.textSecondary} editable={!loading} />
    <Text style={styles.label}>Confirmar contraseña</Text>
    <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Repetí la contraseña" placeholderTextColor={COLORS.textSecondary} editable={!loading} />
    <Pressable style={styles.terms} onPress={() => setAcceptedTerms(!acceptedTerms)} disabled={loading}>
      <View style={[styles.checkbox, acceptedTerms && styles.selected]}><Text>{acceptedTerms ? "✓" : " "}</Text></View>
      <Text style={styles.subtitle}>Acepto los términos y la política de privacidad.</Text>
    </Pressable>
    <Pressable style={[styles.button, loading && styles.disabled]} disabled={loading} onPress={handleRegister}>
      <Text style={styles.buttonText}>{loading ? "Creando cuenta..." : "Crear cuenta"}</Text>
    </Pressable>
    <Pressable onPress={() => navigation.navigate("Login", { userType: "donor", returnTo })}>
      <Text style={styles.link}>¿Ya tenés cuenta? Iniciar sesión</Text>
    </Pressable>
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, lineHeight: 19, color: COLORS.textSecondary, marginTop: 6, marginBottom: 15 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 12, marginBottom: 14, color: COLORS.text },
  terms: { flexDirection: "row", alignItems: "center", marginVertical: 14 },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: COLORS.border, borderRadius: 5, marginRight: 10, alignItems: "center" },
  selected: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 15, alignItems: "center" },
  buttonText: { fontSize: 16, fontWeight: "800", color: "white" },
  disabled: { opacity: 0.6 },
  link: { color: COLORS.primary, fontWeight: "700", textAlign: "center", marginTop: 20 },
});
