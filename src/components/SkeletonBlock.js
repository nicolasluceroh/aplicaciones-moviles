import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

/**
 * Bloque gris con "shimmer" (opacidad pulsante) para estados de carga,
 * en vez de un spinner seco. Sin librerías nuevas: solo Animated.
 *
 *   <SkeletonBlock width="60%" height={14} />
 *   <SkeletonBlock height={70} radius={RADIUS.card} style={{ marginTop: 8 }} />
 */
export default function SkeletonBlock({ width = "100%", height = 16, radius, style }) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: radius ?? RADIUS.lg, opacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: COLORS.surfaceAlt },
});
