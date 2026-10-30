import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";
import { supabase } from "../config/supabase";
import SkeletonBlock from "../components/SkeletonBlock";
import BottomNav from "../components/BottomNav";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const STATUS_LABEL = { confirmed: "Confirmada", cancelled: "Cancelada" };

export default function DonationDetailScreen({ route, navigation }) {
  const donationId = route.params?.donationId;
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadDonation = useCallback(async () => {
    if (!donationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from("donations")
      .select(
        "id, total, status, created_at, donation_items(id, product_name, foundation_name, quantity, unit_price)"
      )
      .eq("id", donationId)
      .single();

    if (error) {
      setLoadError(error.message || "No se pudo cargar la donación.");
      setDonation(null);
    } else {
      setDonation(data);
    }

    setLoading(false);
  }, [donationId]);

  useFocusEffect(
    useCallback(() => {
      loadDonation();
    }, [loadDonation])
  );

  if (loading) {
    return (
      <View style={styles.root}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <SkeletonBlock width="40%" height={13} style={{ marginTop: 14 }} />
          <SkeletonBlock width="60%" height={26} style={{ marginTop: 14 }} />
          <SkeletonBlock width="35%" height={12} style={{ marginTop: 8 }} />
          <SkeletonBlock height={70} radius={RADIUS.card} style={{ marginTop: 24 }} />
          <SkeletonBlock height={70} radius={RADIUS.card} style={{ marginTop: 12 }} />
        </View>
      </View>
      <BottomNav navigation={navigation} active="Donations" />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.root}>
      <View style={styles.centered}>
        <Feather name="alert-triangle" size={28} color={COLORS.danger} />
        <Text style={styles.emptyTitle}>No se pudo cargar la donación</Text>
        <Text style={styles.emptyText}>{loadError}</Text>
        <Pressable style={styles.backLink} onPress={loadDonation}>
          <Feather name="refresh-cw" size={14} color={COLORS.primary} />
          <Text style={styles.backLinkText}>Reintentar</Text>
        </Pressable>
      </View>
      <BottomNav navigation={navigation} active="Donations" />
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={styles.root}>
      <View style={styles.centered}>
        <Feather name="package" size={28} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>No encontramos esta donación</Text>
        <Text style={styles.emptyText}>
          Puede que haya sido eliminada o que no pertenezca a tu cuenta.
        </Text>
        <Pressable style={styles.backLink} onPress={() => navigation.navigate("Donations")}>
          <Feather name="arrow-left" size={14} color={COLORS.primary} />
          <Text style={styles.backLinkText}>Mis donaciones</Text>
        </Pressable>
      </View>
      <BottomNav navigation={navigation} active="Donations" />
      </View>
    );
  }

  const items = donation.donation_items || [];
  const statusKey = donation.status || "confirmed";
  const isCancelled = statusKey === "cancelled";

  return (
    <View style={styles.root}>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable style={styles.backLink} onPress={() => navigation.navigate("Donations")}>
        <Feather name="arrow-left" size={14} color={COLORS.textSecondary} />
        <Text style={styles.backLinkTextMuted}>Mis donaciones</Text>
      </Pressable>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.total}>{formatPrice(donation.total)}</Text>
          <Text style={styles.date}>{formatDate(donation.created_at)}</Text>
        </View>
        <View style={[styles.badge, isCancelled && styles.badgeDanger]}>
          <Text style={[styles.badgeText, isCancelled && styles.badgeTextDanger]}>
            {STATUS_LABEL[statusKey] || "Confirmada"}
          </Text>
        </View>
      </View>

      <Text style={styles.id}>ID {donation.id.slice(0, 8).toUpperCase()}</Text>

      <Text style={styles.sectionTitle}>Productos donados</Text>

      {items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.rowBetween}>
            <View style={styles.flex}>
              <Text style={styles.productName}>{item.product_name}</Text>
              <View style={styles.foundationRow}>
                <Feather name="map-pin" size={13} color={COLORS.secondary} />
                <Text style={styles.detail}>{item.foundation_name}</Text>
              </View>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.qty}>x{item.quantity}</Text>
              <Text style={styles.price}>
                {formatPrice(Number(item.unit_price) * item.quantity)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
    <BottomNav navigation={navigation} active="Donations" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
    gap: 6,
  },
  loadingText: { marginTop: 10, color: COLORS.textSecondary },
  emptyTitle: { ...TYPE.h2, color: COLORS.text, marginTop: 6 },
  emptyText: {
    marginTop: 4,
    ...TYPE.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  backLink: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, marginBottom: 4 },
  backLinkText: { ...TYPE.bodyStrong, fontSize: 13, color: COLORS.primary },
  backLinkTextMuted: { ...TYPE.bodyStrong, fontSize: 13, color: COLORS.textSecondary },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 14,
  },
  total: { ...TYPE.display, fontSize: 24, color: COLORS.text },
  date: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  badge: {
    backgroundColor: COLORS.successSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeDanger: { backgroundColor: COLORS.dangerSoft },
  badgeText: { ...TYPE.caption, fontSize: 11, color: COLORS.success, fontWeight: "600" },
  badgeTextDanger: { color: COLORS.danger },
  id: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: {
    ...TYPE.h1,
    fontSize: 17,
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.card,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  flex: { flex: 1 },
  productName: { ...TYPE.bodyStrong, fontSize: 14, color: COLORS.text },
  foundationRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  detail: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary },
  itemRight: { alignItems: "flex-end" },
  qty: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary },
  price: { ...TYPE.bodyStrong, fontSize: 14, color: COLORS.text, marginTop: 4 },
});
