import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";

export default function CartScreen({ navigation }) {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    assignFoundation,
    totalPrice,
    hasMissingFoundation,
  } = useCart();

  const handleContinue = () => {
    if (cart.length === 0) {
      Alert.alert("Carrito vacío", "Agregá al menos un producto para continuar.");
      return;
    }

    if (hasMissingFoundation) {
      Alert.alert(
        "Falta elegir una fundación",
        "Cada producto debe tener una fundación destinataria antes de continuar."
      );
      return;
    }

    navigation.navigate("Checkout");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tu carrito</Text>
        <Text style={styles.subtitle}>
          Acá se define a qué fundación se destina cada producto.
        </Text>

        {cart.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no agregaste productos</Text>
            <Text style={styles.emptyText}>Explorá el inicio y sumá productos para donar.</Text>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.secondaryButtonText}>Ver productos</Text>
            </Pressable>
          </View>
        ) : (
          cart.map((item) => {
            const foundation = foundations.find((f) => f.id === item.foundationId);
            return (
              <View key={item.product.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <View style={styles.flex}>
                    <Text style={styles.productName}>{item.product.name}</Text>
                    <Text style={styles.price}>${item.product.price.toLocaleString("es-AR")} c/u</Text>
                  </View>
                  <Pressable onPress={() => removeFromCart(item.product.id)}>
                    <Text style={styles.remove}>Eliminar</Text>
                  </Pressable>
                </View>

                <View style={styles.quantityRow}>
                  <Text style={styles.label}>Cantidad</Text>
                  <View style={styles.quantityControls}>
                    <Pressable style={styles.quantityButton} onPress={() => decreaseQuantity(item.product.id)}>
                      <Text style={styles.quantityButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <Pressable style={styles.quantityButton} onPress={() => increaseQuantity(item.product.id)}>
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.label}>Fundación destinataria</Text>
                {foundation ? (
                  <Text style={styles.foundationSelected}>{foundation.name}</Text>
                ) : (
                  <Text style={styles.missing}>Sin seleccionar</Text>
                )}

                {/* Base temporal. Joaquín reemplazará este botón por un selector real. */}
                <Pressable
                  style={styles.foundationButton}
                  onPress={() => assignFoundation(item.product.id, foundations[0].id)}
                >
                  <Text style={styles.foundationButtonText}>
                    {foundation ? "Cambiar fundación" : "Elegir fundación"}
                  </Text>
                </Pressable>
              </View>
            );
          })
        )}

        {cart.length > 0 && (
          <>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>${totalPrice.toLocaleString("es-AR")}</Text>
            </View>
            <Pressable style={styles.primaryButton} onPress={handleContinue}>
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
      <BottomNav navigation={navigation} active="Cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { padding: SPACING.md, paddingBottom: 24 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 5, marginBottom: 20 },
  empty: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 22, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginTop: 6 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  flex: { flex: 1, paddingRight: 10 },
  productName: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  price: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  remove: { color: COLORS.danger, fontSize: 12, fontWeight: "700" },
  quantityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 18, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  quantityButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.surfaceAlt, alignItems: "center", justifyContent: "center" },
  quantityButtonText: { fontSize: 20, color: COLORS.text },
  quantity: { minWidth: 36, textAlign: "center", fontWeight: "800", color: COLORS.text },
  foundationSelected: { color: COLORS.text, fontWeight: "700", marginTop: 6 },
  missing: { color: COLORS.warning, fontWeight: "700", marginTop: 6 },
  foundationButton: { alignSelf: "flex-start", marginTop: 10, paddingVertical: 8, paddingHorizontal: 12, borderRadius: RADIUS.sm, backgroundColor: COLORS.primarySoft },
  foundationButtonText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
  totalBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16 },
  totalLabel: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  total: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
  primaryButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: RADIUS.md, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { marginTop: 16, borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 10, paddingHorizontal: 16 },
  secondaryButtonText: { color: COLORS.primary, fontWeight: "800" },
});
