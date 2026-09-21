import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-AR")}`;

export default function ConfirmationScreen({ route, navigation }) {
  const donationId = route.params?.donationId;
  const total = route.params?.total;

  const handleHome = () => {
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const handleHistory = () => {
    navigation.reset({ index: 0, routes: [{ name: "Donations" }] });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>¡Gracias por tu donación!</Text>
        <Text style={styles.text}>
          La donación quedó confirmada y guardada en tu cuenta.
        </Text>

        {!!total && <Text style={styles.total}>{formatPrice(total)}</Text>}
        {!!donationId && (
          <Text style={styles.id}>ID {String(donationId).slice(0, 8).toUpperCase()}</Text>
        )}
      </View>

      <Pressable style={styles.button} onPress={handleHistory}>
        <Text style={styles.buttonText}>Ver mis donaciones</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleHome}>
        <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  iconoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  icono: {
    fontSize: 56,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 6,
  },
  estado: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.success || '#5DA271',
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  filaFundacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nombreFundacion: {
    fontSize: 14,
    color: COLORS.text,
    flexShrink: 1,
  },
  montoFundacion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  separador: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 12,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  etiqueta: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  valor: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  montoTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  boton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
