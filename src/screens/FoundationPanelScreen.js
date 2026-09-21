import { useState, useRef } from "react";
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
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";

// Azul suave para las tarjetas de ubicación y necesidades.
// Se define acá para no modificar theme.js, que es un archivo compartido.
const SOFT_BLUE = "#E8F0F7";

// Datos simulados hasta que Nicolás conecte Supabase.
const SUMMARY = { donations: 12, needs: 4 };
const PUBLISHED_NEEDS = [
  { id: "1", name: "Kit escolar", pending: 10 },
  { id: "2", name: "Mochila escolar", pending: 5 },
];

export default function FoundationPanelScreen() {
  const foundation = foundations[0];

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const cameraRef = useRef(null);

  const handleOpenCamera = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) return;
    }
    setCameraOpen(true);
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
    setCameraOpen(false);
  };

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationError("Permiso de ubicación denegado.");
      setLoadingLocation(false);
      return;
    }

    try {
      const position = await Location.getCurrentPositionAsync({});
      setLocation(position.coords);
    } catch (error) {
      setLocationError("No se pudo obtener la ubicación.");
    }

    setLoadingLocation(false);
  };

  const handleManageNeeds = () => {
    Alert.alert(
      "Gestión de necesidades",
      "Esta sección se conectará con Supabase en una etapa posterior."
    );
  };

  // Vista de cámara a pantalla completa
  if (cameraOpen) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <View style={styles.cameraControls}>
          <Pressable style={styles.cameraSide} onPress={() => setCameraOpen(false)}>
            <Text style={styles.cameraCancel}>Cancelar</Text>
          </Pressable>
          <Pressable style={styles.shutter} onPress={handleTakePhoto}>
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.cameraSide} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Panel de fundación</Text>
      <Text style={styles.subtitle}>{foundation.name}</Text>

      {/* Resumen */}
      <View style={styles.metrics}>
        <View style={[styles.metric, { backgroundColor: COLORS.primarySoft }]}>
          <Text style={[styles.metricLabel, { color: COLORS.primary }]}>Donaciones</Text>
          <Text style={styles.metricValue}>{SUMMARY.donations}</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: SOFT_BLUE }]}>
          <Text style={[styles.metricLabel, { color: COLORS.secondary }]}>Necesidades</Text>
          <Text style={styles.metricValue}>{SUMMARY.needs}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Herramientas</Text>

      {/* Cámara */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.primarySoft }]}>
            <Text style={styles.icon}>📷</Text>
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Cámara</Text>
            <Text style={styles.cardText}>Registrá una imagen desde el dispositivo.</Text>
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

      {/* Ubicación */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: SOFT_BLUE }]}>
            <Text style={styles.icon}>📍</Text>
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Ubicación</Text>
            <Text style={styles.cardText}>Guardá o actualizá la ubicación actual.</Text>
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
        {PUBLISHED_NEEDS.map((need, index) => (
          <View
            key={need.id}
            style={[styles.needRow, index > 0 && styles.needRowSpacing]}
          >
            <Text style={styles.needName}>{need.name}</Text>
            <Text style={styles.needPending}>{need.pending} pendientes</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={handleManageNeeds}>
        <Text style={styles.primaryButtonText}>Gestionar necesidades</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },

  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 20 },

  metrics: { flexDirection: "row", gap: SPACING.sm },
  metric: { flex: 1, borderRadius: RADIUS.md, padding: 16 },
  metricLabel: { fontSize: 13, fontWeight: "700" },
  metricValue: { fontSize: 30, fontWeight: "800", color: COLORS.text, marginTop: 4 },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardHeaderText: { flex: 1, marginLeft: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  cardText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  photo: { width: "100%", height: 200, borderRadius: RADIUS.sm, marginTop: 14 },

  coords: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    padding: 12,
    marginTop: 14,
  },
  coordsText: { fontSize: 13, color: COLORS.text },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
    marginTop: 14,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },

  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 15,
    alignItems: "center",
    marginTop: 14,
  },
  secondaryButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: "800" },

  errorText: { color: COLORS.danger, fontSize: 13, marginTop: 10 },

  needRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  needRowSpacing: { marginTop: 12 },
  needName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  needPending: { fontSize: 14, fontWeight: "700", color: COLORS.primary },

  cameraScreen: { flex: 1, backgroundColor: "#000000" },
  camera: { flex: 1 },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  cameraSide: { width: 80 },
  cameraCancel: { color: "#FFFFFF", fontSize: 16 },
  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#FFFFFF" },
});
