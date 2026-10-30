import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CARD_RADIUS, COLORS, RADIUS, SHADOW, TYPE } from "../constants/theme";

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.emoji}>{product.emoji || "🎁"}</Text>
        </View>
      )}

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
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 10,
    marginBottom: 14,
    ...SHADOW.card,
  },

  image: {
    width: "100%",
    height: 90,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceAlt,
    marginBottom: 10,
  },

  imagePlaceholder: {
    height: 90,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  emoji: {
    fontSize: 36,
  },

  name: {
    ...TYPE.bodyStrong,
    fontSize: 13,
    color: COLORS.text,
    minHeight: 32,
  },

  category: {
    ...TYPE.caption,
    fontSize: 11,
    lineHeight: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 6,
  },
});
