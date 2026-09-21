import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.emoji}>{product.emoji || "🎁"}</Text>
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>

      <Text style={styles.category}>
        {product.category}
      </Text>

      <Text style={styles.price}>
        ${product.price.toLocaleString("es-AR")}
      </Text>
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
    padding: 8,
    marginBottom: 10,
  },

  imagePlaceholder: {
    height: 86,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  emoji: {
    fontSize: 38,
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    minHeight: 32,
  },

  category: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  price: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 5,
  },
});