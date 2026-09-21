import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";

const SOFT_BLUE = "#E8F0F7";

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
  const [summary, setSummary] = useState({ donations: 0, needs: 0 });
  const [publishedNeeds, setPublishedNeeds] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const cameraRef = useRef(null);

  const foundationId = profile?.foundation_id;
  const canAccess = ["foundation", "admin"].includes(profile?.role) && !!foundationId;

  const loadPanelData = useCallback(async () => {
    if (!foundationId || !canAccess) {
      setSummary({ donations: 0, needs: 0 });
      setPublishedNeeds([]);
      return;
    }

    setLoadingData(true);

    const [itemsResult, needsResult] = await Promise.all([
      supabase
        .from("donation_items")
        .select("donation_id, quantity")
        .eq("foundation_id", foundationId),
      supabase
        .from("foundation_needs")
        .select("id, name, pending")
        .eq("foundation_id", foundationId)
        .order("created_at", { ascending: true }),
    ]);

    if (itemsResult.error) {
      Alert.alert("No se pudieron cargar las donaciones", itemsResult.error.message);
    }

    if (needsResult.error) {
      Alert.alert("No se pudieron cargar las necesidades", needsResult.error.message);
    }

    const donationIds = new Set((itemsResult.data || []).map((item) => item.donation_id));
    const needs = needsResult.data || [];

    setSummary({
      donations: donationIds.size,
      needs: needs.length,
    });
    setPublishedNeeds(needs);
    setLoadingData(false);
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View style={styles.topRowText}>
          <Text style={styles.title}>Panel de fundación</Text>
          <Text style={styles.subtitle}>{foundation?.name || "Fundación"}</Text>
        </View>
        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Cerrar sesión</Text>
        </Pressable>
      </View>

      {loadingData ? (
        <ActivityIndicator color={COLORS.primary} style={styles.panelLoader} />
      ) : (
        <View style={styles.metrics}>
          <View style={[styles.metric, { backgroundColor: COLORS.primarySoft }]}>
            <Text style={[styles.metricLabel, { color: COLORS.primary }]}>Donaciones</Text>
            <Text style={styles.metricValue}>{summary.donations}</Text>
          </View>
          <View style={[styles.metric, { backgroundColor: SOFT_BLUE }]}>
            <Text style={[styles.metricLabel, { color: COLORS.secondary }]}>Necesidades</Text>
            <Text style={styles.metricValue}>{summary.needs}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Herramientas</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.primarySoft }]}>
            <Text style={styles.icon}>📷</Text>
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Cámara</Text>
            <Text style={styles.cardText}>Probá la cámara del dispositivo.</Text>
          </View>
        </View>

        {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}

        <Pressable style={styles.primaryButton} onPress={handleOpenCamera}>
          <Text style={styles.primaryButtonText}>
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
          <View style={[styles.iconCircle, { backgroundColor: SOFT_BLUE }]}>
            <Text style={styles.icon}>📍</Text>
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
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.secondaryButtonText}>
              {location ? "Actualizar ubicación" : "Obtener ubicación"}
            </Text>
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
              <Text style={styles.needPending}>{need.pending} pendientes</Text>
            </View>
          ))
        )}
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate("FoundationNeeds")}
      >
        <Text style={styles.primaryButtonText}>Gestionar necesidades</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  centered: { flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center", padding: SPACING.lg },
  accessTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  accessText: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", lineHeight: 19, marginTop: 8 },
  topRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  topRowText: { flex: 1, paddingRight: 12 },
  logout: { fontSize: 12, fontWeight: "800", color: COLORS.danger, marginTop: 6 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 20 },
  panelLoader: { marginVertical: 20 },
  metrics: { flexDirection: "row", gap: SPACING.sm },
  metric: { flex: 1, borderRadius: RADIUS.md, padding: 16 },
  metricLabel: { fontSize: 13, fontWeight: "700" },
  metricValue: { fontSize: 30, fontWeight: "800", color: COLORS.text, marginTop: 4 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: COLORS.text, marginTop: 24, marginBottom: 12 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardHeaderText: { flex: 1, marginLeft: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  cardText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  photo: { width: "100%", height: 200, borderRadius: RADIUS.sm, marginTop: 14 },
  coords: { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, padding: 12, marginTop: 14 },
  coordsText: { fontSize: 13, color: COLORS.text },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 15, alignItems: "center", marginTop: 14 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  secondaryButton: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, padding: 15, alignItems: "center", marginTop: 14 },
  secondaryButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: "800" },
  errorText: { color: COLORS.danger, fontSize: 13, marginTop: 10 },
  needRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  needRowSpacing: { marginTop: 12 },
  needName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  needPending: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  cameraScreen: { flex: 1, backgroundColor: "#000000" },
  camera: { flex: 1 },
  cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 30 },
  cameraSide: { width: 80 },
  cameraCancel: { color: "#FFFFFF", fontSize: 16 },
  shutter: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  shutterDisabled: { opacity: 0.4 },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#FFFFFF" },
});
