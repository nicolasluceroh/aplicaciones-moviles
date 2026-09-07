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

      <Text style={styles.nombre}>{product.name}</Text>
      <Text style={styles.total}>Total: ${product.price}</Text>

      <Text style={styles.subtitulo}>Método de pago</Text>
      <Text style={styles.dato}>Tarjeta de crédito/débito</Text>
      <Text style={styles.aviso}>Pago simulado para esta versión del prototipo</Text>

      <TouchableOpacity style={styles.boton} onPress={handleConfirmar}>
        <Text style={styles.textoBoton}>Confirmar donación</Text>
      </TouchableOpacity>
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
  },
  nombre: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: COLORS.text,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    color: COLORS.text,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: COLORS.text,
  },
  dato: {
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.textSecondary,
  },
  aviso: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 25,
    color: COLORS.textSecondary,
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