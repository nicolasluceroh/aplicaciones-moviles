import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CARD_RADIUS, COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";
import { products } from "../data/products";
import { foundations } from "../data/foundations";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import FoundationCard from "../components/FoundationCard";
import logoImage from "../assets/logo.png";

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
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <View style={styles.brandRow}>
                <Image source={logoImage} style={styles.brandLogo} resizeMode="contain" />
                <Text style={styles.brand}>Pilar de Sonrisas</Text>
              </View>
              <Text style={styles.subtitle}>
                Una compra que llega como ayuda a Pilar.
              </Text>
            </View>

            <Pressable
              style={styles.profileButton}
              onPress={() => navigation.navigate("Profile")}
            >
              <Feather name="user" size={17} color={COLORS.text} />
            </Pressable>
          </View>

          {/* Mini resumen del catálogo: le da presencia al hero y es siempre real. */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Feather name="gift" size={13} color={COLORS.primaryDark} />
              <Text style={styles.statChipText}>{products.length} productos</Text>
            </View>
            <View style={[styles.statChip, styles.statChipSecondary]}>
              <Feather name="map-pin" size={13} color={COLORS.secondaryDark} />
              <Text style={[styles.statChipText, styles.statChipTextSecondary]}>
                {foundations.length} {foundations.length === 1 ? "fundación" : "fundaciones"}
              </Text>
            </View>
          </View>
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
          <View>
            <Text style={styles.sectionTitle}>Productos para donar</Text>
            <Text style={styles.sectionSubtitle}>
              Cada uno va directo a una fundación que lo necesita.
            </Text>
          </View>

          <Pressable style={styles.seeAllRow} onPress={() => navigation.navigate("Catalog")}>
            <Text style={styles.seeAll}>Ver todo</Text>
            <Feather name="arrow-right" size={13} color={COLORS.primaryDark} />
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
            <Feather name="search" size={22} color={COLORS.primary} />
            <Text style={styles.emptyTitle}>No encontramos productos</Text>
            <Text style={styles.emptyText}>
              Probá con otra búsqueda o categoría.
            </Text>
          </View>
        )}

        {/* Fundaciones */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, styles.foundationsTitle]}>Fundaciones de Pilar</Text>
            <Text style={styles.sectionSubtitle}>
              Organizaciones locales que reciben lo que donás.
            </Text>
          </View>

          <Pressable style={styles.seeAllRow} onPress={() => navigation.navigate("Foundations")}>
            <Text style={styles.seeAll}>Ver todo</Text>
            <Feather name="arrow-right" size={13} color={COLORS.primaryDark} />
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

          {[
            { icon: "shopping-bag", text: "Elegís uno o más productos del catálogo." },
            { icon: "heart", text: "Asignás cada uno a la fundación que quieras ayudar." },
            { icon: "check-circle", text: "Confirmás y queda registrado en tu historial." },
          ].map((step, index) => (
            <View key={step.icon} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Feather name={step.icon} size={15} color={COLORS.primaryDark} style={styles.stepIcon} />
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}

          <View style={styles.highlightRow}>
            <Feather name="check-circle" size={14} color={COLORS.primaryDark} />
            <Text style={styles.highlight}>
              La fundación recibe la ayuda, no vos.
            </Text>
          </View>
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

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: SPACING.md,
    marginBottom: 20,
    ...SHADOW.card,
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

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  brandLogo: {
    width: 28,
    height: 28,
  },

  brand: {
    ...TYPE.display,
    fontSize: 22,
    color: COLORS.text,
  },

  subtitle: {
    ...TYPE.body,
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

  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },

  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  statChipSecondary: {
    backgroundColor: COLORS.secondarySoft,
  },

  statChipText: {
    ...TYPE.caption,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  statChipTextSecondary: {
    color: COLORS.secondaryDark,
  },

  categories: {
    paddingVertical: 14,
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    ...TYPE.caption,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  categoryTextActive: {
    color: COLORS.surface,
  },

  sectionHeader: {
    marginTop: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionTitle: {
    ...TYPE.h1,
    color: COLORS.text,
  },

  foundationsTitle: {
    color: COLORS.secondaryDark,
  },

  sectionSubtitle: {
    ...TYPE.caption,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  seeAll: {
    ...TYPE.caption,
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },

  emptyTitle: {
    ...TYPE.bodyStrong,
    fontSize: 14,
    color: COLORS.text,
  },

  emptyText: {
    ...TYPE.caption,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  howItWorks: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 18,
    marginTop: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    ...SHADOW.card,
  },

  howItWorksText: {
    ...TYPE.body,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginTop: 6,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },

  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumberText: {
    ...TYPE.caption,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  stepIcon: {
    marginLeft: -2,
  },

  stepText: {
    ...TYPE.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },

  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  highlight: {
    ...TYPE.bodyStrong,
    fontSize: 13,
    color: COLORS.primaryDark,
  },
});
