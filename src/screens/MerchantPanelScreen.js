import { useCallback, useMemo, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/AuthContext";
import DropdownField from "../components/DropdownField";
import {
  getMerchantImageUrl, MAX_IMAGES, removeMerchantImages, uploadMerchantImages,
} from "../utils/merchantImages";

export default function MerchantPanelScreen({ navigation }) {
  const { user, profile, profileLoading, signOut } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedFoundationId, setSelectedFoundationId] = useState(null);
  const [selectedNeedId, setSelectedNeedId] = useState(null);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const scrollRef = useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Otros");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const permitted = Boolean(user && profile?.role === "merchant");

  const foundationName = useCallback((id) =>
    foundations.find((foundation) => foundation.id === id)?.name || `Fundación ${id}`, []);

  const loadData = useCallback(async () => {
    if (!permitted) { setLoading(false); return; }
    setLoading(true);
    try {
      const [needsResult, offersResult] = await Promise.all([
        supabase.from("foundation_needs").select("id, foundation_id, name, pending")
          .gt("pending", 0).order("name"),
        supabase.from("merchant_products")
          .select("id, need_id, name, description, price, category, image_paths, is_active, created_at")
          .eq("merchant_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (needsResult.error || offersResult.error) {
        throw needsResult.error || offersResult.error;
      }
      setNeeds(needsResult.data || []);
      setOffers(offersResult.data || []);
    } catch (error) {
      Alert.alert("No se pudieron cargar los datos", error.message || "Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [permitted, user?.id]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const foundationOptions = useMemo(() => [...new Set(needs.map((need) => need.foundation_id))]
    .map((id) => ({ value: id, label: foundationName(id) }))
    .sort((a, b) => a.label.localeCompare(b.label, "es")), [needs, foundationName]);
  const filteredNeeds = useMemo(() => needs.filter((need) =>
    need.foundation_id === selectedFoundationId), [needs, selectedFoundationId]);
  const needOptions = filteredNeeds.map((need) => ({
    value: need.id, label: `${need.name} · ${need.pending} pendientes`,
  }));
  const selectedNeed = filteredNeeds.find((need) => need.id === selectedNeedId);
  const editingLegacyWithoutPhotos = Boolean(editingId &&
    !(offers.find((offer) => offer.id === editingId)?.image_paths || []).length);

  const clearForm = () => {
    setEditingId(null);
    setImages([]);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Otros");
    setSelectedFoundationId(null);
    setSelectedNeedId(null);
  };

  const startEditing = (offer) => {
    const currentNeed = needs.find((need) => need.id === offer.need_id);
    setEditingId(offer.id);
    setSelectedFoundationId(currentNeed?.foundation_id || null);
    setSelectedNeedId(currentNeed?.id || null);
    setName(offer.name);
    setDescription(offer.description || "");
    setPrice(String(offer.price));
    setCategory(offer.category || "Otros");
    setImages((offer.image_paths || []).map((path) => ({
      path, uri: getMerchantImageUrl(path),
    })));
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const chooseImages = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      Alert.alert("Máximo de fotos", `Podés subir hasta ${MAX_IMAGES} fotos. Quitá una para agregar otra.`);
      return;
    }
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permiso requerido", "Habilitá el acceso a tus fotos para publicar productos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], allowsMultipleSelection: true, selectionLimit: remaining,
        quality: 0.7, base64: true,
      });
      if (!result.canceled) setImages((current) => [
        ...current, ...result.assets.slice(0, Math.max(0, MAX_IMAGES - current.length)),
      ]);
    } catch (error) {
      Alert.alert("No se pudieron seleccionar fotos", error.message || "Intentá nuevamente.");
    }
  };

  const saveProduct = async () => {
    const enteredPrice = price.trim();
    const normalizedPrice = enteredPrice.includes(",")
      ? Number(enteredPrice.replace(/\./g, "").replace(",", "."))
      : /^\d{1,3}(\.\d{3})+$/.test(enteredPrice)
        ? Number(enteredPrice.replace(/\./g, ""))
        : Number(enteredPrice);

    if (!selectedFoundationId || !selectedNeed || name.trim().length < 2 ||
        !Number.isFinite(normalizedPrice) || normalizedPrice <= 0 ||
        category.trim().length < 2 || (images.length === 0 && !editingLegacyWithoutPhotos)) {
      Alert.alert("Revisá los datos", "Elegí una fundación y su necesidad, agregá al menos una foto e ingresá producto, categoría y precio válido.");
      return;
    }

    const wasEditing = Boolean(editingId);
    const original = editingId ? offers.find((offer) => offer.id === editingId) : null;
    if (editingId && !original) {
      Alert.alert("Publicación no disponible", "Volvé a cargar tus publicaciones.");
      return;
    }
    setSaving(true);
    let uploaded = [];
    try {
      // Conservamos fotos existentes y subimos solamente las nuevas.
      const retainedPaths = images.filter((image) => !!image.path).map((image) => image.path);
      const newAssets = images.filter((image) => !image.path);
      uploaded = newAssets.length ? await uploadMerchantImages(user.id, newAssets) : [];
      const payload = {
        need_id: selectedNeed.id,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: normalizedPrice,
        image_paths: [...retainedPaths, ...uploaded],
      };
      const query = editingId
        ? supabase.from("merchant_products").update(payload)
            .eq("id", editingId).eq("merchant_id", user.id)
        : supabase.from("merchant_products").insert({ ...payload, merchant_id: user.id });
      const { data, error } = await query.select("id");
      if (error) throw error;
      if (!data?.length) throw new Error("La publicación no pudo guardarse. Revisá los permisos.");

      // Eliminamos fotos antiguas recién cuando la actualización en BD fue exitosa.
      const removedPaths = (original?.image_paths || []).filter((path) => !retainedPaths.includes(path));
      clearForm();
      await loadData();
      let photosPending = false;
      if (removedPaths.length) {
        try { await removeMerchantImages(removedPaths); }
        catch { photosPending = true; }
      }
      Alert.alert(wasEditing ? "Producto actualizado" : "Producto publicado",
        photosPending
          ? "Se guardó el producto, pero no se pudieron eliminar algunas fotos anteriores de Storage."
          : "Los cambios se guardaron correctamente.");
    } catch (error) {
      if (uploaded.length) {
        try { await removeMerchantImages(uploaded); } catch { /* Revisión manual en Storage. */ }
      }
      Alert.alert("No se pudo guardar", error.message || "Intentá nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const toggleOffer = async (offer) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("merchant_products")
        .update({ is_active: !offer.is_active }).eq("id", offer.id).eq("merchant_id", user.id);
      if (error) throw error;
      await loadData();
    } catch (error) {
      Alert.alert("No se pudo actualizar", error.message);
    } finally { setSaving(false); }
  };

  const removeOffer = (offer) => Alert.alert(
    "Eliminar publicación", `¿Eliminar «${offer.name}»?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        setSaving(true);
        try {
          const { error } = await supabase.from("merchant_products")
            .delete().eq("id", offer.id).eq("merchant_id", user.id);
          if (error) throw error;
          if (editingId === offer.id) clearForm();
          if (offer.image_paths?.length) {
            try { await removeMerchantImages(offer.image_paths); }
            catch { Alert.alert("Fotos pendientes", "El producto se eliminó, pero algunas fotos quedaron en Storage."); }
          }
          await loadData();
        } catch (error) {
          Alert.alert("No se pudo eliminar", error.message);
        } finally { setSaving(false); }
      } },
    ]
  );

  if (profileLoading || (loading && permitted && needs.length === 0 && offers.length === 0)) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
  }
  if (!permitted) {
    return <View style={styles.center}>
      <Text style={styles.title}>Acceso restringido</Text>
      <Text style={styles.helper}>Necesitás una cuenta habilitada como comercio.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Account")}>
        <Text style={styles.buttonText}>Ir a Mi cuenta</Text>
      </Pressable>
    </View>;
  }

  return <ScrollView ref={scrollRef} style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>{profile.business_name || "Panel de comercio"}</Text>
    <Text style={styles.helper}>Publicá productos reales vinculados a lo que necesitan las fundaciones.</Text>
    <Pressable disabled={saving} onPress={() => navigation.navigate("Profile")}>
      <Text style={[styles.link, styles.settingsLink]}>Configurar nombre del comercio</Text>
    </Pressable>
    <View style={styles.card}>
      <Text style={styles.section}>{editingId ? "Editar publicación" : "Nueva publicación"}</Text>
      {editingId && <Text style={styles.helper}>Actualizá la información y las fotos. Los cambios se reflejarán en el catálogo.</Text>}
      <DropdownField label="Fundación" placeholder="Elegí una fundación" options={foundationOptions}
        value={selectedFoundationId} disabled={saving}
        onChange={(id) => { setSelectedFoundationId(id); setSelectedNeedId(null); }} />
      <DropdownField label="Necesidad pendiente" placeholder={selectedFoundationId ? "Elegí una necesidad" : "Primero elegí una fundación"}
        options={needOptions} value={selectedNeedId} disabled={saving || !selectedFoundationId}
        onChange={setSelectedNeedId} />
      {needs.length === 0 && <Text style={styles.helper}>Todavía no hay necesidades pendientes publicadas.</Text>}
      <Text style={styles.label}>Nombre del producto</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName}
        editable={!saving} placeholder="Ej.: Mochila escolar azul" placeholderTextColor={COLORS.textSecondary} maxLength={120} />
      <Text style={styles.label}>Descripción</Text>
      <TextInput style={[styles.input, styles.multiline]} value={description}
        onChangeText={setDescription} editable={!saving} multiline
        placeholder="Material, tamaño, contenido, características..." placeholderTextColor={COLORS.textSecondary} maxLength={1000} />
      <Text style={styles.label}>Categoría</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory}
        editable={!saving} maxLength={60} placeholder="Ej.: Escolar" placeholderTextColor={COLORS.textSecondary} />
      <Text style={styles.label}>Precio (ARS)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice}
        editable={!saving} keyboardType="decimal-pad" placeholder="Ej.: 15000" placeholderTextColor={COLORS.textSecondary} />
      <Text style={styles.label}>Fotos del producto (1 a {MAX_IMAGES})</Text>
      {editingLegacyWithoutPhotos && <Text style={styles.helper}>
        Esta publicación anterior no tiene fotos. Podés agregarlas cuando quieras.
      </Text>}
      <Pressable style={[styles.photoButton, (saving || images.length >= MAX_IMAGES) && styles.disabled]}
        onPress={chooseImages} disabled={saving || images.length >= MAX_IMAGES}>
        <Text style={styles.link}>{images.length ? "Agregar otras fotos" : "Elegir fotos de la galería"}</Text>
      </Pressable>
      <View style={styles.photos}>
        {images.map((asset, index) => <View key={`${asset.uri}-${index}`} style={styles.photoItem}>
          <Image source={{ uri: asset.uri }} style={styles.thumbnail} resizeMode="cover" />
          <Pressable disabled={saving} accessibilityLabel={`Quitar foto ${index + 1}`}
            onPress={() => setImages((current) => current.filter((_, i) => i !== index))}>
            <Text style={styles.removePhoto}>Quitar</Text>
          </Pressable>
        </View>)}
      </View>
      <Pressable style={[styles.button, (saving || !selectedNeed || (!images.length && !editingLegacyWithoutPhotos)) && styles.disabled]}
        disabled={saving || !selectedNeed || (!images.length && !editingLegacyWithoutPhotos)} onPress={saveProduct}>
        <Text style={styles.buttonText}>{saving ? "Guardando..." : editingId ? "Guardar cambios" : "Publicar producto"}</Text>
      </Pressable>
      {editingId && <Pressable disabled={saving} onPress={clearForm} style={styles.cancelButton}>
        <Text style={styles.link}>Cancelar edición</Text>
      </Pressable>}
    </View>
    <Text style={[styles.section, styles.offersHeading]}>Mis publicaciones ({offers.length})</Text>
    {offers.length === 0 ? <Text style={styles.helper}>Todavía no publicaste productos.</Text> :
      offers.map((offer) => <View key={offer.id} style={styles.card}>
        <View style={styles.offerRow}>
          {offer.image_paths?.[0] && <Image source={{ uri: getMerchantImageUrl(offer.image_paths[0]) }}
            style={styles.thumbnail} />}
          <View style={styles.offerDetails}>
            <Text style={styles.offerTitle}>{offer.name}</Text>
            <Text style={styles.helper}>
              {needs.find((n) => n.id === offer.need_id)?.name || "Necesidad cerrada o eliminada"} · ${Number(offer.price).toLocaleString("es-AR")}
            </Text>
            <Text style={styles.helper}>{offer.is_active ? "Publicación activa" : "Publicación pausada"}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable disabled={saving} onPress={() => startEditing(offer)}>
            <Text style={styles.link}>Editar</Text>
          </Pressable>
          <Pressable disabled={saving} onPress={() => toggleOffer(offer)}>
            <Text style={styles.link}>{offer.is_active ? "Pausar" : "Reactivar"}</Text>
          </Pressable>
          <Pressable disabled={saving} onPress={() => removeOffer(offer)}>
            <Text style={styles.delete}>Eliminar</Text>
          </Pressable>
        </View>
      </View>)}
    <Pressable onPress={async () => {
      try { await signOut(); navigation.navigate("Home"); }
      catch (error) { Alert.alert("No se pudo salir", error.message); }
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
  offersHeading: { marginTop: 22, marginBottom: 3 },
  settingsLink: { marginTop: 12 },
  cancelButton: { alignItems: "center", paddingTop: 16 },
  card: { padding: 16, borderRadius: RADIUS.md, borderColor: COLORS.border, borderWidth: 1, backgroundColor: COLORS.surface, marginTop: 18 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: COLORS.background, borderColor: COLORS.border, borderWidth: 1, borderRadius: RADIUS.md, padding: 12, color: COLORS.text },
  multiline: { minHeight: 76, textAlignVertical: "top" },
  button: { backgroundColor: COLORS.primary, padding: 14, alignItems: "center", borderRadius: RADIUS.md, marginTop: 16 },
  buttonText: { fontWeight: "800", color: "white" },
  disabled: { opacity: 0.5 },
  photoButton: { borderColor: COLORS.border, borderWidth: 1, borderRadius: RADIUS.md, padding: 14, alignItems: "center" },
  photos: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  photoItem: { alignItems: "center", gap: 6 },
  removePhoto: { color: COLORS.danger, fontSize: 12, fontWeight: "700" },
  thumbnail: { width: 82, height: 82, borderRadius: RADIUS.sm, backgroundColor: COLORS.primarySoft },
  offerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  offerDetails: { flex: 1 },
  offerTitle: { fontWeight: "800", fontSize: 15, color: COLORS.text },
  actions: { flexDirection: "row", justifyContent: "space-around", paddingTop: 12, gap: 12 },
  link: { color: COLORS.primary, fontWeight: "800", fontSize: 14 },
  delete: { color: COLORS.danger, fontWeight: "800", fontSize: 14 },
  signOut: { alignItems: "center", marginTop: 24, padding: 12 },
});
