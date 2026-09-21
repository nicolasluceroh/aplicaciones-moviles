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
  const [category, setCategory] = useState("Todos");

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        category === "Todos" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.brand}>Pilar de Sonrisas</Text>
            <Text style={styles.subtitle}>
              Transformá una compra en una ayuda concreta.
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </Pressable>
        </View>

        {/* Buscador */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar productos para donar..."
        />

        {/* Categorías */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {["Todos", "Escolar", "Juguetes"].map((item) => (
            <Pressable
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Productos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Productos para donar</Text>

          <Pressable onPress={() => navigation.navigate("Catalog")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </Pressable>
        </View>

        {visibleProducts.length > 0 ? (
          <View style={styles.grid}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() =>
                  navigation.navigate("Product", {
                    productId: product.id,
                  })
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No encontramos productos</Text>
            <Text style={styles.emptyText}>
              Probá con otra búsqueda o categoría.
            </Text>
          </View>
        )}

        {/* Fundaciones */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fundaciones</Text>

          <Pressable onPress={() => navigation.navigate("Foundations")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </Pressable>
        </View>

        {foundations.map((foundation) => (
          <FoundationCard
            key={foundation.id}
            foundation={foundation}
            onPress={() =>
              navigation.navigate("Foundation", {
                foundationId: foundation.id,
              })
            }
          />
        ))}

        {/* Cómo funciona */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>

          <Text style={styles.howItWorksText}>
            Elegís un producto, realizás la compra y tu aporte se transforma
            en una ayuda concreta para una fundación.
          </Text>

          <Text style={styles.highlight}>
            La fundación recibe la ayuda, no vos.
          </Text>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 46,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 90,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  brand: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 18,
  },

  categories: {
    paddingVertical: 14,
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  categoryTextActive: {
    color: COLORS.surface,
  },

  sectionHeader: {
    marginTop: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },

  seeAll: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "800",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  howItWorks: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  howItWorksText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  highlight: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 12,
  },
});