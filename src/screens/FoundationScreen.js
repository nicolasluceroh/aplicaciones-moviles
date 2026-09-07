import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Importar products desde src/data/products.js (Punto 4)
import { products } from '../data/products';

export default function FoundationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* 1. Nombre de la fundación */}
      <Text style={styles.title}>Fundación Juguemos y Caminemos Juntos</Text>

      {/* 2. Subtítulo y descripción corta */}
      <Text style={styles.subtitle}>La Casita del Milagro</Text>
      <Text style={styles.description}>
        Espacio dedicado a brindar apoyo, contención y oportunidades a niños y familias de la comunidad.
      </Text>

      {/* 3. Título del catálogo */}
      <Text style={styles.sectionTitle}>Necesidades actuales</Text>

      {/* 5. Listado de productos usando FlatList */}
      <FlatList
        data={products || []}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron necesidades registradas.</Text>
        }
        renderItem={({ item }) => (
          /* 6. Cada tarjeta muestra nombre, precio y botón Ver producto */
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#2e7d32',
    marginVertical: 4,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
});