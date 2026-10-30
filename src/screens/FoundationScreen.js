import { ScrollView, StyleSheet, Text, View, Pressable, Image, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";
import { foundations } from "../data/foundations";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";

export default function FoundationScreen({ route, navigation }) {
  const foundationId = route.params?.foundationId || foundations[0]?.id;
  const foundation = foundations.find((item) => item.id === foundationId);

  if (!foundation) {
    return (
      <View style={styles.center}>
        <Text>Fundación no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          {foundation.logo ? (
            <Image source={foundation.logo} style={styles.logoImage} resizeMode="cover" />
          ) : (
            <Text style={styles.logoText}>{foundation.shortName}</Text>
          )}
        </View>
        <Text style={styles.title}>{foundation.name}</Text>
        <View style={styles.infoRow}>
          <Feather name="home" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{foundation.home}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{foundation.location}</Text>
        </View>

        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <Feather name="package" size={13} color={COLORS.secondaryDark} />
            <Text style={styles.heroBadgeText}>
              {products.length} {products.length === 1 ? "necesidad" : "necesidades"}
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <Feather name="shield" size={13} color={COLORS.secondaryDark} />
            <Text style={styles.heroBadgeText}>Fundación verificada</Text>
          </View>
        </View>

        {!!foundation.instagram && (
          <Pressable
            style={styles.instagramButton}
            onPress={() => Linking.openURL(foundation.instagram)}
          >
            <Feather name="instagram" size={14} color={COLORS.text} />
            <Text style={styles.instagramText}>Seguir en Instagram</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionTitle}>Acerca de la fundación</Text>
      <Text style={styles.description}>{foundation.description}</Text>

      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>¿Querés ayudar?</Text>
        <Text style={styles.ctaText}>
          Elegí un producto del catálogo y asignalo a {foundation.shortName} al momento
          de donar.
        </Text>
        <Pressable style={styles.ctaButton} onPress={() => navigation.navigate("Catalog")}>
          <Text style={styles.ctaButtonText}>Ver catálogo para donar</Text>
          <Feather name="arrow-right" size={15} color={COLORS.surface} />
        </Pressable>
      </View>

      <View style={styles.needsHeader}>
        <Feather name="package" size={16} color={COLORS.secondaryDark} />
        <Text style={styles.needsTitle}>Lo que están necesitando</Text>
      </View>
      <Text style={styles.note}>
        Por ahora se utilizan productos locales. Esta sección quedará preparada para
        Supabase.
      </Text>

      <View style={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => navigation.navigate("Product", { productId: product.id })}
          />
        ))}
      </View>
    </ScrollView>
    <BottomNav navigation={navigation} active="Foundations" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: {
    backgroundColor: COLORS.secondarySoft,
    padding: 20,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.secondarySoft,
    ...SHADOW.card,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 3,
    borderColor: COLORS.surface,
    overflow: "hidden",
  },
  heroBadgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroBadgeText: { ...TYPE.caption, fontSize: 11, fontWeight: "700", color: COLORS.secondaryDark },
  logoImage: { width: "100%", height: "100%" },
  logoText: { ...TYPE.h2, color: COLORS.surface },
  title: { ...TYPE.display, fontSize: 22, color: COLORS.secondaryDark },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  infoText: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary },
  instagramButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },
  instagramText: { ...TYPE.bodyStrong, fontSize: 12, color: COLORS.text },
  sectionTitle: { ...TYPE.h1, fontSize: 17, color: COLORS.text, marginTop: 24 },
  description: {
    ...TYPE.body,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  ctaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 18,
    marginTop: 18,
    ...SHADOW.card,
  },
  ctaTitle: { ...TYPE.h2, fontSize: 15, color: COLORS.text },
  ctaText: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, marginTop: 6, lineHeight: 18 },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    marginTop: 14,
  },
  ctaButtonText: { ...TYPE.button, fontSize: 13, color: COLORS.surface },
  needsHeader: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 26 },
  needsTitle: { ...TYPE.h1, fontSize: 17, color: COLORS.text },
  note: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary, marginTop: 5, marginBottom: 12, lineHeight: 17 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
