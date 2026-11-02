import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";
import SkeletonBlock from "../components/SkeletonBlock";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;

export default function FoundationPanelScreen({ navigation }) {
  const { profile, profileLoading, signOut } = useAuth();
  const foundation = foundations.find((item) => item.id === profile?.foundation_id) || foundations[0];

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [summary, setSummary] = useState({ donations: 0, totalDonated: 0, needs: 0 });
  const [publishedNeeds, setPublishedNeeds] = useState([]);
  const [receivedItems, setReceivedItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [panelError, setPanelError] = useState(null);
  const cameraRef = useRef(null);

  const foundationId = profile?.foundation_id;
  const canAccess = ["foundation", "admin"].includes(profile?.role) && !!foundationId;

  const loadPanelData = useCallback(async ({ isRefresh = false } = {}) => {
    if (!foundationId || !canAccess) {
      setSummary({ donations: 0, totalDonated: 0, needs: 0 });
      setPublishedNeeds([]);
      setReceivedItems([]);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoadingData(true);
    setPanelError(null);

    const [itemsResult, needsResult] = await Promise.all([
      supabase
        .from("donation_items")
        .select("donation_id, product_name, quantity, unit_price")
        .eq("foundation_id", foundationId),
      supabase
        .from("foundation_needs")
        .select("id, name, pending")
        .eq("foundation_id", foundationId)
        .order("created_at", { ascending: true }),
    ]);

    if (itemsResult.error || needsResult.error) {
      setPanelError(
        itemsResult.error?.message ||
          needsResult.error?.message ||
          "No se pudieron cargar los datos del panel."
      );
      if (isRefresh) setRefreshing(false);
      else setLoadingData(false);
      return;
    }

    const items = itemsResult.data || [];
    const donationIds = new Set(items.map((item) => item.donation_id));
    const totalDonated = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
      0
    );
    const needs = needsResult.data || [];
    const activeNeeds = needs.filter((need) => need.pending > 0).length;

    setSummary({
      donations: donationIds.size,
      totalDonated,
      needs: activeNeeds,
    });
    setPublishedNeeds(needs);
    setReceivedItems(items);
    if (isRefresh) setRefreshing(false);
    else setLoadingData(false);
  }, [foundationId, canAccess]);

  useFocusEffect(
    useCallback(() => {
      loadPanelData();
    }, [loadPanelData])
  );

  const handleOpenCamera = async () => {
    try {
      if (!cameraPermission?.granted) {
        const result = await requestCameraPermission();
        if (!result.granted) return;
      }
      setCameraReady(false);
      setCameraOpen(true);
    } catch (error) {
      Alert.alert("No se pudo abrir la cámara", "Intentá de nuevo.");
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || !cameraReady) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setCameraOpen(false);
    } catch (error) {
      Alert.alert("No se pudo tomar la foto", "Intentá de nuevo.");
      setCameraOpen(false);
    }
  };

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permiso de ubicación denegado.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setLocation(position.coords);
    } catch (error) {
      setLocationError("No se pudo obtener la ubicación.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.reset({ index: 0, routes: [{ name: "Account" }] });
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  if (profileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!canAccess) {
    return (
      <View style={styles.centered}>
        <Text style={styles.accessTitle}>Acceso restringido</Text>
        <Text style={styles.accessText}>
          Esta cuenta no está habilitada como fundación o no tiene una fundación asociada.
        </Text>
        <Pressable style={styles.secondaryButton} onPress={handleLogout}>
          <Text style={styles.secondaryButtonText}>Volver a mi cuenta</Text>
        </Pressable>
      </View>
    );
  }

  if (cameraOpen) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          onCameraReady={() => setCameraReady(true)}
        />
        <View style={styles.cameraControls}>
          <Pressable style={styles.cameraSide} onPress={() => setCameraOpen(false)}>
            <Text style={styles.cameraCancel}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.shutter, !cameraReady && styles.shutterDisabled]}
            onPress={handleTakePhoto}
            disabled={!cameraReady}
          >
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.cameraSide} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadPanelData({ isRefresh: true })}
          tintColor={COLORS.secondary}
        />
      }
    >
      <View style={styles.topRow}>
        <View style={styles.topRowText}>
          <Text style={styles.title}>Panel de fundación</Text>
          <Text style={styles.subtitle}>{foundation?.name || "Fundación"}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={14} color={COLORS.danger} />
          <Text style={styles.logout}>Cerrar sesión</Text>
        </Pressable>
      </View>

      {panelError ? (
        <View style={styles.errorBox}>
          <Feather name="alert-triangle" size={18} color={COLORS.danger} />
          <Text style={styles.errorBoxText}>{panelError}</Text>
          <Pressable style={styles.secondaryButton} onPress={() => loadPanelData()}>
            <Text style={styles.secondaryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : loadingData ? (
        <View style={styles.metrics}>
          <SkeletonBlock height={78} radius={RADIUS.card} style={{ flex: 1 }} />
          <SkeletonBlock height={78} radius={RADIUS.card} style={{ flex: 1 }} />
          <SkeletonBlock height={78} radius={RADIUS.card} style={{ flex: 1 }} />
        </View>
      ) : (
        <View style={styles.metrics}>
          <View style={[styles.metric, { backgroundColor: COLORS.primarySoft }]}>
            <View style={styles.metricHeader}>
              <Feather name="heart" size={14} color={COLORS.primaryDark} />
              <Text style={[styles.metricLabel, { color: COLORS.primaryDark }]}>Donaciones</Text>
            </View>
            <Text style={styles.metricValue}>{summary.donations}</Text>
          </View>
          <View style={[styles.metric, { backgroundColor: COLORS.accentSoft }]}>
            <View style={styles.metricHeader}>
              <Feather name="trending-up" size={14} color={COLORS.warning} />
              <Text style={[styles.metricLabel, { color: COLORS.warning }]}>Total donado</Text>
            </View>
            <Text style={styles.metricValueSmall}>{formatPrice(summary.totalDonated)}</Text>
          </View>
          <View style={[styles.metric, { backgroundColor: COLORS.secondarySoft }]}>
            <View style={styles.metricHeader}>
              <Feather name="package" size={14} color={COLORS.secondaryDark} />
              <Text style={[styles.metricLabel, { color: COLORS.secondaryDark }]}>Necesidades</Text>
            </View>
            <Text style={styles.metricValue}>{summary.needs}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Donaciones recibidas</Text>

      <View style={styles.card}>
        {receivedItems.length === 0 ? (
          <Text style={styles.cardText}>Todavía no recibiste donaciones.</Text>
        ) : (
          receivedItems.map((item, index) => (
            <View
              key={`${item.donation_id}-${item.product_name}-${index}`}
              style={[styles.itemRow, index > 0 && styles.itemRowSpacing]}
            >
              <View style={styles.flex}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product_name}
                </Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemSubtotal}>
                {formatPrice(Number(item.quantity || 0) * Number(item.unit_price || 0))}
              </Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>Herramientas</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.secondarySoft }]}>
            <Feather name="camera" size={19} color={COLORS.secondaryDark} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Cámara</Text>
            <Text style={styles.cardText}>Probá la cámara del dispositivo.</Text>
          </View>
        </View>

        {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}

        <Pressable style={styles.secondaryFilledButton} onPress={handleOpenCamera}>
          <Feather name="camera" size={15} color={COLORS.surface} />
          <Text style={styles.secondaryFilledButtonText}>
            {photoUri ? "Sacar otra foto" : "Abrir cámara"}
          </Text>
        </Pressable>

        {cameraPermission && !cameraPermission.granted && !cameraPermission.canAskAgain && (
          <Text style={styles.errorText}>
            El permiso de cámara está bloqueado. Habilitalo desde la configuración del teléfono.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.accentSoft }]}>
            <Feather name="map-pin" size={19} color={COLORS.warning} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Ubicación</Text>
            <Text style={styles.cardText}>Verificá la ubicación actual del dispositivo.</Text>
          </View>
        </View>

        {location && (
          <View style={styles.coords}>
            <Text style={styles.coordsText}>Latitud: {location.latitude.toFixed(6)}</Text>
            <Text style={styles.coordsText}>Longitud: {location.longitude.toFixed(6)}</Text>
          </View>
        )}

        {locationError && <Text style={styles.errorText}>{locationError}</Text>}

        <Pressable
          style={styles.secondaryButton}
          onPress={handleGetLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator color={COLORS.secondary} />
          ) : (
            <>
              <Feather name="crosshair" size={15} color={COLORS.secondary} />
              <Text style={styles.secondaryButtonText}>
                {location ? "Actualizar ubicación" : "Obtener ubicación"}
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Necesidades publicadas</Text>

      <View style={styles.card}>
        {publishedNeeds.length === 0 ? (
          <Text style={styles.cardText}>Todavía no hay necesidades publicadas.</Text>
        ) : (
          publishedNeeds.map((need, index) => (
            <View
              key={need.id}
              style={[styles.needRow, index > 0 && styles.needRowSpacing]}
            >
              <Text style={styles.needName}>{need.name}</Text>
              <View style={[styles.needBadge, need.pending <= 0 && styles.needBadgeDone]}>
                <Text style={[styles.needPending, need.pending <= 0 && styles.needPendingDone]}>
                  {need.pending > 0 ? `${need.pending} pendientes` : "Sin pendientes"}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Pressable
        style={styles.secondaryFilledButton}
        onPress={() => navigation.navigate("FoundationNeeds")}
      >
        <Feather name="edit-3" size={15} color={COLORS.surface} />
        <Text style={styles.secondaryFilledButtonText}>Gestionar necesidades</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  centered: { flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center", padding: SPACING.lg },
  accessTitle: { ...TYPE.h1, color: COLORS.text },
  accessText: { ...TYPE.caption, color: COLORS.textSecondary, textAlign: "center", marginTop: 8 },
  topRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  topRowText: { flex: 1, paddingRight: 12 },
  logoutButton: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  logout: { ...TYPE.caption, fontSize: 12, color: COLORS.danger },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text },
  subtitle: { ...TYPE.body, fontSize: 13, color: COLORS.secondary, marginTop: 4, marginBottom: 20 },
  panelLoader: { marginVertical: 20 },
  errorBox: {
    backgroundColor: COLORS.dangerSoft,
    borderRadius: RADIUS.card,
    padding: 18,
    alignItems: "center",
    gap: 8,
  },
  errorBoxText: { ...TYPE.body, fontSize: 13, color: COLORS.danger, textAlign: "center" },
  metrics: { flexDirection: "row", gap: SPACING.sm },
  metric: { flex: 1, borderRadius: RADIUS.card, padding: 14, ...SHADOW.card },
  metricHeader: { flexDirection: "row", alignItems: "center", gap: 5 },
  metricLabel: { ...TYPE.caption, fontSize: 11, fontWeight: "700" },
  metricValue: { ...TYPE.display, fontSize: 26, color: COLORS.text, marginTop: 6 },
  metricValueSmall: { ...TYPE.display, fontSize: 16, color: COLORS.text, marginTop: 10 },
  sectionTitle: { ...TYPE.h1, fontSize: 17, color: COLORS.text, marginTop: 24, marginBottom: 12 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 16,
    marginBottom: 14,
    ...SHADOW.card,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardHeaderText: { flex: 1, marginLeft: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  cardTitle: { ...TYPE.h2, fontSize: 15, color: COLORS.text },
  cardText: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  photo: { width: "100%", height: 200, borderRadius: RADIUS.lg, marginTop: 14 },
  coords: { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.lg, padding: 12, marginTop: 14 },
  coordsText: { ...TYPE.caption, fontSize: 12, color: COLORS.text },
  secondaryFilledButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginTop: 14,
  },
  secondaryFilledButtonText: { ...TYPE.button, fontSize: 13, color: COLORS.surface },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginTop: 14,
  },
  secondaryButtonText: { ...TYPE.button, fontSize: 13, color: COLORS.secondary },
  errorText: { color: COLORS.danger, ...TYPE.caption, fontSize: 11, marginTop: 10 },
  needRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  needRowSpacing: { marginTop: 12 },
  needName: { flex: 1, ...TYPE.bodyStrong, fontSize: 13, color: COLORS.text, paddingRight: 10 },
  needBadge: {
    backgroundColor: COLORS.secondarySoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  needPending: { ...TYPE.bodyStrong, fontSize: 12, color: COLORS.secondaryDark },
  needBadgeDone: { backgroundColor: COLORS.surfaceAlt },
  needPendingDone: { color: COLORS.textSecondary },
  flex: { flex: 1, paddingRight: 10 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemRowSpacing: { marginTop: 12 },
  itemName: { ...TYPE.bodyStrong, fontSize: 13, color: COLORS.text },
  itemQty: { ...TYPE.caption, fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  itemSubtotal: { ...TYPE.bodyStrong, fontSize: 13, color: COLORS.text },
  cameraScreen: { flex: 1, backgroundColor: "#000000" },
  camera: { flex: 1 },
  cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 30 },
  cameraSide: { width: 80 },
  cameraCancel: { color: "#FFFFFF", fontSize: 16 },
  shutter: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  shutterDisabled: { opacity: 0.4 },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#FFFFFF" },
});
