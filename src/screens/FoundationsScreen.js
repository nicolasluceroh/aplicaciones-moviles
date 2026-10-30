import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";
import { foundations } from "../data/foundations";
import BottomNav from "../components/BottomNav";
import FoundationCard from "../components/FoundationCard";

export default function FoundationsScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return foundations;

    return foundations.filter((foundation) =>
      [foundation.name, foundation.location, foundation.home]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [query]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Fundaciones de Pilar</Text>
          <Text style={styles.subtitle}>
            Organizaciones locales que acompañan a vecinos de la comunidad. Elegí una y
            conocé qué están necesitando hoy.
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nombre o ubicación"
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No encontramos fundaciones para "{query}".</Text>
          </View>
        ) : (
          filtered.map((foundation) => (
            <FoundationCard
              key={foundation.id}
              foundation={foundation}
              onPress={() => navigation.navigate("Foundation", { foundationId: foundation.id })}
            />
          ))
        )}
      </ScrollView>
      <BottomNav navigation={navigation} active="Foundations" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { padding: SPACING.md, paddingBottom: 24 },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: SPACING.md,
    marginBottom: 20,
    ...SHADOW.card,
  },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text },
  subtitle: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, marginTop: 6, lineHeight: 19 },
  searchWrap: { position: "relative", justifyContent: "center", marginBottom: 16 },
  searchIcon: { position: "absolute", left: 14, zIndex: 1 },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    paddingVertical: 11,
    paddingLeft: 40,
    paddingRight: 14,
    fontSize: 14,
    color: COLORS.text,
  },
  empty: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: { ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, textAlign: "center" },
});
