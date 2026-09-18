import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.emoji}>{product.emoji || "🎁"}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.price}>${product.price.toLocaleString("es-AR")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 100,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emoji: { fontSize: 38 },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text, minHeight: 38 },
  category: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  price: { fontSize: 17, fontWeight: "800", color: COLORS.primary, marginTop: 6 },
});
