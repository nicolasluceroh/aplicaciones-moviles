import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import BottomNav from "../components/BottomNav";
import { getUser, logout, subscribe } from "../state/session";

// Azul suave para la caja de organizaciones.
// Se define acá para no modificar theme.js, que es un archivo compartido.
const SOFT_BLUE = "#E8F0F7";

export default function AccountScreen({ navigation }) {
  // La sesión vive en src/state/session.js para que no se pierda al navegar.
  const [user, setUser] = useState(getUser);

  useEffect(() => subscribe(setUser), []);

  const handleLogout = () => {
    logout();
  };

  const handleMyData = () => {
    Alert.alert("Mis datos", "La edición de datos se habilitará junto con Supabase.");
  };

  const handleInfo = (title) => {
    Alert.alert(title, "Esta sección se completará en una etapa posterior.");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mi cuenta</Text>
        <Text style={styles.subtitle}>Guardá y consultá tus donaciones.</Text>

        {user ? (
          // ---------- Con sesión ----------
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.trim().charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.greeting}>Hola, {user.name}</Text>
            {!!user.email && <Text style={styles.email}>{user.email}</Text>}

            <Pressable style={[styles.row, styles.firstRowSession]} onPress={handleMyData}>
              <Text style={styles.rowText}>Mis datos</Text>
              <Text style={styles.rowArrow}>›</Text>
            </Pressable>

            <Pressable style={styles.row} onPress={() => navigation.navigate("Donations")}>
              <Text style={styles.rowText}>Mis donaciones</Text>
              <Text style={styles.rowArrow}>›</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleLogout}>
              <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        ) : (
          // ---------- Sin sesión ----------
          <>
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>○</Text>
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
                <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.sectionTitle}>Organizaciones</Text>

        <View style={styles.foundationBox}>
          <Text style={styles.foundationTitle}>¿Representás a una fundación?</Text>
          <Text style={styles.foundationText}>
            Ingresá al panel de organización para gestionar necesidades, cámara y
            ubicación.
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Login", { userType: "foundation" })}
          >
            <Text style={styles.foundationLink}>Acceso para fundaciones →</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Acerca de Pilar de Sonrisas</Text>

        <View style={styles.card}>
          <Pressable
            style={[styles.row, styles.firstRow]}
            onPress={() => handleInfo("Cómo funciona")}
          >
            <Text style={styles.rowText}>Cómo funciona</Text>
            <Text style={styles.rowArrow}>›</Text>
          </Pressable>
          <Pressable
            style={styles.row}
            onPress={() => handleInfo("Privacidad y contacto")}
          >
            <Text style={styles.rowText}>Privacidad y contacto</Text>
            <Text style={styles.rowArrow}>›</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} active="Account" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { padding: SPACING.md, paddingBottom: 24 },

  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 5, marginBottom: 20 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: "center",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: { fontSize: 24, fontWeight: "800", color: COLORS.primary },

  cardTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, textAlign: "center" },
  cardText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },

  greeting: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  email: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },

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
  firstRow: { borderTopWidth: 0, marginTop: 0 },
  firstRowSession: { marginTop: 14 },
  rowText: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  rowArrow: { fontSize: 20, color: COLORS.textSecondary },

  primaryButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
    marginTop: 18,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: "800" },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 26,
    marginBottom: 12,
  },

  foundationBox: { backgroundColor: SOFT_BLUE, borderRadius: RADIUS.md, padding: 18 },
  foundationTitle: { fontSize: 15, fontWeight: "800", color: COLORS.secondary },
  foundationText: { fontSize: 13, color: COLORS.text, lineHeight: 19, marginTop: 8 },
  foundationLink: { fontSize: 14, fontWeight: "800", color: COLORS.secondary, marginTop: 14 },
});
