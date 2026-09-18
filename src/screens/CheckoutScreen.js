import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useCart } from "../context/CartContext";

export default function CheckoutScreen({ navigation }) {
  const { cart, totalPrice } = useCart();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resumen de la donación</Text>
      <Text style={styles.subtitle}>Revisá los productos y sus destinos.</Text>

      {cart.map((item) => {
        const foundation = foundations.find((f) => f.id === item.foundationId);
        return (
          <View key={item.product.id} style={styles.card}>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.detail}>Cantidad: {item.quantity}</Text>
            <Text style={styles.detail}>Destino: {foundation?.name || "Sin seleccionar"}</Text>
            <Text style={styles.price}>
              ${(item.product.price * item.quantity).toLocaleString("es-AR")}
            </Text>
          </View>
        );
      })}

      <View style={styles.paymentCard}>
        <Text style={styles.paymentTitle}>Método de pago</Text>
        <Text style={styles.detail}>Tarjeta de crédito/débito</Text>
        <Text style={styles.note}>Pago simulado para esta etapa del proyecto.</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.total}>${totalPrice.toLocaleString("es-AR")}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => navigation.replace("Confirmation")}>
        <Text style={styles.buttonText}>Confirmar donación</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 36 },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, marginBottom: 20 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 15, marginBottom: 10 },
  productName: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  detail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 5 },
  price: { fontSize: 16, fontWeight: "800", color: COLORS.primary, marginTop: 8 },
  paymentCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 15, marginTop: 8 },
  paymentTitle: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  note: { fontSize: 11, color: COLORS.textSecondary, marginTop: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20 },
  totalLabel: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  total: { fontSize: 23, fontWeight: "800", color: COLORS.primary },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 16, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
});
