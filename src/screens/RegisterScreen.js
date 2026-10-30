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

// Misma paleta que LoginScreen.js, calcada de pilar-sonrisas-web (src/index.css).
const WEB = {
  paper: "#fafaf9",
  surface: "#ffffff",
  ink: "#1c1917",
  inkSoft: "#78716c",
  border: "#e7e5e4",
  sol: "#f46a4e",
  solDark: "#e0583b",
  danger: "#a33c32",
};

export default function RegisterScreen({ route, navigation }) {
  const alert = useAppAlert();
  const returnTo = route.params?.returnTo || "Account";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const resendConfirmation = async (cleanEmail) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
      });

      if (error) throw error;
      alert("Email enviado", "Te enviamos un nuevo correo de confirmación.");
    } catch (error) {
      alert("No se pudo reenviar", error?.message || "Intentá nuevamente.");
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
        alert("No se pudo crear la cuenta", error.message);
        return;
      }

      // Con confirmación de email activada, Supabase puede devolver un usuario sin
      // identidades cuando el email ya está registrado. Lo tratamos como cuenta existente.
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        alert(
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
        alert("Cuenta creada", "Tu cuenta fue creada correctamente.", [
          {
            text: "Continuar",
            onPress: () => navigation.navigate(returnTo),
          },
        ]);
        return;
      }

      alert(
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
      alert("Error", error?.message || "Ocurrió un problema al crear la cuenta.");
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
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Tu cuenta te permite guardar el historial.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre completo</Text>
          <View style={styles.inputWrap}>
            <Feather name="user" size={16} color={WEB.inkSoft} style={styles.fieldIcon} />
            <TextInput
              style={[styles.input, fieldErrors.name && styles.inputError]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (fieldErrors.name) setFieldErrors((e) => ({ ...e, name: null }));
              }}
              placeholder="Nombre y apellido"
              placeholderTextColor={WEB.inkSoft}
              editable={!loading}
            />
          </View>
          {!!fieldErrors.name && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}
        </View>

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
              placeholder="nombre@correo.com"
              placeholderTextColor={WEB.inkSoft}
              editable={!loading}
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
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={WEB.inkSoft}
              editable={!loading}
            />
          </View>
          {!!fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
        </View>

        <Pressable
          style={styles.termsRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          disabled={loading}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Feather name="check" size={14} color={WEB.surface} />}
          </View>
          <Text style={styles.termsText}>
            Acepto los términos y la política de privacidad.
          </Text>
        </Pressable>

        <PressableScale
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading && <ActivityIndicator size="small" color={WEB.surface} style={styles.spinner} />}
          <Text style={styles.primaryButtonText}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Text>
        </PressableScale>

        <Text style={styles.helper}>¿Ya tenés cuenta?</Text>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Login", { userType: "donor", returnTo })}
          disabled={loading}
        >
          <Feather name="log-in" size={16} color={WEB.sol} />
          <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
        </Pressable>
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
  termsRow: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 20, gap: 10 },
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
  checkboxChecked: { backgroundColor: WEB.sol, borderColor: WEB.sol },
  termsText: { flex: 1, fontSize: 13, color: WEB.inkSoft },
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
});
