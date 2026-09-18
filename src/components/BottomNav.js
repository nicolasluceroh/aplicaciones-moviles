import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { useCart } from "../context/CartContext";

const ITEMS = [
  { key: "Home", label: "Inicio", icon: "⌂" },
  { key: "Foundations", label: "Fundaciones", icon: "♡" },
  { key: "Cart", label: "Carrito", icon: "▣" },
  { key: "Donations", label: "Donaciones", icon: "✓" },
  { key: "Account", label: "Cuenta", icon: "○" },
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
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, selected && styles.selectedText]}>
                {item.icon}
              </Text>
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, selected && styles.selectedText]}>
              {item.label}
            </Text>
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
  },
  icon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  selectedText: {
    color: COLORS.primary,
    fontWeight: "700",
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
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
