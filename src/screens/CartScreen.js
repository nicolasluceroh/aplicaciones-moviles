import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";
import { Feather } from "@expo/vector-icons";

export default function CartScreen({ navigation }) {
  const {
    cart,
    totalPrice,
    hasMissingFoundation,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    assignFoundation,
  } = useCart();

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);

  const abrirSelectorFundacion = (productId) => {
    setActiveProductId(productId);
    setSelectorVisible(true);
  };

  const elegirFundacion = (foundationId) => {
    assignFoundation(activeProductId, foundationId);
    setSelectorVisible(false);
    setActiveProductId(null);
  };

  const handleContinue = () => {
    if (cart.length === 0 || hasMissingFoundation) return;
    navigation.navigate("Checkout");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Tu carrito</Text>
          <Text style={styles.subtitle}>
            Revisá los productos y asigná a qué fundación va cada donación.
          </Text>
        </View>

        {cart.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Feather name="shopping-bag" size={13} color={COLORS.primaryDark} />
              <Text style={styles.statChipText}>
                {cart.length} {cart.length === 1 ? "producto" : "productos"}
              </Text>
            </View>
            <View style={[styles.statChip, styles.statChipSecondary]}>
              <Feather name="map-pin" size={13} color={COLORS.secondaryDark} />
              <Text style={[styles.statChipText, styles.statChipTextSecondary]}>
                {new Set(cart.filter((i) => i.foundationId).map((i) => i.foundationId)).size} de{" "}
                {cart.length} con fundación
              </Text>
            </View>
          </View>
        )}

        {cart.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no agregaste productos</Text>
            <Text style={styles.emptyText}>
              Explorá el inicio y sumá productos para donar.
            </Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.secondaryButtonText}>Ver productos</Text>
            </Pressable>
          </View>
        ) : (
          cart.map((item) => {
            const foundation = foundations.find(
              (f) => f.id === item.foundationId
            );
            return (
              <View key={item.product.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <View style={styles.flex}>
                    <Text style={styles.productName}>{item.product.name}</Text>
                    <Text style={styles.price}>
                      ${item.product.price.toLocaleString("es-AR")} c/u
                    </Text>
                  </View>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.product.id)}
                  >
                    <Feather name="trash-2" size={16} color={COLORS.danger} />
                  </Pressable>
                </View>

                <View style={styles.quantityRow}>
                  <Text style={styles.label}>Cantidad</Text>
                  <View style={styles.quantityControls}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => decreaseQuantity(item.product.id)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(item.product.id)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.label}>Fundación destinataria</Text>
                {foundation ? (
                  <Text style={styles.foundationSelected}>{foundation.name}</Text>
                ) : (
                  <Text style={styles.missing}>Sin seleccionar ⚠️</Text>
                )}

                <Pressable
                  style={styles.foundationButton}
                  disabled={!!item.product.foundationId}
                  onPress={() => abrirSelectorFundacion(item.product.id)}
                >
                  <Text
                    style={foundation ? styles.foundationSelected : styles.missing}
                    numberOfLines={1}
                  >
                    {foundation ? foundation.name : "Elegí una fundación"}
                  </Text>
                  {!item.product.foundationId && <Feather name="chevron-down" size={16} color={COLORS.textSecondary} />}
                </Pressable>
              </View>
            );
          })
        )}

        {cart.length > 0 && (
          <>
            {hasMissingFoundation && (
              <View style={styles.avisoContainer}>
                <Text style={styles.avisoTexto}>
                  ⚠️ Asigná una fundación a cada producto para poder continuar.
                </Text>
              </View>
            )}

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>
                ${totalPrice.toLocaleString("es-AR")}
              </Text>
            </View>
            <Pressable
              style={[
                styles.primaryButton,
                hasMissingFoundation && styles.primaryButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={hasMissingFoundation}
            >
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal
        visible={selectorVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectorVisible(false)}
      >
        <Pressable
          style={styles.modalFondo}
          onPress={() => setSelectorVisible(false)}
        >
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Elegí una fundación</Text>
            {foundations.map((f) => (
              <Pressable
                key={f.id}
                style={styles.opcionFundacion}
                onPress={() => elegirFundacion(f.id)}
              >
                <Text style={styles.opcionFundacionTexto}>{f.name}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <BottomNav navigation={navigation} active="Cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { padding: SPACING.md, paddingBottom: 24 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 5,
    marginBottom: 20,
  },
  empty: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  flex: { flex: 1, paddingRight: 10 },
  productName: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  price: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  remove: { color: COLORS.danger, fontSize: 12, fontWeight: "700" },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 16,
  },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: { fontSize: 20, color: COLORS.text },
  quantity: { minWidth: 36, textAlign: "center", fontWeight: "800", color: COLORS.text },
  foundationSelected: { color: COLORS.text, fontWeight: "700", marginTop: 6 },
  missing: { color: COLORS.warning, fontWeight: "700", marginTop: 6 },
  foundationButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primarySoft,
  },
  foundationButtonText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
  avisoContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 12,
  },
  avisoTexto: { color: "#92400E", fontSize: 13, fontWeight: "600" },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  totalLabel: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  total: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  primaryButtonDisabled: { backgroundColor: "#A1A1AA" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: { color: COLORS.primary, fontWeight: "800" },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContenido: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: COLORS.text },
  opcionFundacion: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  opcionFundacionTexto: { fontSize: 15, color: COLORS.text },
});
