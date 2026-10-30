import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { supabase } from "../config/supabase";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function DonationDetailScreen({ route, navigation }) {
  const donationId = route.params?.donationId;
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDonation = useCallback(async () => {
    if (!donationId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("donations")
      .select(
        "id, total, status, created_at, donation_items(id, product_name, foundation_name, quantity, unit_price)"
      )
      .eq("id", donationId)
      .single();

    if (error) {
      Alert.alert("No se pudo cargar la donación", error.message);
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
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={styles.loadingText}>Cargando donación...</Text>
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No encontramos esta donación</Text>
        <Text style={styles.emptyText}>
          Puede que haya sido eliminada o que no pertenezca a tu cuenta.
        </Text>
      </View>
    );
  }

  const items = donation.donation_items || [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.status}>Confirmada</Text>
        <Text style={styles.total}>{formatPrice(donation.total)}</Text>
        <Text style={styles.date}>{formatDate(donation.created_at)}</Text>
        <Text style={styles.id}>ID {donation.id.slice(0, 8).toUpperCase()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Productos donados</Text>

      {items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.productName}>{item.product_name}</Text>
            <Text style={styles.price}>
              {formatPrice(Number(item.unit_price) * item.quantity)}
            </Text>
          </View>
          <Text style={styles.detail}>Cantidad: {item.quantity}</Text>
          <Text style={styles.detail}>Fundación: {item.foundation_name}</Text>
          <Text style={styles.detail}>Precio unitario: {formatPrice(item.unit_price)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  loadingText: { marginTop: 10, color: COLORS.textSecondary },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.lg,
    padding: 20,
  },
  status: { fontSize: 13, fontWeight: "800", color: COLORS.success },
  total: { fontSize: 30, fontWeight: "800", color: COLORS.text, marginTop: 6 },
  date: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  id: { fontSize: 11, color: COLORS.textSecondary, marginTop: 10 },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  productName: { flex: 1, fontSize: 15, fontWeight: "800", color: COLORS.text },
  price: { fontSize: 15, fontWeight: "800", color: COLORS.primary },
  detail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
});
