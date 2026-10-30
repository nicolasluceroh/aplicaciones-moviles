import { StyleSheet, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, TYPE } from "../constants/theme";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar producto...",
}) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={16} color={COLORS.textSecondary} style={styles.icon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    ...TYPE.body,
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 0,
  },
});
