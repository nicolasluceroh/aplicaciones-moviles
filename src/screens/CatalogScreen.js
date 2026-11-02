import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPE } from "../constants/theme";
import { useCatalogProducts } from "../hooks/useCatalogProducts";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";

export default function CatalogScreen({ navigation }) {
  const { products, loading: loadingProducts, error: productsError } = useCatalogProducts();
  const [search, setSearch] = useState("");
  const categories = ["Todos", ...new Set(products.map((p) => p.category))];
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
  }, [search, category, products]);

  return (
    <View style={styles.root}>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Canales de aporte</Text>
      <Text style={styles.title}>Catálogo</Text>
      <Text style={styles.lead}>Elegí qué donar. El pago se hace una sola vez, al confirmar.</Text>

      <View style={styles.toolbar}>
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

        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {productsError && <Text style={styles.emptyText}>{productsError}</Text>}
      {loadingProducts && <Text style={styles.count}>Actualizando productos...</Text>}
      {visibleProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Feather name="search" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Sin resultados</Text>
          <Text style={styles.emptyText}>{products.length === 0 ? "Los comercios todavía no publicaron productos." : "Probá con otra categoría o buscá otro producto."}</Text>
        </View>
      ) : (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.count}>{visibleProducts.length} resultados</Text>
          </View>

          <View style={styles.grid}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => navigation.navigate("Product", { product })}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
    <BottomNav navigation={navigation} active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  eyebrow: { ...TYPE.caption, fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", color: COLORS.primary },
  title: { ...TYPE.display, fontSize: 26, color: COLORS.text, marginTop: 4 },
  lead: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, marginTop: 6, marginBottom: 16 },
  toolbar: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    gap: 10,
    marginBottom: 18,
  },
  categories: { gap: 8 },
  category: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: RADIUS.pill, backgroundColor: COLORS.background },
  categorySelected: { backgroundColor: COLORS.primary },
  categoryText: { ...TYPE.caption, color: COLORS.textSecondary, fontSize: 12, fontWeight: "600" },
  categoryTextSelected: { color: COLORS.surface },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginBottom: 12 },
  count: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  emptyState: {
    marginTop: 8,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    paddingVertical: 48,
    alignItems: "center",
    gap: 6,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { ...TYPE.h2, color: COLORS.text },
  emptyText: { ...TYPE.caption, color: COLORS.textSecondary },
});
