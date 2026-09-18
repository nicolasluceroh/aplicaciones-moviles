import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

export default function FoundationCard({ foundation, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>{foundation.shortName || "FS"}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{foundation.name}</Text>
        <Text style={styles.location}>{foundation.location}</Text>
        <Text style={styles.action}>Ver fundación →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoText: { fontWeight: "800", color: COLORS.primary },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  location: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  action: { fontSize: 12, fontWeight: "700", color: COLORS.primary, marginTop: 7 },
});
