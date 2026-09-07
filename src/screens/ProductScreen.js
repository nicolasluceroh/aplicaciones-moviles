import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { products } from '../data/products';

export default function ProductScreen({ route, navigation }) {
  // 1. Obtener el ID enviado desde la pantalla anterior
  const { productId } = route.params || {};

  // 2. Buscar el producto correspondiente en los datos
  const product = products.find((item) => item.id === productId);

  // Mensaje de respaldo por si no encuentra el producto
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Producto no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Detalle del producto */}
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Precio: ${product.price}</Text>
      <Text style={styles.description}>
        {product.description || 'Sin descripción disponible.'}
      </Text>

      {/* Botón para simular pedido */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cart', { product })}
      >
        <Text style={styles.buttonText}>Donar este producto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
