import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { supabase } from "../config/supabase";

export default function LoginScreen({ route, navigation }) {
  const userType = route.params?.userType || "donor";
  const returnTo = route.params?.returnTo || "Account";
  const isFoundation = userType === "foundation";
  const isMerchant = userType === "merchant";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const resendConfirmation = async (address = email.trim().toLowerCase()) => {
    if (!address) {
      Alert.alert("Ingresá tu email", "Escribí el correo para reenviar la confirmación.");
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email: address });
      if (error) throw error;
      Alert.alert("Email enviado", "Confirmá tu correo y después volvé a iniciar sesión.");
    } catch (error) {
      Alert.alert("No se pudo reenviar", error.message || "Intentá nuevamente.");
    } finally {
      setResending(false);
    }
  };

  const login = async () => {
    const address = email.trim().toLowerCase();
    if (!address || !password) {
      Alert.alert("Datos incompletos", "Ingresá tu email y contraseña.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: address, password });
      if (error) {
        const message = (error.message || "").toLowerCase();
        if (error.code === "email_not_confirmed" || message.includes("email not confirmed")) {
          Alert.alert("Email sin confirmar", "Confirmá tu correo para continuar.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Reenviar email", onPress: () => resendConfirmation(address) },
          ]);
          return;
        }
        throw error;
      }

      // El rol se consulta desde Supabase (no desde un parámetro de la pantalla).
      if (isFoundation || isMerchant) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles").select("role, foundation_id")
          .eq("id", data.user.id).single();
        const allowed = !profileError && profile && (
          isMerchant ? profile.role === "merchant" :
            (profile.role === "admin" || (profile.role === "foundation" && !!profile.foundation_id))
        );
        if (!allowed) {
          await supabase.auth.signOut();
          Alert.alert("Acceso restringido", `Esta cuenta no está habilitada como ${isMerchant ? "comercio" : "fundación"}.`);
          return;
        }
        navigation.replace(isMerchant ? "MerchantPanel" : "FoundationPanel");
        return;
      }
      navigation.replace(returnTo);
    } catch (error) {
      Alert.alert("No se pudo iniciar sesión", error.message || "Revisá tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>{isMerchant ? "Acceso para comercios" : isFoundation ? "Acceso para fundaciones" : "Iniciar sesión"}</Text>
    <Text style={styles.subtitle}>{isMerchant ? "Publicá productos para las necesidades de las fundaciones." : isFoundation ? "Gestioná las necesidades de tu organización." : "Ingresá para consultar tus donaciones."}</Text>
    <Text style={styles.label}>Email</Text>
    <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address"
      autoCapitalize="none" autoCorrect={false} placeholder="nombre@correo.com" placeholderTextColor={COLORS.textSecondary} editable={!loading && !resending} />
    <Text style={styles.label}>Contraseña</Text>
    <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry
      placeholder="Contraseña" placeholderTextColor={COLORS.textSecondary} editable={!loading && !resending} />
    <Pressable onPress={() => resendConfirmation()} disabled={loading || resending}>
      <Text style={styles.link}>{resending ? "Reenviando..." : "¿No confirmaste tu email?"}</Text>
    </Pressable>
    <Pressable style={[styles.button, (loading || resending) && styles.disabled]} onPress={login} disabled={loading || resending}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
    </Pressable>
    {!isFoundation && !isMerchant && <>
      <Text style={styles.subtitle}>¿Todavía no tenés cuenta?</Text>
      <Pressable onPress={() => navigation.navigate("Register", { returnTo })} style={styles.secondary}>
        <Text style={styles.secondaryText}>Crear cuenta</Text>
      </Pressable>
    </>}
    {isMerchant && <Text style={styles.subtitle}>El acceso comercial requiere habilitación del administrador.</Text>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, lineHeight: 20, color: COLORS.textSecondary, marginTop: 10, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 12, marginBottom: 14, color: COLORS.text },
  link: { fontSize: 13, fontWeight: "700", color: COLORS.primary, textAlign: "right", marginBottom: 12 },
  button: { padding: 15, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  disabled: { opacity: 0.6 },
  secondary: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, padding: 13, alignItems: "center" },
  secondaryText: { fontSize: 15, color: COLORS.primary, fontWeight: "800" },
});
