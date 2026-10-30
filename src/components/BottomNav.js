import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPE } from "../constants/theme";
import { useCart } from "../context/CartContext";

// Cada ítem tiene un ícono "outline" (pestaña inactiva) y uno sólido
// (pestaña activa), para que se note de un vistazo en cuál estás parado.
const ITEMS = [
  { key: "Foundations", label: "Fundaciones", iconOutline: "location-outline", iconFilled: "location" },
  { key: "Cart", label: "Carrito", iconOutline: "bag-outline", iconFilled: "bag" },
  { key: "Home", label: "Inicio", iconOutline: "home-outline", iconFilled: "home", main: true },
  { key: "Donations", label: "Donaciones", iconOutline: "gift-outline", iconFilled: "gift" },
  { key: "Account", label: "Cuenta", iconOutline: "person-outline", iconFilled: "person" },
];

export default function BottomNav({ navigation, active }) {
  const { totalItems } = useCart();

  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const selected = item.key === active;
        const showBadge = item.key === "Cart" && totalItems > 0;

        return (
          <Pressable
            key={item.key}
            style={styles.item}
            onPress={() => navigation.navigate(item.key)}
          >
            <View
              style={[
                styles.iconWrap,
                item.main && styles.iconWrapMain,
                item.main && selected && styles.iconWrapMainSelected,
              ]}
            >
              <Ionicons
                name={selected ? item.iconFilled : item.iconOutline}
                size={item.main ? 21 : 19}
                color={
                  item.main
                    ? selected
                      ? COLORS.surface
                      : COLORS.primaryDark
                    : selected
                    ? COLORS.primary
                    : COLORS.textSecondary
                }
              />
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                selected && styles.selectedText,
                item.main && styles.labelMain,
              ]}
            >
              {item.label}
            </Text>
            {!item.main && (
              <View style={[styles.activeDot, selected && styles.activeDotVisible]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 10,
  },
  item: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapMain: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primarySoft,
    marginTop: -18,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  iconWrapMainSelected: {
    backgroundColor: COLORS.primary,
  },
  label: {
    ...TYPE.caption,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 3,
    color: COLORS.textSecondary,
  },
  labelMain: {
    marginTop: 4,
    fontWeight: "700",
  },
  selectedText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
    backgroundColor: "transparent",
  },
  activeDotVisible: {
    backgroundColor: COLORS.primary,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -11,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.danger,
  },
  badgeText: {
    color: COLORS.textOnDark,
    fontSize: 10,
    fontWeight: "700",
  },
});
