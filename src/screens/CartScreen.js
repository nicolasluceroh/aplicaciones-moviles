import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPE, SHADOW } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";
import PressableScale from "../components/PressableScale";

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
            <View style={styles.emptyIcon}>
              <Feather name="shopping-bag" size={24} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyText}>
              Elegí productos del catálogo para armar una donación.
            </Text>
            <PressableScale
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.secondaryButtonText}>Ir al catálogo</Text>
              <Feather name="arrow-right" size={14} color={COLORS.surface} />
            </PressableScale>
          </View>
        ) : (
          cart.map((item) => {
            const foundation = foundations.find(
              (f) => f.id === item.foundationId
            );
            return (
              <View key={item.product.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <View style={styles.thumbRow}>
                    {item.product.image ? (
                      <Image source={{ uri: item.product.image }} style={styles.thumb} />
                    ) : (
                      <View style={styles.thumbPlaceholder}>
                        <Text style={styles.thumbEmoji}>{item.product.emoji || "🎁"}</Text>
                      </View>
                    )}
                    <View style={styles.flex}>
                      <Text style={styles.productName}>{item.product.name}</Text>
                      <Text style={styles.price}>
                        ${item.product.price.toLocaleString("es-AR")} c/u
                      </Text>
                    </View>
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
                      <Feather name="minus" size={14} color={COLORS.text} />
                    </Pressable>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(item.product.id)}
                    >
                      <Feather name="plus" size={14} color={COLORS.text} />
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.label}>Fundación destinataria</Text>
                <Pressable
                  style={[styles.foundationSelect, !foundation && styles.foundationSelectInvalid]}
                  onPress={() => abrirSelectorFundacion(item.product.id)}
                >
                  <Text
                    style={foundation ? styles.foundationSelected : styles.missing}
                    numberOfLines={1}
                  >
                    {foundation ? foundation.name : "Elegí una fundación"}
                  </Text>
                  <Feather name="chevron-down" size={16} color={COLORS.textSecondary} />
                </Pressable>
              </View>
            );
          })
        )}

        {cart.length > 0 && (
          <>
            {hasMissingFoundation && (
              <View style={styles.avisoContainer}>
                <Feather name="alert-circle" size={15} color={COLORS.warning} />
                <Text style={styles.avisoTexto}>
                  Asigná una fundación a cada producto para continuar.
                </Text>
              </View>
            )}

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.total}>
                ${totalPrice.toLocaleString("es-AR")}
              </Text>
            </View>
            <PressableScale
              style={[
                styles.primaryButton,
                hasMissingFoundation && styles.primaryButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={hasMissingFoundation}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  hasMissingFoundation && styles.primaryButtonTextDisabled,
                ]}
              >
                Continuar
              </Text>
              <Feather
                name="arrow-right"
                size={16}
                color={hasMissingFoundation ? COLORS.textSecondary : COLORS.surface}
              />
            </PressableScale>
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
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: SPACING.md,
    marginBottom: 20,
    ...SHADOW.card,
  },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text },
  subtitle: {
    ...TYPE.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statChipSecondary: { backgroundColor: COLORS.secondarySoft },
  statChipText: { ...TYPE.caption, fontSize: 11, fontWeight: "700", color: COLORS.primaryDark },
  statChipTextSecondary: { color: COLORS.secondaryDark },
  empty: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: "center",
    ...SHADOW.card,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: { ...TYPE.h2, color: COLORS.text },
  emptyText: {
    ...TYPE.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.card,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  thumbRow: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceAlt,
  },
  thumbPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbEmoji: { fontSize: 22 },
  flex: { flex: 1, paddingRight: 10 },
  productName: { ...TYPE.bodyStrong, fontSize: 15, color: COLORS.text },
  price: { ...TYPE.caption, color: COLORS.textSecondary, marginTop: 4 },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 14,
  },
  label: { ...TYPE.caption, fontSize: 11, color: COLORS.textSecondary },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: { minWidth: 26, textAlign: "center", fontSize: 13, fontWeight: "600", color: COLORS.text },
  foundationSelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: COLORS.background,
  },
  foundationSelectInvalid: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warningSoft,
  },
  foundationSelected: { color: COLORS.text, ...TYPE.body, fontSize: 13, flex: 1 },
  missing: { color: COLORS.textSecondary, ...TYPE.body, fontSize: 13, flex: 1 },
  avisoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: COLORS.warningSoft,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 12,
  },
  avisoTexto: { flex: 1, color: COLORS.warning, ...TYPE.caption, fontSize: 12 },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
    paddingBottom: 6,
  },
  totalLabel: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary },
  total: { ...TYPE.h1, fontSize: 20, color: COLORS.text },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: RADIUS.lg,
    marginTop: 10,
  },
  primaryButtonDisabled: { backgroundColor: COLORS.border },
  primaryButtonText: { color: COLORS.surface, ...TYPE.button, fontSize: 14 },
  primaryButtonTextDisabled: { color: COLORS.textSecondary },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  secondaryButtonText: { color: COLORS.surface, ...TYPE.button, fontSize: 13 },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(28,25,23,0.45)",
    justifyContent: "flex-end",
  },
  modalContenido: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitulo: { ...TYPE.h2, marginBottom: 12, color: COLORS.text },
  opcionFundacion: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  opcionFundacionTexto: { ...TYPE.body, color: COLORS.text },
});
