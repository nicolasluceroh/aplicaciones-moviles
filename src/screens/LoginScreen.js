import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { COLORS } from "../constants/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Datos incompletos", "Ingresá tu email y contraseña.");
      return;
    }

    // Login simulado mientras se desarrolla.
    // Nicolás reemplaza esta acción por Firebase Auth al integrar.
    navigation.navigate("FoundationPanel");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso para organizaciones</Text>

      <Text style={styles.subtitle}>
        Ingresá con la cuenta de tu organización para administrar tus datos
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="fundacion@ejemplo.org"
        placeholderTextColor={COLORS.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor={COLORS.textSecondary}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      <Text style={styles.note}>
        Acceso reservado para fundaciones registradas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0D8CE",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 18,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.text,
  },

  note: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 18,
  },
});
