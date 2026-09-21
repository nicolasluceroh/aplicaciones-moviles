import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;

export default function ConfirmationScreen({ route, navigation }) {
  const donationId = route.params?.donationId;
  const total = route.params?.total;

  const handleHome = () => {
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const handleHistory = () => {
    navigation.reset({ index: 0, routes: [{ name: "Donations" }] });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>¡Gracias por tu donación!</Text>
        <Text style={styles.text}>
          La donación quedó confirmada y guardada en tu cuenta.
        </Text>

        {!!total && <Text style={styles.total}>{formatPrice(total)}</Text>}
        {!!donationId && (
          <Text style={styles.id}>ID {String(donationId).slice(0, 8).toUpperCase()}</Text>
        )}
      </View>

      <Pressable style={styles.button} onPress={handleHistory}>
        <Text style={styles.buttonText}>Ver mis donaciones</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleHome}>
        <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg, justifyContent: "center" },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 28, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.success, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  icon: { color: "#FFFFFF", fontSize: 34, fontWeight: "800" },
  title: { fontSize: 23, fontWeight: "800", color: COLORS.text, textAlign: "center" },
  text: { fontSize: 14, lineHeight: 21, color: COLORS.textSecondary, textAlign: "center", marginTop: 10 },
  total: { fontSize: 25, fontWeight: "800", color: COLORS.primary, marginTop: 18 },
  id: { fontSize: 11, color: COLORS.textSecondary, marginTop: 8 },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 16, alignItems: "center", marginTop: 18 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, padding: 16, alignItems: "center", marginTop: 10 },
  secondaryButtonText: { color: COLORS.primary, fontWeight: "800", fontSize: 16 },
});
