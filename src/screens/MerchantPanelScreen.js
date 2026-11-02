import { useCallback, useState } from "react";
import {
  ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/AuthContext";

export default function MerchantPanelScreen({ navigation }) {
  const { user, profile, profileLoading, signOut } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedNeedId, setSelectedNeedId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Otros");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const permitted = Boolean(user && profile?.role === "merchant");

  const loadData = useCallback(async () => {
    if (!permitted) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [needsResult, offersResult] = await Promise.all([
      supabase.from("foundation_needs")
        .select("id, foundation_id, name, pending")
        .gt("pending", 0).order("name"),
      supabase.from("merchant_products")
        .select("id, need_id, name, description, price, category, is_active, created_at")
        .eq("merchant_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (needsResult.error || offersResult.error) {
      Alert.alert("No se pudo cargar", needsResult.error?.message || offersResult.error?.message);
    } else {
      setNeeds(needsResult.data || []);
      setOffers(offersResult.data || []);
    }
    setLoading(false);
  }, [permitted, user?.id]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const selectedNeed = needs.find((need) => need.id === selectedNeedId);
  const getFoundationName = (id) => foundations.find((f) => f.id === id)?.name || `Fundación ${id}`;

  const publish = async () => {
    const normalizedPrice = Number(price.trim().replace(/\./g, "").replace(",", "."));
    if (!selectedNeed || name.trim().length < 2 ||
        !Number.isFinite(normalizedPrice) || normalizedPrice <= 0 ||
        category.trim().length < 2) {
      Alert.alert("Revisá los datos", "Elegí una necesidad e ingresá producto, categoría y precio válido.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("merchant_products").insert({
        merchant_id: user.id,
        need_id: selectedNeed.id,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: normalizedPrice,
      });
      if (error) throw error;
      setName(""); setDescription(""); setPrice(""); setCategory("Otros"); setSelectedNeedId(null);
      await loadData();
      Alert.alert("Producto publicado", "La oferta ya está disponible en el catálogo.");
    } catch (error) {
      Alert.alert("No se pudo publicar", error.message || "Intentá nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const toggleOffer = async (offer) => {
    setSaving(true);
    const { error } = await supabase.from("merchant_products")
      .update({ is_active: !offer.is_active })
      .eq("id", offer.id).eq("merchant_id", user.id);
    if (error) Alert.alert("No se pudo actualizar", error.message);
    else await loadData();
    setSaving(false);
  };

  const removeOffer = (offer) => Alert.alert(
    "Eliminar publicación", `¿Eliminar «${offer.name}»?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        setSaving(true);
        const { error } = await supabase.from("merchant_products")
          .delete().eq("id", offer.id).eq("merchant_id", user.id);
        if (error) Alert.alert("No se pudo eliminar", error.message);
        else await loadData();
        setSaving(false);
      } },
    ]
  );

  if (profileLoading || (loading && permitted && needs.length === 0 && offers.length === 0)) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
  }
  if (!permitted) {
    return <View style={styles.center}><Text style={styles.title}>Acceso restringido</Text>
      <Text style={styles.helper}>Necesitás una cuenta habilitada como comercio.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Account")}>
        <Text style={styles.buttonText}>Ir a Mi cuenta</Text>
      </Pressable>
    </View>;
  }

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>{profile.business_name || "Panel de comercio"}</Text>
    <Text style={styles.helper}>Publicá artículos que respondan a las necesidades de las fundaciones.</Text>
    <View style={styles.card}>
      <Text style={styles.section}>Nueva publicación</Text>
      <Text style={styles.label}>Seleccioná una necesidad pendiente</Text>
      {needs.length === 0 ? <Text style={styles.helper}>No hay necesidades pendientes disponibles.</Text> :
        needs.map((need) => <Pressable key={need.id}
          style={[styles.needRow, selectedNeedId === need.id && styles.needSelected]}
          onPress={() => {
            setSelectedNeedId(need.id);
            setName(need.name);
          }} disabled={saving}>
          <Text style={styles.needName}>{selectedNeedId === need.id ? "◉" : "○"} {need.name}</Text>
          <Text style={styles.helper}>{getFoundationName(need.foundation_id)} · {need.pending} pendientes</Text>
        </Pressable>)}
      <Text style={styles.label}>Producto</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName}
        editable={!saving} placeholder="Ej.: Mochila reforzada" placeholderTextColor={COLORS.textSecondary} maxLength={120} />
      <Text style={styles.label}>Descripción</Text>
      <TextInput style={[styles.input, styles.multiline]} value={description}
        onChangeText={setDescription} editable={!saving} multiline
        placeholder="Características del artículo" placeholderTextColor={COLORS.textSecondary} maxLength={1000} />
      <Text style={styles.label}>Categoría</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory}
        editable={!saving} maxLength={60} placeholder="Ej.: Escolar" placeholderTextColor={COLORS.textSecondary} />
      <Text style={styles.label}>Precio (ARS)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice}
        editable={!saving} keyboardType="decimal-pad" placeholder="Ej.: 15000" placeholderTextColor={COLORS.textSecondary} />
      <Pressable style={[styles.button, saving && styles.disabled]} disabled={saving || !selectedNeed}
        onPress={publish}><Text style={styles.buttonText}>{saving ? "Guardando..." : "Publicar producto"}</Text></Pressable>
    </View>
    <Text style={styles.section}>Mis publicaciones ({offers.length})</Text>
    {offers.length === 0 ? <Text style={styles.helper}>Todavía no publicaste productos.</Text> :
      offers.map((offer) => <View key={offer.id} style={styles.card}>
        <Text style={styles.offerTitle}>{offer.name}</Text>
        <Text style={styles.helper}>
          {needs.find((n) => n.id === offer.need_id)?.name || "Necesidad no disponible"} · ${Number(offer.price).toLocaleString("es-AR")}
        </Text>
        <Text style={styles.helper}>{offer.is_active ? "Publicación activa" : "Publicación pausada"}</Text>
        <View style={styles.actions}>
          <Pressable disabled={saving} onPress={() => toggleOffer(offer)}>
            <Text style={styles.link}>{offer.is_active ? "Pausar" : "Reactivar"}</Text>
          </Pressable>
          <Pressable disabled={saving} onPress={() => removeOffer(offer)}><Text style={styles.delete}>Eliminar</Text></Pressable>
        </View>
      </View>)}
    <Pressable onPress={async () => {
      try { await signOut(); navigation.navigate("Home"); }
      catch (e) { Alert.alert("No se pudo salir", e.message); }
    }} style={styles.signOut}><Text style={styles.link}>Cerrar sesión</Text></Pressable>
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: COLORS.background },
  title: { fontSize: 25, fontWeight: "800", color: COLORS.text },
  helper: { fontSize: 13, lineHeight: 20, color: COLORS.textSecondary, marginTop: 5 },
  section: { fontSize: 18, fontWeight: "800", marginBottom: 12, color: COLORS.text },
  card: { padding: 16, borderRadius: RADIUS.md, borderColor: COLORS.border, borderWidth: 1, backgroundColor: COLORS.surface, marginTop: 18 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: COLORS.background, borderColor: COLORS.border, borderWidth: 1, borderRadius: RADIUS.md, padding: 12, color: COLORS.text },
  multiline: { minHeight: 76, textAlignVertical: "top" },
  needRow: { padding: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, marginBottom: 8 },
  needSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  needName: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  button: { backgroundColor: COLORS.primary, padding: 14, alignItems: "center", borderRadius: RADIUS.md, marginTop: 16 },
  buttonText: { fontWeight: "800", color: "white" },
  disabled: { opacity: 0.5 },
  offerTitle: { fontWeight: "800", fontSize: 15, color: COLORS.text },
  actions: { flexDirection: "row", justifyContent: "space-between", paddingTop: 12 },
  link: { color: COLORS.primary, fontWeight: "800", fontSize: 14 },
  delete: { color: COLORS.danger, fontWeight: "800", fontSize: 14 },
  signOut: { alignItems: "center", marginTop: 24, padding: 12 },
});
