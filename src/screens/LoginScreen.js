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
import { Feather } from "@expo/vector-icons";
import { supabase } from "../config/supabase";
import PressableScale from "../components/PressableScale";
import { useAppAlert } from "../components/AppAlert";

// Paleta y tipografía de pilar-sonrisas-web (src/index.css), usada SOLO en
// esta pantalla y en RegisterScreen.js para que login/registro queden
// calcados a la web — el resto de la app sigue con constants/theme.js.
const WEB = {
  paper: "#fafaf9",
  surface: "#ffffff",
  ink: "#1c1917",
  inkSoft: "#78716c",
  border: "#e7e5e4",
  sol: "#f46a4e",
  solDark: "#e0583b",
  monteSoft: "#f0fdfa",
  monteDark: "#0b7b70",
  danger: "#a33c32",
  dangerSoft: "#f0dcd9",
};

export default function LoginScreen({ route, navigation }) {
  const alert = useAppAlert();
  const userType = route.params?.userType || "donor";
  const returnTo = route.params?.returnTo || "Account";
  const isFoundation = userType === "foundation";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const resendConfirmation = async (cleanEmail = email.trim().toLowerCase()) => {
    if (!cleanEmail) {
      alert("Ingresá tu email", "Escribí el correo de tu cuenta para reenviar la confirmación.");
      return;
    }

    try {
      setResending(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
      });

      if (error) throw error;

      alert(
        "Email enviado",
        "Te enviamos un nuevo correo de confirmación. Abrilo y después volvé a iniciar sesión."
      );
    } catch (error) {
      alert(
        "No se pudo reenviar",
        error?.message || "Intentá nuevamente en unos minutos."
      );
    } finally {
      setResending(false);
    }
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const errors = {};

    if (!cleanEmail) errors.email = "Ingresá tu email.";
    if (!password.trim()) errors.password = "Ingresá tu contraseña.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
          alert(
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
          alert(
            "No se pudo iniciar sesión",
            "El email o la contraseña no coinciden. Si recreaste la cuenta, asegurate también de haber confirmado el nuevo email."
          );
          return;
        }

        alert("No se pudo iniciar sesión", error.message || "Intentá nuevamente.");
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
          alert(
            "Acceso restringido",
            "Esta cuenta no está habilitada como fundación."
          );
          return;
        }

        // reset (no replace): limpia toda la pila, incluido el login de
        // donante que haya quedado atrás, para que "volver" no tenga a
        // dónde ir y no muestre un back button que no tiene sentido acá.
        navigation.reset({ index: 0, routes: [{ name: "FoundationPanel" }] });
        return;
      }

      navigation.navigate(returnTo);
    } catch (error) {
      alert("Error", error?.message || "Ocurrió un problema al iniciar sesión.");
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
      <View style={styles.card}>
        <Text style={styles.title}>
          {isFoundation ? "Acceso para fundaciones" : "Tu cuenta"}
        </Text>
        <Text style={styles.subtitle}>
          {isFoundation
            ? "Ingresá con la cuenta de la organización."
            : "Iniciá sesión o creá una cuenta para donar y seguir tu historial."}
        </Text>

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

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrap}>
            <Feather name="lock" size={16} color={WEB.inkSoft} style={styles.fieldIcon} />
            <TextInput
              style={[styles.input, fieldErrors.password && styles.inputError]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: null }));
              }}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={WEB.inkSoft}
              editable={!loading && !resending}
            />
          </View>
          {!!fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
        </View>

        {!isFoundation && (
          <Pressable onPress={() => resendConfirmation()} disabled={loading || resending}>
            <Text style={styles.forgot}>
              {resending ? "Reenviando..." : "¿No confirmaste tu cuenta? Reenviar email"}
            </Text>
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
  screen: { flex: 1, backgroundColor: WEB.paper },
  content: { padding: 24, paddingBottom: 48 },
  card: {
    backgroundColor: WEB.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: WEB.border,
    padding: 24,
    shadowColor: "#1C1917",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: "600", color: WEB.ink },
  subtitle: { fontSize: 14, color: WEB.inkSoft, marginTop: 4, marginBottom: 20 },
  field: { gap: 6, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: WEB.ink },
  inputWrap: { position: "relative", justifyContent: "center" },
  inputError: { borderColor: WEB.danger },
  fieldError: { fontSize: 12, color: WEB.danger, marginTop: 5 },
  fieldIcon: { position: "absolute", left: 14, zIndex: 1 },
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
  forgot: { fontSize: 13, fontWeight: "500", color: WEB.sol, textAlign: "right", marginBottom: 20 },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: WEB.sol,
    borderRadius: 12,
    paddingVertical: 13,
  },
  spinner: { marginRight: 2 },
  primaryButtonText: { fontSize: 14, fontWeight: "500", color: WEB.surface },
  disabledButton: { opacity: 0.6 },
  helper: { fontSize: 13, color: WEB.inkSoft, textAlign: "center", marginTop: 22 },
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
  secondaryButtonText: { fontSize: 14, fontWeight: "500", color: WEB.solDark },
  foundationCard: {
    marginTop: 24,
    backgroundColor: WEB.monteSoft,
    borderRadius: 20,
    padding: 20,
  },
  foundationHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  foundationTitle: { fontSize: 14, fontWeight: "600", color: WEB.monteDark },
  foundationRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  foundationText: { flex: 1, fontSize: 14, color: WEB.inkSoft },
});
