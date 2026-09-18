import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function LoginScreen({ route, navigation }) {
  const userType = route.params?.userType || "donor";
  const isFoundation = userType === "foundation";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Datos incompletos", "Ingresá email y contraseña.");
      return;
    }

    // Autenticación simulada. Facundo dejará la interfaz final y Nicolás conectará Supabase Auth.
    if (isFoundation) {
      navigation.replace("FoundationPanel");
      return;
    }

    Alert.alert("Ingreso simulado", "La autenticación real se conectará con Supabase.");
    navigation.navigate("Account");
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{isFoundation ? "Acceso para fundaciones" : "Iniciar sesión"}</Text>
      <Text style={styles.subtitle}>
        {isFoundation
          ? "Ingresá con la cuenta de la organización."
          : "Ingresá para finalizar donaciones y consultar tu historial."}
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      {!isFoundation && (
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: SPACING.lg, justifyContent: "center", backgroundColor: COLORS.background },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, lineHeight: 20, color: COLORS.textSecondary, marginTop: 6, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 14, fontSize: 15, color: COLORS.text, marginBottom: 16 },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 15, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  link: { color: COLORS.secondary, fontWeight: "700", textAlign: "center", marginTop: 18 },
});
