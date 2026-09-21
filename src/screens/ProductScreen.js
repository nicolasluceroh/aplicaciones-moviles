import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { products } from '../data/products'; 

export default function ProductScreen({ route, navigation }) {
  // 2. Extraemos tanto el objeto de CatalogScreen
  const { product: productParam, productId } = route.params || {};

  // 3. Buscamos el producto
  const product = productParam || products.find(p => p.id === productId) || {};
  const { addToCart } = useCart();

  // Estado local para manejar la cantidad de unidades (comienza en 1)
  const [quantity, setQuantity] = useState(1);

  // Función para disminuir la cantidad (con límite mínimo de 1)
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Función para incrementar la cantidad de unidades
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  // Función para agregar el producto al carrito global enviando la cantidad seleccionada
  const handleAdd = () => {
    addToCart({ ...product, quantity });
    Alert.alert("Producto agregado", `Se agregaron ${quantity} unidad(es) al carrito de donaciones.`, [
      { text: "Seguir mirando" },
      { text: "Ver carrito", onPress: () => navigation.navigate("Cart") },
    ]);
  };
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.emoji}>{product?.emoji || "🎁"}</Text>
      </View>
      <Text style={styles.category}>{product?.category}</Text>
      <Text style={styles.title}>{product?.name}</Text>
      <Text style={styles.price}>
        ${product?.price ? product.price.toLocaleString("es-AR") : "0"}
      </Text>
      <Text style={styles.description}>{product?.description}</Text>
      
      {/* Selector de cantidad */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Cantidad:</Text>
        <View style={styles.quantityControls}>
          <Pressable style={styles.qtyButton} onPress={handleDecrease}>
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <Pressable style={styles.qtyButton} onPress={handleIncrease}>
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar al carrito</Text>
      </Pressable>

      <Text style={styles.note}>
        La fundación destinataria se selecciona después, desde el carrito.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  imagePlaceholder: { height: 230, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  emoji: { fontSize: 78 },
  category: { fontSize: 12, color: COLORS.secondary, fontWeight: "700" },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text, marginTop: 4 },
  price: { fontSize: 24, fontWeight: "800", color: COLORS.primary, marginTop: 10 },
  description: { fontSize: 15, lineHeight: 22, color: COLORS.textSecondary, marginTop: 16 },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: RADIUS.md, alignItems: "center", marginTop: 26 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  note: { fontSize: 12, color: COLORS.textSecondary, textAlign: "center", marginTop: 12 },
/* Estilos para el selector de cantidad */
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, backgroundColor: COLORS.surface, padding: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  quantityLabel: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  qtyButton: { width: 32, height: 32, backgroundColor: COLORS.primarySoft || "#E0E0E0", borderRadius: RADIUS.sm, alignItems: "center", justifyContent: "center" },
  qtyButtonText: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  qtyValue: { marginHorizontal: 16, fontSize: 16, fontWeight: "800", color: COLORS.text },
});
