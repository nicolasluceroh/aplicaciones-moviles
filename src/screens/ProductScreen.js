import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { useCart } from "../context/CartContext";
import { useCatalogProducts } from "../hooks/useCatalogProducts";
import BottomNav from "../components/BottomNav";

export default function ProductScreen({ route, navigation }) {
  const { products, loading } = useCatalogProducts();
  const { product: param, productId } = route.params || {};
  const product = param || products.find((p) => p.id === productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <View style={styles.center}><Text style={styles.note}>
      {loading ? "Cargando producto..." : "El producto ya no está disponible."}
    </Text></View>;
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    Alert.alert("Producto agregado", `Se agregaron ${quantity} unidad(es) al carrito.`, [
      { text: "Seguir mirando" },
      { text: "Ver carrito", onPress: () => navigation.navigate("Cart") },
    ]);
  };

  return <View style={styles.root}>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {product.images?.length > 0 ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gallery}>
          {product.images.map((uri, index) => <Image key={`${uri}-${index}`}
            source={{ uri }} resizeMode="contain" style={styles.productImage} />)}
        </ScrollView>
      ) : product.image ? <Image source={{ uri: product.image }} resizeMode="contain" style={styles.productImage} /> :
        <View style={styles.imagePlaceholder}><Text style={styles.emoji}>{product.emoji || "🎁"}</Text></View>}
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.merchant}>Vendido por: {product.merchantName || "Comercio"}</Text>
      <Text style={styles.price}>${Number(product.price).toLocaleString("es-AR")}</Text>
      <Text style={styles.description}>{product.description}</Text>
      {product.foundationId && <Text style={styles.note}>Este artículo se destina a la fundación que publicó la necesidad: {product.needName}.</Text>}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Cantidad</Text>
        <View style={styles.quantityControls}>
          <Pressable style={styles.qtyButton} onPress={() => setQuantity((q) => Math.max(1, q - 1))}><Text style={styles.qtyButtonText}>−</Text></Pressable>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <Pressable style={styles.qtyButton} onPress={() => setQuantity((q) => q + 1)}><Text style={styles.qtyButtonText}>+</Text></Pressable>
        </View>
      </View>
      <Pressable style={styles.button} onPress={handleAdd}><Text style={styles.buttonText}>Agregar al carrito</Text></Pressable>
      <Text style={styles.note}>{product.foundationId ? "La fundación ya está asignada a esta oferta." : "Elegí la fundación destinataria desde el carrito."}</Text>
    </ScrollView>
    <BottomNav navigation={navigation} active="Home" />
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  imagePlaceholder: { height: 230, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceAlt, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  gallery: { gap: 8, paddingBottom: 8 },
  productImage: { width: 285, height: 230, borderRadius: RADIUS.md, marginBottom: 20, backgroundColor: COLORS.surfaceAlt },
  emoji: { fontSize: 78 },
  category: { fontSize: 12, color: COLORS.secondary, fontWeight: "700" },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text, marginTop: 4 },
  merchant: { fontSize: 14, color: COLORS.textSecondary, fontWeight: "600", marginTop: 7 },
  price: { fontSize: 24, fontWeight: "800", color: COLORS.primary, marginTop: 10 },
  description: { fontSize: 15, lineHeight: 22, color: COLORS.textSecondary, marginTop: 16 },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: RADIUS.md, alignItems: "center", marginTop: 26 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  note: { fontSize: 12, color: COLORS.textSecondary, marginTop: 12 },
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, backgroundColor: COLORS.surface, padding: 12, borderRadius: RADIUS.md },
  quantityLabel: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  qtyButton: { width: 32, height: 32, backgroundColor: COLORS.primarySoft, borderRadius: RADIUS.sm, alignItems: "center", justifyContent: "center" },
  qtyButtonText: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  qtyValue: { marginHorizontal: 16, fontSize: 16, fontWeight: "800", color: COLORS.text },
});
