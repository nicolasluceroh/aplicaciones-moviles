import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPE } from "../constants/theme";

/**
 * Toast simple (sin librería nueva): se muestra arriba de la pantalla,
 * se desliza/desvanece y se oculta solo. Usalo con un ref:
 *
 *   const toastRef = useRef(null);
 *   toastRef.current?.show("Producto agregado al carrito");
 *   <Toast ref={toastRef} />
 */
const Toast = forwardRef(function Toast(_props, ref) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;
  const hideTimer = useRef(null);

  useImperativeHandle(ref, () => ({
    show(text, duration = 2200) {
      setMessage(text);
      setVisible(true);

      if (hideTimer.current) clearTimeout(hideTimer.current);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 6 }),
      ]).start();

      hideTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -16, duration: 200, useNativeDriver: true }),
        ]).start(() => setVisible(false));
      }, duration);
    },
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <Feather name="check-circle" size={16} color={COLORS.surface} />
      <Text style={styles.text} numberOfLines={2}>{message}</Text>
    </Animated.View>
  );
});

export default Toast;

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 54,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 50,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  text: { ...TYPE.body, fontSize: 13, color: COLORS.surface, flex: 1 },
});
