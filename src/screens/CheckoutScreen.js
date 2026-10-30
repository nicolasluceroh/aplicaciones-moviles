import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";
import PressableScale from "../components/PressableScale";
import BottomNav from "../components/BottomNav";
import { useAppAlert } from "../components/AppAlert";

export default function CheckoutScreen({ navigation }) {
  const alert = useAppAlert();
  const { cart, totalPrice, hasMissingFoundation, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (authLoading) return;

    if (!user) {
      alert(
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
      alert("Carrito vacío", "Agregá productos antes de confirmar la donación.");
      navigation.navigate("Cart");
      return;
    }

    if (hasMissingFoundation) {
      alert(
        "Falta elegir una fundación",
        "Cada producto debe tener una fundación destinataria antes de continuar."
      );
      navigation.navigate("Cart");
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
      alert(
        "No se pudo guardar la donación",
        error?.message || "Intentá nuevamente. Tu carrito se mantuvo sin cambios."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const foundationName = (id) =>
    foundations.find((foundation) => foundation.id === id)?.name ?? "Sin seleccionar";

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

      {!user ? (
        <View style={styles.loginBox}>
          <View style={styles.loginHeader}>
            <Feather name="log-in" size={18} color={COLORS.secondaryDark} />
            <Text style={styles.loginTitle}>Iniciá sesión para confirmar tu donación</Text>
          </View>
          <Text style={styles.loginText}>
            Necesitamos tu cuenta para guardar el historial de donaciones.
          </Text>
        </View>
      ) : (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Feather name="user" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoTitle}>Cuenta</Text>
          </View>
          {authLoading ? (
            <ActivityIndicator color={COLORS.primary} style={styles.accountLoader} />
          ) : (
            <Text style={styles.detail}>{user.email}</Text>
          )}
        </View>
      )}

      <PressableScale
        style={[styles.button, submitting && styles.disabledButton]}
        onPress={handleConfirm}
        disabled={submitting || authLoading}
      >
        {submitting ? (
          <ActivityIndicator color={COLORS.surface} />
        ) : (
          <>
            <Feather name="heart" size={16} color={COLORS.surface} />
            <Text style={styles.buttonText}>Confirmar donación</Text>
          </>
        )}
      </PressableScale>
    </ScrollView>
    <BottomNav navigation={navigation} active="Cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 36 },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text },
  subtitle: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, marginTop: 6, marginBottom: 20 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    ...SHADOW.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLast: { borderBottomWidth: 0 },
  flex: { flex: 1 },
  productName: { ...TYPE.bodyStrong, fontSize: 14, color: COLORS.text },
  detail: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  price: { ...TYPE.bodyStrong, fontSize: 14, color: COLORS.text },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  totalLabel: { ...TYPE.bodyStrong, fontSize: 14, color: COLORS.text },
  total: { ...TYPE.display, fontSize: 20, color: COLORS.text },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 16,
    marginTop: 16,
    ...SHADOW.card,
  },
  infoHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  infoTitle: { ...TYPE.bodyStrong, fontSize: 13, color: COLORS.text },
  accountLoader: { alignSelf: "flex-start", marginTop: 6 },
  note: { ...TYPE.caption, fontSize: 11, lineHeight: 16, color: COLORS.textSecondary, marginTop: 6 },
  loginBox: {
    backgroundColor: COLORS.secondarySoft,
    borderRadius: RADIUS.card,
    padding: 18,
    marginTop: 16,
    ...SHADOW.card,
  },
  loginHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  loginTitle: { ...TYPE.bodyStrong, fontSize: 14, color: COLORS.secondaryDark, flex: 1 },
  loginText: { ...TYPE.caption, fontSize: 12, color: COLORS.secondaryDark, marginTop: 8, lineHeight: 17 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    marginTop: 18,
  },
  disabledButton: { opacity: 0.7 },
  buttonText: { color: COLORS.surface, ...TYPE.button, fontSize: 14 },
});
