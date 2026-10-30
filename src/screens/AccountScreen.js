import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

const INFO_CONTENT = {
  "Cómo funciona": "Elegís productos, los agregás al carrito, asignás una fundación a cada uno y confirmás la donación. Si iniciás sesión, la donación queda guardada en tu historial.",
  "Privacidad y contacto": "Tu cuenta se usa para autenticarte y asociar tus donaciones. La información de sesión se administra con Supabase Auth.",
};

export default function AccountScreen({ navigation }) {
  const { user, profile, loading, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const name =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuario";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleMyData = () => {
    navigation.navigate("Profile");
  };

  const handleInfo = (title) => {
    if (title === "Cómo funciona") {
      Alert.alert(
        "Cómo funciona",
        "Elegís productos, los agregás al carrito, asignás una fundación a cada uno y confirmás la donación. Si iniciás sesión, la donación queda guardada en tu historial."
      );
      return;
    }

    Alert.alert(
      "Privacidad y contacto",
      "Tu cuenta se usa para autenticarte y asociar tus donaciones. La información de sesión se administra con Supabase Auth."
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>Tu espacio</Text>
          <Text style={styles.title}>Mi cuenta</Text>
          <Text style={styles.subtitle}>Guardá y consultá tus donaciones.</Text>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando sesión...</Text>
          </View>
        ) : user ? (
          // ---------- Con sesión real de Supabase ----------
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.trim().charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.greeting}>Hola, {name}</Text>
            {!!user.email && <Text style={styles.email}>{user.email}</Text>}

            <Pressable style={[styles.row, styles.firstRowSession]} onPress={handleMyData}>
              <View style={styles.rowLeft}>
                <Feather name="user" size={16} color={COLORS.textSecondary} />
                <Text style={styles.rowText}>Mis datos</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
            </Pressable>

            <Pressable style={styles.row} onPress={() => navigation.navigate("Donations")}>
              <View style={styles.rowLeft}>
                <Feather name="package" size={16} color={COLORS.textSecondary} />
                <Text style={styles.rowText}>Mis donaciones</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
            </Pressable>

            <Pressable
              style={[styles.secondaryButton, loggingOut && styles.disabledButton]}
              onPress={handleLogout}
              disabled={loggingOut}
            >
              <Text style={styles.secondaryButtonText}>
                {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              </Text>
            </Pressable>
          </View>
        ) : (
          // ---------- Sin sesión ----------
          <>
            <View style={styles.card}>
              <View style={[styles.avatar, styles.avatarEmpty]}>
                <Feather name="user" size={26} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.cardTitle}>Todavía no iniciaste sesión</Text>
              <Text style={styles.cardText}>
                Podés explorar y armar tu carrito sin cuenta. Te pediremos ingresar antes
                de confirmar.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() => navigation.navigate("Login", { userType: "donor" })}
              >
                <Feather name="log-in" size={15} color={COLORS.surface} />
                <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Feather name="user-plus" size={15} color={COLORS.primaryDark} />
              <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
            </Pressable>

            <View style={styles.stepsCard}>
              <Text style={styles.stepsTitle}>¿Cómo funciona?</Text>
              {[
                { icon: "shopping-bag", text: "Elegís productos del catálogo." },
                { icon: "heart", text: "Asignás cada uno a una fundación." },
                { icon: "check-circle", text: "Confirmás y queda en tu historial." },
              ].map((step, index) => (
                <View key={step.icon} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Feather name={step.icon} size={14} color={COLORS.primaryDark} />
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Organizaciones</Text>

        <View style={styles.foundationBox}>
          <View style={styles.foundationHeader}>
            <Feather name="map-pin" size={16} color={COLORS.secondaryDark} />
            <Text style={styles.foundationTitle}>¿Representás a una fundación?</Text>
          </View>
          <Text style={styles.foundationText}>
            Ingresá al panel de organización para gestionar necesidades, cámara y
            ubicación.
          </Text>
          <Pressable
            style={styles.foundationLinkRow}
            onPress={() => navigation.navigate("Login", { userType: "foundation" })}
          >
            <Text style={styles.foundationLink}>Acceso para fundaciones</Text>
            <Feather name="arrow-right" size={16} color={COLORS.secondaryDark} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Acerca de Pilar de Sonrisas</Text>

        <View style={styles.card}>
          <Pressable
            style={[styles.row, styles.firstRow]}
            onPress={() => handleInfo("Cómo funciona")}
          >
            <View style={styles.rowLeft}>
              <Feather name="help-circle" size={16} color={COLORS.textSecondary} />
              <Text style={styles.rowText}>Cómo funciona</Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
          </Pressable>
          <Pressable
            style={styles.row}
            onPress={() => handleInfo("Privacidad y contacto")}
          >
            <View style={styles.rowLeft}>
              <Feather name="shield" size={16} color={COLORS.textSecondary} />
              <Text style={styles.rowText}>Privacidad y contacto</Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={!!infoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModal(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setInfoModal(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>{infoModal?.title}</Text>
            <Text style={styles.modalMessage}>{infoModal?.message}</Text>
            <Pressable style={styles.modalCloseButton} onPress={() => setInfoModal(null)}>
              <Text style={styles.modalCloseText}>Entendido</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <BottomNav navigation={navigation} active="Account" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { padding: SPACING.md, paddingBottom: 24 },

  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: SPACING.md,
    marginBottom: 20,
    ...SHADOW.card,
  },
  eyebrow: { ...TYPE.caption, fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", color: COLORS.primary },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text, marginTop: 4 },
  subtitle: { ...TYPE.caption, fontSize: 13, color: COLORS.textSecondary, marginTop: 5 },

  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.card,
    padding: 20,
    ...SHADOW.card,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.card,
    padding: 28,
    alignItems: "center",
    ...SHADOW.card,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 28,
    alignItems: "center",
  },
  loadingText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 10 },

  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmpty: { backgroundColor: COLORS.primarySoft, alignSelf: "center", marginBottom: 4 },
  avatarText: { fontSize: 22, fontWeight: "800", color: COLORS.surface },

  profileInfo: { flex: 1 },
  cardTitle: { ...TYPE.h1, fontSize: 16, color: COLORS.text, textAlign: "center" },
  cardText: {
    ...TYPE.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },

  greeting: { ...TYPE.h1, fontSize: 16, color: COLORS.text },
  emailRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  email: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary },

  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 15,
    marginTop: 4,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  firstRow: { borderTopWidth: 0, marginTop: 0 },
  firstRowSession: { marginTop: 18 },
  rowText: { ...TYPE.bodyStrong, fontSize: 14, color: COLORS.text },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginTop: 18,
  },
  primaryButtonText: { ...TYPE.button, fontSize: 14, color: COLORS.surface },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginTop: 12,
  },
  secondaryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: "800" },
  disabledButton: { opacity: 0.6 },

  sectionTitle: {
    ...TYPE.h1,
    fontSize: 16,
    color: COLORS.text,
    marginTop: 26,
    marginBottom: 12,
  },

  foundationBox: {
    backgroundColor: COLORS.secondarySoft,
    borderRadius: RADIUS.card,
    padding: 18,
    ...SHADOW.card,
  },
  foundationHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  foundationTitle: { ...TYPE.h2, fontSize: 15, color: COLORS.secondaryDark },
  foundationText: { ...TYPE.body, fontSize: 13, color: COLORS.text, marginTop: 8, lineHeight: 18 },
  foundationLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  foundationLink: { ...TYPE.bodyStrong, fontSize: 13, color: COLORS.secondaryDark },

  stepsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 18,
    marginTop: 16,
    ...SHADOW.card,
  },
  stepsTitle: { ...TYPE.h2, fontSize: 15, color: COLORS.text },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: { ...TYPE.caption, fontSize: 11, fontWeight: "800", color: COLORS.primaryDark },
  stepText: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, flex: 1 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(28,25,23,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 22,
  },
  modalTitle: { ...TYPE.h1, fontSize: 17, color: COLORS.text },
  modalMessage: { ...TYPE.body, fontSize: 14, color: COLORS.textSecondary, marginTop: 10, lineHeight: 20 },
  modalCloseButton: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 13,
    alignItems: "center",
  },
  modalCloseText: { ...TYPE.button, fontSize: 14, color: COLORS.surface },
});
