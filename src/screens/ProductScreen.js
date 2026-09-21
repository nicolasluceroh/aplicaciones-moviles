import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { products } from '../data/products';
import { COLORS } from '../constants/theme';
import { useCart } from '../context/EstadoCarrito';

export default function ProductScreen({ route, navigation }) {
  const { productId } = route.params || {};
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Producto no encontrado</Text>
      </View>
    );
  }

  const handleDonar = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleDonar}>
        <Text style={styles.buttonText}>Donar este producto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS?.background || '#FFF9F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS?.text || '#262626',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS?.primary || '#F2A65A',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: COLORS?.textSecondary || '#666666',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: COLORS?.success || '#5DA271',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});