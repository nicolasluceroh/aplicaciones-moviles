import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPE } from "../constants/theme";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

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
      <View style={styles.root}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis datos</Text>
        <Text style={styles.subtitle}>Necesitás iniciar sesión para ver tu perfil.</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.replace("Login", { userType: "donor", returnTo: "Profile" })}
        >
          <Feather name="log-in" size={15} color={COLORS.surface} />
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </Pressable>
      </ScrollView>
      <BottomNav navigation={navigation} active="Account" />
      </View>
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
    <View style={styles.root}>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Mis datos</Text>
      <Text style={styles.subtitle}>Actualizá la información asociada a tu cuenta.</Text>

      {profileLoading && <ActivityIndicator color={COLORS.primary} style={styles.loader} />}

      <Text style={styles.label}>Nombre y apellido</Text>
      <View style={styles.inputWrap}>
        <Feather name="user" size={16} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nombre y apellido"
          placeholderTextColor={COLORS.textSecondary}
          editable={!saving}
        />
      </View>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputWrap}>
        <Feather name="mail" size={16} color={COLORS.textSecondary} style={styles.inputIcon} />
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
      </View>
      <Text style={styles.helpText}>
        Si cambiás el email, Supabase te pedirá confirmar la nueva dirección.
      </Text>

      <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
      <Text style={styles.helpText}>Dejalo vacío si no querés modificarla.</Text>

      <Text style={styles.label}>Nueva contraseña</Text>
      <View style={styles.inputWrap}>
        <Feather name="lock" size={16} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor={COLORS.textSecondary}
          editable={!saving}
        />
      </View>

      <Text style={styles.label}>Repetir nueva contraseña</Text>
      <View style={styles.inputWrap}>
        <Feather name="lock" size={16} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Repetir contraseña"
          placeholderTextColor={COLORS.textSecondary}
          editable={!saving}
        />
      </View>

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
    <BottomNav navigation={navigation} active="Account" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 40 },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text },
  subtitle: {
    ...TYPE.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  loader: { marginBottom: 16 },
  label: { ...TYPE.caption, fontSize: 12, color: COLORS.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 13,
    ...TYPE.body,
    fontSize: 14,
    color: COLORS.text,
  },
  helpText: {
    ...TYPE.caption,
    fontSize: 11,
    fontWeight: "400",
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  sectionTitle: {
    ...TYPE.h2,
    fontSize: 15,
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 6,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    marginTop: 10,
  },
  primaryButtonText: { ...TYPE.button, fontSize: 14, color: COLORS.surface },
  disabledButton: { opacity: 0.6 },
});
