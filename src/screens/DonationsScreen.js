import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import BottomNav from "../components/BottomNav";

// Azul suave para el aviso del pie.
// Se define acá para no modificar theme.js, que es un archivo compartido.
const SOFT_BLUE = "#E8F0F7";
const SOFT_GREEN = "#E3F2E8";

// Historial simulado. Nicolás lo reemplazará con datos de Supabase.
const DONATIONS = [
  {
    id: "1",
    foundation: "Juguemos y Caminemos Juntos",
    date: "18 Sep 2026",
    products: 2,
    total: 27000,
    status: "Confirmada",
  },
  {
    id: "2",
    foundation: "Juguemos y Caminemos Juntos",
    date: "12 Sep 2026",
    products: 2,
    total: 27000,
    status: "Confirmada",
  },
];

const formatPrice = (value) => `$${value.toLocaleString("es-AR")}`;

export default function DonationsScreen({ navigation }) {
  const totalDonated = DONATIONS.reduce((sum, item) => sum + item.total, 0);

  const handleDetail = () => {
    Alert.alert(
      "Detalle de la donación",
      "El detalle completo se mostrará cuando el historial venga de Supabase."
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis donaciones</Text>
        <Text style={styles.subtitle}>Historial de tus aportes realizados.</Text>

        {DONATIONS.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no hay historial</Text>
            <Text style={styles.emptyText}>
              Cuando confirmes una donación vas a poder consultarla desde acá.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.emptyButtonText}>Explorar productos</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.summary}>
              <View>
                <Text style={styles.summaryLabel}>Total donado</Text>
                <Text style={styles.summaryValue}>{formatPrice(totalDonated)}</Text>
              </View>
              <Text style={styles.summaryCount}>
                {DONATIONS.length} {DONATIONS.length === 1 ? "donación" : "donaciones"}
              </Text>
            </View>

            {DONATIONS.map((donation) => (
              <View key={donation.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    Donación a {donation.foundation}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{donation.status}</Text>
                  </View>
                </View>

                <Text style={styles.cardDate}>{donation.date}</Text>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.cardProducts}>
                    {donation.products} productos
                  </Text>
                  <Text style={styles.cardTotal}>{formatPrice(donation.total)}</Text>
                </View>

                <Pressable onPress={handleDetail}>
                  <Text style={styles.detailLink}>Ver detalle →</Text>
                </Pressable>
              </View>
            ))}

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>Tu ayuda queda registrada</Text>
              <Text style={styles.noticeText}>
                Cuando conectemos Supabase, este historial se cargará con datos reales.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav navigation={navigation} active="Donations" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { padding: SPACING.md, paddingBottom: 24 },

  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 5, marginBottom: 20 },

  summary: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.md,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  summaryLabel: { fontSize: 13, fontWeight: "800", color: COLORS.primary },
  summaryValue: { fontSize: 30, fontWeight: "800", color: COLORS.text, marginTop: 2 },
  summaryCount: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start" },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: "800", color: COLORS.text, paddingRight: 10 },
  badge: {
    backgroundColor: SOFT_GREEN,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: "800", color: COLORS.success },

  cardDate: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },

  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardProducts: { fontSize: 14, color: COLORS.textSecondary },
  cardTotal: { fontSize: 18, fontWeight: "800", color: COLORS.primary },

  detailLink: { fontSize: 14, fontWeight: "800", color: COLORS.secondary, marginTop: 12 },

  notice: { backgroundColor: SOFT_BLUE, borderRadius: RADIUS.md, padding: 18, marginTop: 8 },
  noticeTitle: { fontSize: 15, fontWeight: "800", color: COLORS.secondary },
  noticeText: { fontSize: 13, color: COLORS.text, lineHeight: 19, marginTop: 8 },

  empty: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },
  emptyButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  emptyButtonText: { color: COLORS.primary, fontWeight: "800" },
});
