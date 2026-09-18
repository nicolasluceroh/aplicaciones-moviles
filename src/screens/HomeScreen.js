import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { products } from "../data/products";
import { foundations } from "../data/foundations";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import FoundationCard from "../components/FoundationCard";

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>Pilar de Sonrisas</Text>
        <Text style={styles.subtitle}>Transformá una compra en una ayuda concreta.</Text>

        <SearchBar value={search} onChangeText={setSearch} />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Productos para donar</Text>
            <Text style={styles.sectionHint}>Base visual - mejorar según Figma</Text>
          </View>
          <Pressable onPress={() => navigation.navigate("Catalog")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </Pressable>
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

        <Text style={styles.sectionTitle}>Fundaciones</Text>
        {foundations.map((foundation) => (
          <FoundationCard
            key={foundation.id}
            foundation={foundation}
            onPress={() => navigation.navigate("Foundation", { foundationId: foundation.id })}
          />
        ))}
      </ScrollView>

      <BottomNav navigation={navigation} active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg },
  brand: { fontSize: 28, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 18 },
  sectionHeader: { marginTop: 24, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginTop: 20, marginBottom: 10 },
  sectionHint: { fontSize: 11, color: COLORS.textSecondary },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: "800", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
