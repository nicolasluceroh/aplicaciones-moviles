import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Datos incompletos", "Completá todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Contraseñas diferentes", "Las contraseñas deben coincidir.");
      return;
    }

    Alert.alert("Registro simulado", "El alta real se conectará con Supabase Auth.", [
      { text: "Continuar", onPress: () => navigation.navigate("Account") },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>La cuenta de donante permitirá guardar y consultar las donaciones realizadas.</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre y apellido" placeholderTextColor={COLORS.textSecondary} />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="nombre@correo.com" placeholderTextColor={COLORS.textSecondary} />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Contraseña" placeholderTextColor={COLORS.textSecondary} />
      <Text style={styles.label}>Repetir contraseña</Text>
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Repetir contraseña" placeholderTextColor={COLORS.textSecondary} />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
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
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 14, fontSize: 15, color: COLORS.text, marginBottom: 16 },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 15, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
