import { StyleSheet, Text, View, ScrollView } from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { foundations } from "../data/foundations";
import BottomNav from "../components/BottomNav";
import FoundationCard from "../components/FoundationCard";

export default function FoundationsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fundaciones</Text>
        <Text style={styles.subtitle}>
          Conocé las organizaciones que participan de Pilar de Sonrisas.
        </Text>

        {foundations.map((foundation) => (
          <FoundationCard
            key={foundation.id}
            foundation={foundation}
            onPress={() => navigation.navigate("Foundation", { foundationId: foundation.id })}
          />
        ))}
      </ScrollView>
      <BottomNav navigation={navigation} active="Foundations" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingTop: 46 },
  content: { padding: SPACING.md },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 5, marginBottom: 22 },
});
