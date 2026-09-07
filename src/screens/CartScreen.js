import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { products } from '../data/products';

export default function CartScreen({ route, navigation }) {
  const productId = route.params?.productId || "1";
  const product = products.find((p) => p.id === productId);

  const handleContinuar = () => {
    navigation.navigate("Checkout", { productId: product.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tu carrito</Text>

      <View style={styles.card}>
        <Text style={styles.nombre}>{product.name}</Text>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Cantidad</Text>
          <Text style={styles.valor}>1</Text>
        </View>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Precio</Text>
          <Text style={styles.valor}>${product.price}</Text>
        </View>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Fundación</Text>
          <Text style={styles.valor}>Juguemos y Caminemos Juntos</Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.filaTotal}>
          <Text style={styles.tituloTotal}>Total</Text>
          <Text style={styles.montoTotal}>${product.price}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.boton} onPress={handleContinuar}>
        <Text style={styles.textoBoton}>Continuar</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
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
  nombre: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: COLORS.text,
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
    flexShrink: 1,
    textAlign: 'right',
  },
  separador: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 12,
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