import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";

const SOFT_BLUE = "#E8F0F7";
const SOFT_GREEN = "#E3F2E8";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function DonationsScreen({ navigation }) {
  const { user, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDonations = useCallback(async () => {
    if (!user?.id) {
      setDonations([]);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("donations")
      .select(
        "id, total, status, created_at, donation_items(id, product_name, foundation_name, quantity, unit_price)"
      )
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("No se pudo cargar el historial", error.message);
      setDonations([]);
    } else {
      setDonations(data || []);
    }

    setLoading(false);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadDonations();
    }, [loadDonations])
  );

  const totalDonated = useMemo(
    () => donations.reduce((sum, item) => sum + Number(item.total || 0), 0),
    [donations]
  );

  const describeFoundations = (items = []) => {
    const names = [...new Set(items.map((item) => item.foundation_name).filter(Boolean))];

    if (names.length === 0) return "Fundación no disponible";
    if (names.length === 1) return names[0];
    return `${names.length} fundaciones`;
  };

  const countProducts = (items = []) =>
    items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadDonations({ isRefresh: true })}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>Tu historial</Text>
          <Text style={styles.title}>Mis donaciones</Text>
          <Text style={styles.subtitle}>
            Historial de todo lo que donaste a través de Pilar de Sonrisas.
          </Text>
        </View>

        {authLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando sesión...</Text>
          </View>
        ) : !user ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Iniciá sesión para ver tu historial</Text>
            <Text style={styles.emptyText}>
              Las donaciones se guardan en la cuenta con la que confirmás el checkout.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate("Login", { userType: "donor", returnTo: "Donations" })
              }
            >
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando donaciones...</Text>
          </View>
        ) : donations.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no hiciste donaciones</Text>
            <Text style={styles.emptyText}>
              Cuando confirmes una donación, va a aparecer automáticamente en este historial.
            </Text>
            <Pressable style={styles.emptyButton} onPress={() => navigation.navigate("Home")}>
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
                {donations.length} {donations.length === 1 ? "donación" : "donaciones"}
              </Text>
            </View>

            {donations.map((donation) => {
              const items = donation.donation_items || [];
              const productsCount = countProducts(items);

              return (
                <View key={donation.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      Donación a {describeFoundations(items)}
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Confirmada</Text>
                    </View>
                  </View>

                  <Text style={styles.cardDate}>{formatDate(donation.created_at)}</Text>

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardProducts}>
                      {productsCount} {productsCount === 1 ? "producto" : "productos"}
                    </Text>
                    <Text style={styles.cardTotal}>{formatPrice(donation.total)}</Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      navigation.navigate("DonationDetail", { donationId: donation.id })
                    }
                  >
                    <Text style={styles.detailLink}>Ver detalle →</Text>
                  </Pressable>
                </View>
              );
            })}

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>Tu ayuda queda registrada</Text>
              <Text style={styles.noticeText}>
                Este historial se carga desde Supabase y solo muestra las donaciones de tu cuenta.
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
    borderRadius: RADIUS.card,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 18,
    ...SHADOW.card,
  },
  summaryLabel: { fontSize: 13, fontWeight: "800", color: COLORS.primary },
  summaryValue: { fontSize: 30, fontWeight: "800", color: COLORS.text, marginTop: 2 },
  summaryCount: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 14,
    marginBottom: 12,
    ...SHADOW.card,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTotal: { ...TYPE.bodyStrong, fontSize: 15, color: COLORS.text },
  cardDate: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cardMeta: { ...TYPE.caption, fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  cardRight: { alignItems: "flex-end", gap: 6 },
  badge: {
    backgroundColor: COLORS.successSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  loadingBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: "center",
  },
  loadingText: { marginTop: 10, color: COLORS.textSecondary },
  empty: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    padding: 28,
    alignItems: "center",
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, textAlign: "center" },
  emptyText: {
    ...TYPE.caption,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 7,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 11,
    paddingHorizontal: 18,
    marginTop: 16,
  },
  emptyButtonText: { ...TYPE.button, fontSize: 13, color: COLORS.surface },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 16,
  },
  emptyButtonText: { color: COLORS.primary, fontWeight: "800" },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 16,
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "800" },
});
