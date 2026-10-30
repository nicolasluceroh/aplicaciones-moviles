import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CARD_RADIUS, COLORS, RADIUS, SHADOW, TYPE } from "../constants/theme";

export default function FoundationCard({ foundation, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.logo}>
        {foundation.logo ? (
          <Image source={foundation.logo} style={styles.logoImage} resizeMode="cover" />
        ) : (
          <Text style={styles.logoText}>
            {foundation.shortName || "FS"}
          </Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {foundation.name}
        </Text>

        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={COLORS.textSecondary} />
          <Text style={styles.location}>
            {foundation.location}
          </Text>
        </View>
      </View>

      <Feather name="chevron-right" size={20} color={COLORS.textSecondary} />
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
    borderColor: COLORS.borderStrong,
    padding: 14,
    marginBottom: 12,
    ...SHADOW.card,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.secondarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  logoText: {
    ...TYPE.caption,
    fontWeight: "700",
    color: COLORS.secondaryDark,
  },

  info: {
    flex: 1,
  },

  name: {
    ...TYPE.bodyStrong,
    fontSize: 14,
    color: COLORS.text,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  location: {
    ...TYPE.caption,
    fontSize: 11,
    lineHeight: 14,
    color: COLORS.textSecondary,
  },
});
