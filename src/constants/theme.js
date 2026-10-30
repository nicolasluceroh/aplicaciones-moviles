// Sistema de diseño de Pilar de Sonrisas.
// Paleta calcada de la web (pilar-sonrisas-web/src/index.css): coral (sol) +
// teal (monte) + ámbar (cielo), sobre fondo papel. Mismos nombres de
// variable de siempre (COLORS.primary, COLORS.secondary, etc.) para que
// ninguna pantalla tenga que cambiar su código — solo cambian los valores.

export const COLORS = {
  // Acento principal — acciones de donante, botones primarios (= "sol" web)
  primary: "#F46A4E",
  primarySoft: "#FDECE6",
  primaryDark: "#E0583B",

  // Acento de fundación — paneles y acciones del lado organización (= "monte" web)
  secondary: "#0D9488",
  secondarySoft: "#F0FDFA",
  secondaryDark: "#0B7B70",

  // Terciario — enlaces, info, mapas/ubicación (= "cielo" web)
  accent: "#F59E0B",
  accentSoft: "#FEF3C7",

  // Base
  background: "#FAFAF9",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F4",
  border: "#E7E5E4",
  borderStrong: "#D6D3D1",

  // Texto
  text: "#1C1917",
  textSecondary: "#78716C",
  textOnDark: "#FFFFFF",

  // Estado
  success: "#3D7A4B",
  successSoft: "#E1EDE3",
  warning: "#A8631A",
  warningSoft: "#F1E3CD",
  danger: "#A33C32",
  dangerSoft: "#F0DCD9",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Esquina asimétrica (más abierta arriba, más cerrada abajo) — la forma
// que repite la identidad de la app en cards, botones e inputs.
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  card: 20,
  cardTight: 12,
  pill: 999,
};

export const TYPE = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: "700", letterSpacing: -0.3 },
  h1: { fontSize: 22, lineHeight: 28, fontWeight: "700", letterSpacing: -0.2 },
  h2: { fontSize: 18, lineHeight: 23, fontWeight: "600" },
  body: { fontSize: 15, lineHeight: 21, fontWeight: "400" },
  bodyStrong: { fontSize: 15, lineHeight: 21, fontWeight: "600" },
  caption: { fontSize: 13, lineHeight: 17, fontWeight: "500" },
  button: { fontSize: 15, lineHeight: 20, fontWeight: "600", letterSpacing: 0.1 },
};

// Sombra real (antes definida pero nunca usada en las pantallas, por eso
// todo se sentía "flotando" sobre fondos casi del mismo tono). Se aplica
// con ...SHADOW.card en cada tarjeta principal de cada pantalla.
export const SHADOW = {
  card: {
    shadowColor: "#1C1917",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  raised: {
    shadowColor: "#1C1917",
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
};

// Esquina característica de las cards: abierta arriba, cerrada abajo.
export const CARD_RADIUS = {
  borderTopLeftRadius: RADIUS.card,
  borderTopRightRadius: RADIUS.card,
  borderBottomLeftRadius: RADIUS.cardTight,
  borderBottomRightRadius: RADIUS.cardTight,
};
