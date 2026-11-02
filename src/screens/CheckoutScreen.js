import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";
import { Feather } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

export default function CheckoutScreen({ navigation }) {
  const { cart, totalPrice, hasMissingFoundation, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const foundationName = (id) => foundations.find((f) => f.id === id)?.name || "Fundación";

  const handleConfirm = async () => {
    if (authLoading) return;

    if (!user) {
      Alert.alert(
        "Necesitás iniciar sesión",
        "Para confirmar una donación y guardarla en tu historial necesitás una cuenta.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Crear cuenta",
            onPress: () => navigation.navigate("Register", { returnTo: "Checkout" }),
          },
          {
            text: "Iniciar sesión",
            onPress: () =>
              navigation.navigate("Login", { userType: "donor", returnTo: "Checkout" }),
          },
        ]
      );
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Carrito vacío", "Agregá productos antes de confirmar la donación.");
      navigation.navigate("Cart");
      return;
    }

    if (hasMissingFoundation) {
      Alert.alert(
        "Falta elegir una fundación",
        "Cada producto debe tener una fundación destinataria antes de continuar."
      );
      navigation.navigate("Cart");
      return;
    }

    if (cart.some((item) => item.product.foundationId && item.product.foundationId !== item.foundationId)) {
      Alert.alert("Fundación incorrecta", "La oferta de un comercio solo se puede donar a la fundación que publicó la necesidad.");
      return;
    }

    const items = cart.map((item) => {
      const foundation = foundations.find((f) => f.id === item.foundationId);

      return {
        product_id: String(item.product.id),
        product_name: item.product.name,
        foundation_id: String(item.foundationId),
        foundation_name: foundation?.name || "Fundación",
        quantity: item.quantity,
        unit_price: item.product.price,
      };
    });

    try {
      setSubmitting(true);

      const { data: donationId, error } = await supabase.rpc("create_donation", {
        p_items: items,
      });

      if (error) throw error;

      clearCart();
      navigation.replace("Confirmation", {
        donationId,
        total: totalPrice,
      });
    } catch (error) {
      Alert.alert(
        "No se pudo guardar la donación",
        error?.message || "Intentá nuevamente. Tu carrito se mantuvo sin cambios."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Confirmar donación</Text>
      <Text style={styles.subtitle}>
        Revisá el detalle antes de confirmar. Esta donación queda registrada en tu cuenta.
      </Text>

      <View style={styles.card}>
        {cart.map((item, index) => (
          <View
            key={item.product.id}
            style={[styles.row, index === cart.length - 1 && styles.rowLast]}
          >
            <View style={styles.flex}>
              <Text style={styles.productName}>
                {item.quantity} × {item.product.name}
              </Text>
              <Text style={styles.detail}>Para {foundationName(item.foundationId)}</Text>
            </View>
            <Text style={styles.price}>
              ${(item.product.price * item.quantity).toLocaleString("es-AR")}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>${totalPrice.toLocaleString("es-AR")}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Feather name="credit-card" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoTitle}>Método de pago</Text>
        </View>
        <Text style={styles.detail}>Tarjeta de crédito/débito</Text>
        <Text style={styles.note}>Pago simulado para esta etapa del proyecto.</Text>
      </View>

      <View style={styles.accountCard}>
        <Text style={styles.paymentTitle}>Cuenta</Text>
        {authLoading ? (
          <ActivityIndicator color={COLORS.primary} style={styles.accountLoader} />
        ) : user ? (
          <Text style={styles.detail}>{user.email}</Text>
        ) : (
          <Text style={styles.note}>
            Podés revisar el carrito sin cuenta, pero te pediremos iniciar sesión antes de confirmar.
          </Text>
        )}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.total}>${totalPrice.toLocaleString("es-AR")}</Text>
      </View>

      <Pressable
        style={[styles.button, submitting && styles.disabledButton]}
        onPress={handleConfirm}
        disabled={submitting || authLoading}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Confirmar donación</Text>
        )}
      </Pressable>
    </ScrollView>
    <BottomNav navigation={navigation} active="Cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 36 },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, marginBottom: 20 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 15, marginBottom: 10 },
  productName: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  detail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 5 },
  price: { fontSize: 16, fontWeight: "800", color: COLORS.primary, marginTop: 8 },
  paymentCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 15, marginTop: 8 },
  accountCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 15, marginTop: 10 },
  accountLoader: { alignSelf: "flex-start", marginTop: 8 },
  paymentTitle: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  note: { fontSize: 11, lineHeight: 17, color: COLORS.textSecondary, marginTop: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20 },
  totalLabel: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  total: { fontSize: 23, fontWeight: "800", color: COLORS.primary },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 16, alignItems: "center" },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
});
