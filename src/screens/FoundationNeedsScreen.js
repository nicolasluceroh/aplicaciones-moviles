import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/AuthContext";

export default function FoundationNeedsScreen() {
  const { profile, profileLoading } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [name, setName] = useState("");
  const [pending, setPending] = useState("1");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const foundationId = profile?.foundation_id;
  const canManage = ["foundation", "admin"].includes(profile?.role);

  const loadNeeds = useCallback(async () => {
    if (!foundationId || !canManage) {
      setNeeds([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("foundation_needs")
      .select("id, foundation_id, name, pending, created_at, updated_at")
      .eq("foundation_id", foundationId)
      .order("created_at", { ascending: true });

    if (error) {
      Alert.alert("No se pudieron cargar las necesidades", error.message);
      setNeeds([]);
    } else {
      setNeeds(data || []);
    }
    setLoading(false);
  }, [foundationId, canManage]);

  useFocusEffect(
    useCallback(() => {
      loadNeeds();
    }, [loadNeeds])
  );

  const addNeed = async () => {
    const cleanName = name.trim();
    const amount = Math.max(0, Number.parseInt(pending, 10) || 0);

    if (!cleanName) {
      Alert.alert("Falta el nombre", "Ingresá una necesidad para publicar.");
      return;
    }

    if (!foundationId || !canManage) {
      Alert.alert("Acceso restringido", "Esta cuenta no está asociada a una fundación.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.from("foundation_needs").insert({
        foundation_id: foundationId,
        name: cleanName,
        pending: amount,
      });

      if (error) throw error;

      setName("");
      setPending("1");
      await loadNeeds();
    } catch (error) {
      Alert.alert("No se pudo agregar", error?.message || "Intentá nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const updatePending = async (need, nextValue) => {
    const safeValue = Math.max(0, nextValue);
    const { error } = await supabase
      .from("foundation_needs")
      .update({ pending: safeValue })
      .eq("id", need.id);

    if (error) {
      Alert.alert("No se pudo actualizar", error.message);
      return;
    }

    setNeeds((current) =>
      current.map((item) =>
        item.id === need.id ? { ...item, pending: safeValue } : item
      )
    );
  };

  const removeNeed = (need) => {
    Alert.alert(
      "Eliminar necesidad",
      `¿Querés eliminar “${need.name}”?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("foundation_needs")
              .delete()
              .eq("id", need.id);

            if (error) {
              Alert.alert("No se pudo eliminar", error.message);
              return;
            }

            setNeeds((current) => current.filter((item) => item.id !== need.id));
          },
        },
      ]
    );
  };

  if (profileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!canManage || !foundationId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Acceso restringido</Text>
        <Text style={styles.emptyText}>
          Esta cuenta no está asociada a una fundación.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Gestionar necesidades</Text>
      <Text style={styles.subtitle}>
        Publicá qué necesita la fundación y cuántas unidades siguen pendientes.
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Necesidad</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ej.: Pañales, útiles, juguetes"
          placeholderTextColor={COLORS.textSecondary}
          editable={!saving}
        />

        <Text style={styles.label}>Cantidad pendiente</Text>
        <TextInput
          style={styles.input}
          value={pending}
          onChangeText={setPending}
          keyboardType="number-pad"
          placeholder="1"
          placeholderTextColor={COLORS.textSecondary}
          editable={!saving}
        />

        <Pressable
          style={[styles.primaryButton, saving && styles.disabledButton]}
          onPress={addNeed}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? "Guardando..." : "Agregar necesidad"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Publicadas</Text>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : needs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Todavía no hay necesidades publicadas.</Text>
        </View>
      ) : (
        needs.map((need) => (
          <View key={need.id} style={styles.needCard}>
            <View style={styles.needHeader}>
              <Text style={styles.needName}>{need.name}</Text>
              <Pressable onPress={() => removeNeed(need)}>
                <Text style={styles.remove}>Eliminar</Text>
              </Pressable>
            </View>

            <Text style={styles.pendingLabel}>Pendientes</Text>
            <View style={styles.quantityRow}>
              <Pressable
                style={styles.quantityButton}
                onPress={() => updatePending(need, need.pending - 1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </Pressable>
              <Text style={styles.quantity}>{need.pending}</Text>
              <Pressable
                style={styles.quantityButton}
                onPress={() => updatePending(need, need.pending + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
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
  title: { fontSize: 25, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, lineHeight: 19, color: COLORS.textSecondary, marginTop: 5, marginBottom: 18 },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 13,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 14,
  },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 14, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "800" },
  disabledButton: { opacity: 0.6 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: COLORS.text, marginTop: 24, marginBottom: 12 },
  needCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  needHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  needName: { flex: 1, fontSize: 15, fontWeight: "800", color: COLORS.text, paddingRight: 10 },
  remove: { color: COLORS.danger, fontSize: 12, fontWeight: "700" },
  pendingLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary, marginTop: 14 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  quantityButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.surfaceAlt, alignItems: "center", justifyContent: "center" },
  quantityButtonText: { fontSize: 20, color: COLORS.text },
  quantity: { minWidth: 44, textAlign: "center", fontSize: 16, fontWeight: "800", color: COLORS.text },
  emptyCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 18 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  emptyText: { fontSize: 13, lineHeight: 19, color: COLORS.textSecondary, textAlign: "center" },
});
