import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPE } from "../constants/theme";
import PressableScale from "../components/PressableScale";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;

export default function ConfirmationScreen({ route, navigation }) {
  const donationId = route.params?.donationId;
  const total = route.params?.total;
  const shortId = donationId ? String(donationId).slice(0, 8).toUpperCase() : "";

  // Calca el efecto de la web (motion/react: scale 0.6 → 1 con spring) al
  // confirmar una donación.
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 9,
        bounciness: 14,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  const handleHome = () => {
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const handleHistory = () => {
    navigation.reset({ index: 0, routes: [{ name: "Donations" }] });
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[styles.iconCircle, { opacity, transform: [{ scale }] }]}
      >
        <Feather name="check" size={36} color={COLORS.surface} />
      </Animated.View>

      <Text style={styles.title}>¡Gracias por tu donación!</Text>
      <Text style={styles.text}>
        Tu ayuda ya quedó registrada y en camino a la fundación que elegiste. Vas a poder ver
        el detalle completo cuando quieras.
      </Text>

      {!!total && <Text style={styles.total}>{formatPrice(total)}</Text>}
      {!!shortId && <Text style={styles.id}>Referencia #{shortId}</Text>}

      <View style={styles.actions}>
        <PressableScale style={styles.secondaryButton} onPress={handleHistory}>
          <Feather name="list" size={16} color={COLORS.text} />
          <Text style={styles.secondaryButtonText}>Ver mis donaciones</Text>
        </PressableScale>

        <PressableScale style={styles.primaryButton} onPress={handleHome}>
          <Feather name="gift" size={16} color={COLORS.surface} />
          <Text style={styles.primaryButtonText}>Seguir donando</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: { ...TYPE.display, fontSize: 26, color: COLORS.text, textAlign: "center" },
  text: {
    ...TYPE.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    maxWidth: 320,
  },
  total: { ...TYPE.display, fontSize: 26, color: COLORS.text, marginTop: 20 },
  id: {
    ...TYPE.caption,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 28, width: "100%" },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
  },
  secondaryButtonText: { ...TYPE.button, fontSize: 13, color: COLORS.text },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
  },
  primaryButtonText: { ...TYPE.button, fontSize: 13, color: COLORS.surface },
});
