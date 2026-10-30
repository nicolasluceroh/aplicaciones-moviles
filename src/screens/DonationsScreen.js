import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";
import BottomNav from "../components/BottomNav";
import SkeletonBlock from "../components/SkeletonBlock";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const STATUS_LABEL = { confirmed: "Confirmada", cancelled: "Cancelada" };

function DonationSkeleton() {
  return (
    <>
      <SkeletonBlock height={86} radius={RADIUS.card} style={{ marginBottom: 18 }} />
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.card}>
          <SkeletonBlock width={46} height={46} radius={RADIUS.lg} />
          <View style={[styles.cardBody, { gap: 6 }]}>
            <SkeletonBlock width="50%" height={14} />
            <SkeletonBlock width="35%" height={11} />
            <SkeletonBlock width="70%" height={11} />
          </View>
        </View>
      ))}
    </>
  );
}

export default function DonationsScreen({ navigation }) {
  const { user, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const loadDonations = useCallback(async ({ isRefresh = false } = {}) => {
    if (!user?.id) {
      setDonations([]);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from("donations")
      .select(
        "id, total, status, created_at, donation_items(id, product_name, foundation_name, quantity, unit_price)"
      )
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError(error.message || "No se pudo cargar el historial.");
    } else {
      setDonations(data || []);
    }

    if (isRefresh) setRefreshing(false);
    else setLoading(false);
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
            <View style={styles.emptyIcon}>
              <Feather name="log-in" size={22} color={COLORS.primary} />
            </View>
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
          <DonationSkeleton />
        ) : loadError ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="alert-triangle" size={22} color={COLORS.danger} />
            </View>
            <Text style={styles.emptyTitle}>No se pudo cargar tu historial</Text>
            <Text style={styles.emptyText}>{loadError}</Text>
            <Pressable style={styles.primaryButton} onPress={() => loadDonations()}>
              <Text style={styles.primaryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : donations.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="package" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Todavía no hiciste ninguna donación</Text>
            <Text style={styles.emptyText}>
              Cuando dones algo del catálogo, vas a ver el seguimiento acá.
            </Text>
            <Pressable style={styles.emptyButton} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.emptyButtonText}>Ir al catálogo</Text>
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
              const statusKey = donation.status || "confirmed";
              const isCancelled = statusKey === "cancelled";

              return (
                <Pressable
                  key={donation.id}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("DonationDetail", { donationId: donation.id })
                  }
                >
                  <View style={styles.cardIcon}>
                    <Feather name="package" size={20} color={COLORS.primary} />
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardTotal}>{formatPrice(donation.total)}</Text>
                    <Text style={styles.cardDate}>{formatDate(donation.created_at)}</Text>
                    <Text style={styles.cardMeta} numberOfLines={1}>
                      {describeFoundations(items)} · {productsCount}{" "}
                      {productsCount === 1 ? "producto" : "productos"}
                    </Text>
                  </View>

                  <View style={styles.cardRight}>
                    <View style={[styles.badge, isCancelled && styles.badgeDanger]}>
                      <Text style={[styles.badgeText, isCancelled && styles.badgeTextDanger]}>
                        {STATUS_LABEL[statusKey] || "Confirmada"}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
                  </View>
                </Pressable>
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
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: SPACING.md,
    marginBottom: 20,
    ...SHADOW.card,
  },
  eyebrow: { ...TYPE.caption, fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", color: COLORS.primary },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text, marginTop: 4 },
  subtitle: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, marginTop: 5 },
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
  summaryLabel: { ...TYPE.caption, color: COLORS.primaryDark },
  summaryValue: { ...TYPE.display, fontSize: 28, color: COLORS.text, marginTop: 2 },
  summaryCount: { ...TYPE.bodyStrong, fontSize: 13, color: COLORS.textSecondary },
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
  badgeDanger: { backgroundColor: COLORS.dangerSoft },
  badgeText: { ...TYPE.caption, fontSize: 11, color: COLORS.success, fontWeight: "600" },
  badgeTextDanger: { color: COLORS.danger },
  notice: { backgroundColor: COLORS.accentSoft, borderRadius: RADIUS.card, padding: 18, marginTop: 8, ...SHADOW.card },
  noticeTitle: { ...TYPE.h2, fontSize: 15, color: COLORS.secondaryDark },
  noticeText: { ...TYPE.body, fontSize: 13, color: COLORS.text, marginTop: 8, lineHeight: 18 },
  loadingBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
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
  emptyTitle: { ...TYPE.h2, fontSize: 16, color: COLORS.text, textAlign: "center" },
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
  primaryButtonText: { ...TYPE.button, fontSize: 13, color: COLORS.textOnDark },
});
