import { StyleSheet, TextInput, View, Text } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar productos para donar...",
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>

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
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },

  icon: {
    fontSize: 22,
    color: COLORS.textSecondary,
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 0,
  },
});