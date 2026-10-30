import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, profile, profileLoading, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || user?.user_metadata?.full_name || "");
    setEmail(user?.email || "");
  }, [profile?.full_name, user?.email, user?.user_metadata?.full_name]);

  if (!user) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis datos</Text>
        <Text style={styles.subtitle}>Necesitás iniciar sesión para ver tu perfil.</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.replace("Login", { userType: "donor", returnTo: "Profile" })}
        >
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const handleSave = async () => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      Alert.alert("Datos incompletos", "Completá nombre y email.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      Alert.alert("Contraseña muy corta", "Usá al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Contraseñas diferentes", "Las contraseñas deben coincidir.");
      return;
    }

    try {
      setSaving(true);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: cleanName })
        .eq("id", user.id);

      if (profileError) throw profileError;

      const authUpdates = {
        data: { full_name: cleanName },
      };

      if (cleanEmail !== user.email?.toLowerCase()) {
        authUpdates.email = cleanEmail;
      }

      if (newPassword) {
        authUpdates.password = newPassword;
      }

      const { error: authError } = await supabase.auth.updateUser(authUpdates);
      if (authError) throw authError;

      await refreshProfile();
      setNewPassword("");
      setConfirmPassword("");

      if (cleanEmail !== user.email?.toLowerCase()) {
        Alert.alert(
          "Datos actualizados",
          "Guardamos tus cambios. Revisá tu correo para confirmar el nuevo email antes de usarlo para ingresar."
        );
      } else {
        Alert.alert("Datos actualizados", "Tus datos se guardaron correctamente.");
      }
    } catch (error) {
      Alert.alert(
        "No se pudieron guardar los cambios",
        error?.message || "Intentá nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Mis datos</Text>
      <Text style={styles.subtitle}>Actualizá la información asociada a tu cuenta.</Text>

      {profileLoading && <ActivityIndicator color={COLORS.primary} style={styles.loader} />}

      <Text style={styles.label}>Nombre y apellido</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nombre y apellido"
        placeholderTextColor={COLORS.textSecondary}
        editable={!saving}
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
        editable={!saving}
      />
      <Text style={styles.helpText}>
        Si cambiás el email, Supabase te pedirá confirmar la nueva dirección.
      </Text>

      <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
      <Text style={styles.helpText}>Dejalo vacío si no querés modificarla.</Text>

      <Text style={styles.label}>Nueva contraseña</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor={COLORS.textSecondary}
        editable={!saving}
      />

      <Text style={styles.label}>Repetir nueva contraseña</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Repetir contraseña"
        placeholderTextColor={COLORS.textSecondary}
        editable={!saving}
      />

      <Pressable
        style={[styles.primaryButton, saving && styles.disabledButton]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.primaryButtonText}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  loader: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 10,
  },
  helpText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  disabledButton: { opacity: 0.6 },
});
