import React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; 
import { COLORS } from '../constants/theme'; 
import { products } from '../data/products';

export default function CartScreen({ route, navigation }) { //Me deja mover entre pagians y me puedo mover entre si
  const productId = route.params?.productId || "1"; // Recibimos el productId, con "1" como respaldo si todavía no llega nada 
  const product = products.find((p) => p.id === productId); //Buscamos el producto que va en products.js

  const handleContinuar = () => { // Boton para avanzar por el CheckOut
    navigation.navigate("Checkout", { productId: product.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tu carrito</Text>

      <Text style={styles.nombre}>{product.name}</Text>
      <Text style={styles.dato}>Cantidad: 1</Text>
      <Text style={styles.dato}>Precio: ${product.price}</Text>
      <Text style={styles.dato}>Fundación: Juguemos y Caminemos juntos</Text>
      <Text style={styles.total}>Total: ${product.price}</Text>

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
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: COLORS.text,
  },
  nombre: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 10,
    color: COLORS.text,
  },
  dato: { 
    fontSize: 16, 
    marginBottom: 5,
    color: COLORS.textSecondary,
  },
  total: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 20,
    color: COLORS.text,
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
    fontWeight: 'bold' 
  },
});