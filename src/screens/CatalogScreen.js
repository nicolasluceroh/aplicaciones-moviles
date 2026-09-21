import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { categories, products } from "../data/products";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

export default function CatalogScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(term);
      const matchesCategory = category === "Todos" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SearchBar value={search} onChangeText={setSearch} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {categories.map((item) => {
          const selected = item === category;
          return (
            <Pressable
              key={item}
              style={[styles.category, selected && styles.categorySelected]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Productos</Text>
        <Text style={styles.count}>{visibleProducts.length} resultados</Text>
      </View>

      <View style={styles.grid}>
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => navigation.navigate("Product", { productId: product.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  categories: { gap: 8, paddingVertical: 14 },
  category: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  categorySelected: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary },
  categoryText: { color: COLORS.textSecondary, fontWeight: "700", fontSize: 12 },
  categoryTextSelected: { color: COLORS.primary },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  count: { fontSize: 12, color: COLORS.textSecondary },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
