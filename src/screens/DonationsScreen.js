import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import BottomNav from "../components/BottomNav";

export default function DonationsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Mis donaciones</Text>
        <Text style={styles.subtitle}>
          Esta pantalla quedará conectada al usuario autenticado y a Supabase.
        </Text>

        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Todavía no hay historial</Text>
          <Text style={styles.emptyText}>
            Facundo y Nicolás completarán esta parte al incorporar autenticación y persistencia.
          </Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.buttonText}>Explorar productos</Text>
          </Pressable>
        </View>
      </View>
      <BottomNav navigation={navigation} active="Donations" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { flex: 1, padding: SPACING.md },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 5, marginBottom: 20 },
  empty: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 22, alignItems: "center" },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, textAlign: "center", marginTop: 7 },
  button: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 10, paddingHorizontal: 16, marginTop: 16 },
  buttonText: { color: COLORS.primary, fontWeight: "800" },
});
