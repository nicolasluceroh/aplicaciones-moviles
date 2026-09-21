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

// Azul suave para la caja de acceso de organizaciones.
// Se define acá para no modificar theme.js, que es un archivo compartido.
const SOFT_BLUE = "#E8F0F7";

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

    // Autenticación simulada. Nicolás conectará Supabase Auth.
    if (isFoundation) {
      navigation.replace("FoundationPanel");
      return;
    }

    // El nombre se deriva del email hasta que Supabase devuelva el perfil real.
    const name = email.trim().split("@")[0];
    login({ name: name.charAt(0).toUpperCase() + name.slice(1), email: email.trim() });
    navigation.navigate("Account");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Recuperar contraseña",
      "La recuperación de contraseña se habilitará junto con Supabase Auth."
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        {isFoundation ? "Acceso para fundaciones" : "Bienvenido de nuevo"}
      </Text>
      <Text style={styles.subtitle}>
        {isFoundation
          ? "Ingresá con la cuenta de la organización."
          : "Ingresá para consultar tus donaciones."}
      </Text>

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

      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgot}>Olvidé mi contraseña</Text>
      </Pressable>

      <Pressable style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>Ingresar</Text>
      </Pressable>

      {!isFoundation && (
        <>
          <Text style={styles.helper}>¿Todavía no tenés cuenta?</Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
          </Pressable>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o</Text>
            <View style={styles.separatorLine} />
          </View>

          <Pressable
            style={styles.foundationBox}
            onPress={() => navigation.push("Login", { userType: "foundation" })}
          >
            <Text style={styles.foundationTitle}>Acceso para fundaciones</Text>
            <View style={styles.foundationRow}>
              <Text style={styles.foundationText}>Ingresar como organización</Text>
              <Text style={styles.foundationArrow}>›</Text>
            </View>
          </Pressable>
        </>
      )}
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

  forgot: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "right",
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  helper: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginTop: 22 },

  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: "800" },

  separator: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  separatorLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  separatorText: { fontSize: 12, color: COLORS.textSecondary, marginHorizontal: 12 },

  foundationBox: { backgroundColor: SOFT_BLUE, borderRadius: RADIUS.md, padding: 18 },
  foundationTitle: { fontSize: 15, fontWeight: "800", color: COLORS.secondary },
  foundationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  foundationText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  foundationArrow: { fontSize: 20, color: COLORS.secondary },
});
