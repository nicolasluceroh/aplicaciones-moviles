import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilar de Sonrisas</Text>

      <Text style={styles.subtitle}>
        Convertí una compra en una ayuda concreta
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Foundation")}
      >
        <Text style={styles.buttonText}>
          Juguemos y Caminemos Juntos
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text>Acceso para fundaciones</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#F2A65A",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },

  buttonText: {
    fontWeight: "bold",
  },

  secondaryButton: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
  },
});