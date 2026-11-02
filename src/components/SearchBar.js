import { StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, TYPE } from "../constants/theme";

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