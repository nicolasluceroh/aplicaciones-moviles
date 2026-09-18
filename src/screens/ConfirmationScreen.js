import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { useCart } from "../context/CartContext";

export default function ConfirmationScreen({ navigation }) {
  const { clearCart } = useCart();

  const handleFinish = () => {
    clearCart();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>¡Gracias por tu donación!</Text>
        <Text style={styles.text}>
          La donación fue confirmada. En la próxima etapa este movimiento quedará guardado en la base de datos.
        </Text>
      </View>
      <Pressable style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
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
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 16, alignItems: "center", marginTop: 18 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
});
