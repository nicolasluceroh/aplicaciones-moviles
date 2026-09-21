import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>{foundation.shortName}</Text>
        </View>
        <Text style={styles.title}>{foundation.name}</Text>
        <Text style={styles.home}>{foundation.home}</Text>
        <Text style={styles.location}>{foundation.location}</Text>
      </View>

      <Text style={styles.description}>{foundation.description}</Text>
      <Text style={styles.sectionTitle}>Necesidades publicadas</Text>
      <Text style={styles.note}>
        Por ahora se utilizan productos locales. Esta sección quedará preparada para Supabase.
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
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: { backgroundColor: COLORS.surface, padding: 18, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  logo: { width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  logoText: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  home: { fontSize: 14, fontWeight: "700", color: COLORS.secondary, marginTop: 5 },
  location: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  description: { fontSize: 14, lineHeight: 21, color: COLORS.text, marginTop: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginTop: 24 },
  note: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
