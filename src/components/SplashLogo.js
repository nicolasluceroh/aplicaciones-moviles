import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { COLORS, TYPE } from "../constants/theme";
import logoImage from "../assets/logo.png";
import bgOne from "../assets/splash-bg-1.jpg";
import bgTwo from "../assets/splash-bg-2.jpg";

const BACKGROUNDS = [bgOne, bgTwo];

/**
 * Pantalla de arranque animada: fotos reales de la web (hero-bg) de fondo,
 * con crossfade entre ellas, un velo oscuro para que se lea el logo, y el
 * logo con fade + escala suave arriba de todo.
 */
export default function SplashLogo() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const bgOpacities = useRef(BACKGROUNDS.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 5,
        bounciness: 10,
      }),
    ]).start();

    // Crossfade entre las fotos de fondo cada ~1.3s.
    const crossfades = BACKGROUNDS.slice(1).map((_, index) =>
      Animated.sequence([
        Animated.delay(1300 * (index + 1)),
        Animated.parallel([
          Animated.timing(bgOpacities[index], {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bgOpacities[index + 1], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    crossfades.forEach((anim) => anim.start());
  }, [opacity, scale, bgOpacities]);

  return (
    <View style={styles.container}>
      {BACKGROUNDS.map((source, index) => (
        <Animated.Image
          key={index}
          source={source}
          resizeMode="cover"
          style={[styles.bg, { opacity: bgOpacities[index] }]}
        />
      ))}
      <View style={styles.overlay} />

      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>Pilar de Sonrisas</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20,18,17,0.62)",
  },
  card: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingVertical: 28,
    paddingHorizontal: 36,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logo: {
    width: 72,
    height: 72,
  },
  brand: {
    ...TYPE.display,
    fontSize: 18,
    color: COLORS.text,
    marginTop: 14,
  },
});
