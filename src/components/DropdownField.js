import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

// Desplegable local: no necesita dependencias nativas adicionales.
export default function DropdownField({ label, placeholder, options, value, onChange, disabled = false }) {
  const [expanded, setExpanded] = useState(false);
  const selected = options.find((option) => option.value === value);

  return <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ expanded, disabled }}
      disabled={disabled || options.length === 0}
      style={[styles.trigger, (disabled || options.length === 0) && styles.disabled]}
      onPress={() => setExpanded((current) => !current)}>
      <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
        {selected?.label || placeholder}
      </Text>
      <Text style={styles.chevron}>{expanded ? "⌃" : "⌄"}</Text>
    </Pressable>
    {expanded && !disabled && <ScrollView nestedScrollEnabled style={styles.menu} keyboardShouldPersistTaps="always">
      {options.map((option) => <Pressable key={String(option.value)} style={styles.option}
        onPress={() => { onChange(option.value); setExpanded(false); }}>
        <Text style={[styles.value, option.value === value && styles.active]}>{option.label}</Text>
      </Pressable>)}
    </ScrollView>}
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  trigger: { padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.background, borderWidth: 1, borderRadius: RADIUS.md, borderColor: COLORS.border },
  disabled: { opacity: 0.5 },
  value: { color: COLORS.text, fontSize: 14, flexShrink: 1 },
  placeholder: { color: COLORS.textSecondary },
  chevron: { color: COLORS.primary, fontSize: 18, marginLeft: 10 },
  menu: { maxHeight: 180, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, marginTop: 4, backgroundColor: COLORS.surface },
  option: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  active: { color: COLORS.primary, fontWeight: "700" },
});
