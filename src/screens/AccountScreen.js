import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import BottomNav from "../components/BottomNav";

export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi cuenta</Text>
        <Text style={styles.subtitle}>
          Podés recorrer la aplicación sin iniciar sesión. La cuenta se utiliza al donar y consultar el historial.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Donantes</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Login", { userType: "donor" })}>
            <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Organizaciones</Text>
          <Text style={styles.cardText}>Acceso reservado para fundaciones registradas.</Text>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Login", { userType: "foundation" })}>
            <Text style={styles.secondaryButtonText}>Acceso para fundaciones</Text>
          </Pressable>
        </View>
      </View>
      <BottomNav navigation={navigation} active="Account" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { flex: 1, padding: SPACING.md },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginTop: 5, marginBottom: 20 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 18, marginBottom: 14 },
  cardTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  cardText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 5, marginBottom: 12 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 13, alignItems: "center", marginTop: 14 },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "800" },
  secondaryButton: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, padding: 13, alignItems: "center", marginTop: 10 },
  secondaryButtonText: { color: COLORS.primary, fontWeight: "800" },
});
