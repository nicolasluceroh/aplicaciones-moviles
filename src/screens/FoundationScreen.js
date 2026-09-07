import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { products } from '../data/products';
import { COLORS } from '../theme';

export default function FoundationScreen({ navigation }) {
  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Product", { productId: item.id })}
      >
        <Text style={styles.buttonText}>Ver producto</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fundación Juguemos y Caminemos Juntos</Text>
      <Text style={styles.subtitle}>La Casita del Milagro</Text>
      <Text style={styles.description}>
        Espacio dedicado a brindar apoyo, contención y oportunidades a niños y familias de la comunidad.
      </Text>

      <Text style={styles.sectionTitle}>Necesidades actuales</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS?.text || '#262626',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS?.primary || '#F2A65A',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: COLORS?.textSecondary || '#666666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS?.text || '#262626',
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: COLORS?.surface || '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS?.text || '#262626',
  },
  productPrice: {
    fontSize: 14,
    color: COLORS?.textSecondary || '#666666',
    marginVertical: 4,
  },
  button: {
    backgroundColor: COLORS?.primary || '#F2A65A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});