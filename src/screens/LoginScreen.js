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

const SOFT_BLUE = "#E8F0F7";

export default function LoginScreen({ route, navigation }) {
  const alert = useAppAlert();
  const userType = route.params?.userType || "donor";
  const returnTo = route.params?.returnTo || "Account";
  const isFoundation = userType === "foundation";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const resendConfirmation = async (cleanEmail = email.trim().toLowerCase()) => {
    if (!cleanEmail) {
      Alert.alert("Ingresá tu email", "Escribí el correo de tu cuenta para reenviar la confirmación.");
      return;
    }

    try {
      setResending(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
      });

      if (error) throw error;

      Alert.alert(
        "Email enviado",
        "Te enviamos un nuevo correo de confirmación. Abrilo y después volvé a iniciar sesión."
      );
    } catch (error) {
      Alert.alert(
        "No se pudo reenviar",
        error?.message || "Intentá nuevamente en unos minutos."
      );
    } finally {
      setResending(false);
    }
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      Alert.alert("Datos incompletos", "Ingresá email y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        const code = error.code || "";
        const message = (error.message || "").toLowerCase();

        if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
          Alert.alert(
            "Falta confirmar el email",
            "Tu cuenta existe, pero todavía tenés que confirmar el correo antes de ingresar.",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Reenviar email", onPress: () => resendConfirmation(cleanEmail) },
            ]
          );
          return;
        }

        if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
          Alert.alert(
            "No se pudo iniciar sesión",
            "El email o la contraseña no coinciden. Si recreaste la cuenta, asegurate también de haber confirmado el nuevo email."
          );
          return;
        }

        Alert.alert("No se pudo iniciar sesión", error.message || "Intentá nuevamente.");
        return;
      }

      if (isFoundation) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, foundation_id")
          .eq("id", data.user.id)
          .single();

        if (
          profileError ||
          !profile ||
          !["foundation", "admin"].includes(profile.role) ||
          (profile.role === "foundation" && !profile.foundation_id)
        ) {
          await supabase.auth.signOut();
          Alert.alert(
            "Acceso restringido",
            "Esta cuenta no está habilitada como fundación."
          );
          return;
        }

        navigation.replace("FoundationPanel");
        return;
      }

      navigation.navigate(returnTo);
    } catch (error) {
      Alert.alert("Error", error?.message || "Ocurrió un problema al iniciar sesión.");
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
        editable={!loading && !resending}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
        editable={!loading && !resending}
      />

      {!isFoundation && (
        <Pressable onPress={() => resendConfirmation()} disabled={loading || resending}>
          <Text style={styles.forgot}>
            {resending ? "Reenviando..." : "¿No confirmaste tu cuenta? Reenviar email"}
          </Text>
        </Pressable>
      )}

      <Pressable
        style={[styles.primaryButton, (loading || resending) && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading || resending}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Text>
      </Pressable>

      {!isFoundation && (
        <>
          <Text style={styles.helper}>¿Todavía no tenés cuenta?</Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register", { returnTo })}
            disabled={loading || resending}
          >
            <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
          </Pressable>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Feather name="mail" size={16} color={WEB.inkSoft} style={styles.fieldIcon} />
            <TextInput
              style={[styles.input, fieldErrors.email && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: null }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="vos@email.com"
              placeholderTextColor={WEB.inkSoft}
              editable={!loading && !resending}
            />
          </View>
          {!!fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
        </View>

          <Pressable
            style={styles.foundationBox}
            onPress={() => navigation.push("Login", { userType: "foundation" })}
            disabled={loading || resending}
          >
            <Text style={styles.foundationTitle}>Acceso para fundaciones</Text>
            <View style={styles.foundationRow}>
              <Text style={styles.foundationText}>Ingresar como organización</Text>
              <Text style={styles.foundationArrow}>›</Text>
            </View>
          </Pressable>
        )}

        <PressableScale
          style={[styles.primaryButton, (loading || resending) && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading || resending}
        >
          {loading && <ActivityIndicator size="small" color={WEB.surface} style={styles.spinner} />}
          <Text style={styles.primaryButtonText}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Text>
        </PressableScale>

        {!isFoundation && (
          <>
            <Text style={styles.helper}>¿Todavía no tenés cuenta?</Text>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Register", { returnTo })}
              disabled={loading || resending}
            >
              <Feather name="user-plus" size={16} color={WEB.sol} />
              <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
            </Pressable>

            <Pressable
              style={styles.foundationCard}
              onPress={() => navigation.push("Login", { userType: "foundation" })}
              disabled={loading || resending}
            >
              <View style={styles.foundationHeader}>
                <Feather name="map" size={18} color={WEB.monteDark} />
                <Text style={styles.foundationTitle}>¿Representás una fundación?</Text>
              </View>
              <View style={styles.foundationRow}>
                <Text style={styles.foundationText}>Ingresá con la cuenta de la organización.</Text>
                <Feather name="arrow-right" size={16} color={WEB.monteDark} />
              </View>
            </Pressable>
          </>
        )}
      </View>
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
    borderColor: WEB.border,
    padding: 24,
    shadowColor: "#1C1917",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  forgot: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "right",
    marginBottom: 20,
  },
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
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: WEB.sol,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 10,
  },
  secondaryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: "800" },
  separator: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  separatorLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  separatorText: { fontSize: 12, color: COLORS.textSecondary, marginHorizontal: 12 },
  foundationBox: { backgroundColor: SOFT_BLUE, borderRadius: RADIUS.md, padding: 18 },
  foundationTitle: { fontSize: 15, fontWeight: "800", color: COLORS.secondary },
  foundationRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  foundationText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  foundationArrow: { fontSize: 24, color: COLORS.secondary },
});
