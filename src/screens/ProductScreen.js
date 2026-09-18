import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { products } from "../data/products";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { useCart } from "../context/CartContext";

export default function ProductScreen({ route, navigation }) {
  const { productId } = route.params || {};
  const product = products.find((item) => item.id === productId);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Producto no encontrado</Text>
      </View>
    );
  }

  const handleAdd = () => {
    addToCart(product);
    Alert.alert("Producto agregado", "Se agregó al carrito de donaciones.", [
      { text: "Seguir mirando" },
      { text: "Ver carrito", onPress: () => navigation.navigate("Cart") },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.emoji}>{product.emoji || "🎁"}</Text>
      </View>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toLocaleString("es-AR")}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar al carrito</Text>
      </Pressable>

      <Text style={styles.note}>
        La fundación destinataria se selecciona después, desde el carrito.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  imagePlaceholder: { height: 230, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  emoji: { fontSize: 78 },
  category: { fontSize: 12, color: COLORS.secondary, fontWeight: "700" },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text, marginTop: 4 },
  price: { fontSize: 24, fontWeight: "800", color: COLORS.primary, marginTop: 10 },
  description: { fontSize: 15, lineHeight: 22, color: COLORS.textSecondary, marginTop: 16 },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: RADIUS.md, alignItems: "center", marginTop: 26 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  note: { fontSize: 12, color: COLORS.textSecondary, textAlign: "center", marginTop: 12 },
});
