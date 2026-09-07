import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { products } from '../data/products';

export default function CheckoutScreen({ route, navigation }) {
  const productId = route.params?.productId || "1";
  const product = products.find((p) => p.id === productId);

  const handleConfirmar = () => {
    navigation.navigate("Confirmation");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Finalizar donación</Text>

      <View style={styles.card}>
        <Text style={styles.nombre}>{product.name}</Text>
        <View style={styles.filaTotal}>
          <Text style={styles.tituloTotal}>Total</Text>
          <Text style={styles.montoTotal}>${product.price}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitulo}>Método de pago</Text>
        <Text style={styles.dato}>Tarjeta de crédito/débito</Text>
        <Text style={styles.aviso}>Pago simulado para esta versión del prototipo</Text>
      </View>

      <TouchableOpacity style={styles.boton} onPress={handleConfirmar}>
        <Text style={styles.textoBoton}>Confirmar donación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: COLORS.background },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: COLORS.text },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  nombre: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: COLORS.text },
  filaTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tituloTotal: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  montoTotal: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  subtitulo: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: COLORS.text },
  dato: { fontSize: 15, marginBottom: 8, color: COLORS.textSecondary },
  aviso: { fontSize: 13, fontStyle: 'italic', color: COLORS.textSecondary },
  boton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  textoBoton: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },
});