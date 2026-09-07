
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/theme";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilar de Sonrisas</Text>

      <Text style={styles.subtitle}>
        Convertí una compra en una ayuda concreta
      </Text>

      <Pressable
        style={styles.foundationCard}
        onPress={() => navigation.navigate("Foundation")}
      >
        <Text style={styles.foundationTitle}>
          Fundación Juguemos y Caminemos Juntos
        </Text>

        <Text style={styles.foundationText}>
          La Casita del Milagro
        </Text>

        <Text style={styles.foundationAction}>
          Ver necesidades →
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.secondaryButtonText}>
          Acceso para fundaciones
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },

  foundationCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  foundationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },

  foundationText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },

  foundationAction: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  secondaryButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
  },
});
