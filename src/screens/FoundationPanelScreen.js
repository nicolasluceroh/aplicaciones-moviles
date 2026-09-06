import { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { COLORS } from "../constants/theme";

export default function FoundationPanelScreen() {
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
      if (!result.granted) {
        setLocationError(null);
        return;
      }
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

  // Vista de cámara a pantalla completa
  if (cameraOpen) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <View style={styles.cameraControls}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => setCameraOpen(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable style={styles.shutterButton} onPress={handleTakePhoto}>
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.cancelButton} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Panel de la Fundación</Text>

      <Text style={styles.subtitle}>
        Registrá la recepción de donaciones con una foto y la ubicación de tu
        sede
      </Text>

      {/* Sección cámara */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Foto de la donación</Text>

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <Text style={styles.cardText}>Todavía no sacaste ninguna foto.</Text>
        )}

        <Pressable style={styles.button} onPress={handleOpenCamera}>
          <Text style={styles.buttonText}>
            {photoUri ? "Sacar otra foto" : "Abrir cámara"}
          </Text>
        </Pressable>

        {cameraPermission && !cameraPermission.granted && !cameraPermission.canAskAgain && (
          <Text style={styles.errorText}>
            El permiso de cámara está bloqueado. Habilitalo desde la
            configuración del teléfono.
          </Text>
        )}
      </View>

      {/* Sección ubicación */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ubicación de la sede</Text>

        {location ? (
          <View style={styles.locationBox}>
            <Text style={styles.cardText}>
              Latitud: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.cardText}>
              Longitud: {location.longitude.toFixed(6)}
            </Text>
          </View>
        ) : (
          <Text style={styles.cardText}>
            Todavía no registraste la ubicación.
          </Text>
        )}

        {locationError && <Text style={styles.errorText}>{locationError}</Text>}

        <Pressable
          style={styles.button}
          onPress={handleGetLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.buttonText}>
              {location ? "Actualizar ubicación" : "Obtener ubicación"}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EFE7DC",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },

  cardText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  locationBox: {
    marginBottom: 4,
  },

  photo: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 14,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
    color: COLORS.text,
  },

  errorText: {
    color: "#C0392B",
    fontSize: 13,
    marginTop: 10,
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

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

  cancelButton: {
    width: 80,
  },

  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
  },

  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },

  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFF",
  },
});
