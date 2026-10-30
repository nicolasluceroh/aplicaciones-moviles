import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CARD_RADIUS, COLORS, RADIUS, SHADOW, TYPE } from "../constants/theme";

export default function FoundationCard({ foundation, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>
          {foundation.shortName || "FS"}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {foundation.name}
        </Text>

        <Text style={styles.location}>
          {foundation.location}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 10,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  logoText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  location: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  arrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
});
