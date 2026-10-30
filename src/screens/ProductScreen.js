import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import PressableScale from '../components/PressableScale';
import Toast from '../components/Toast';
import BottomNav from '../components/BottomNav';

export default function ProductScreen({ route, navigation }) {
  // 2. Extraemos tanto el objeto de CatalogScreen
  const { product: productParam, productId } = route.params || {};
  // 3. Buscamos el producto
  const product = productParam || products.find(p => p.id === productId) || {};
  const { addToCart } = useCart();
  // Estado local para manejar la cantidad de unidades (comienza en 1)
  const [quantity, setQuantity] = useState(1);
  const toastRef = useRef(null);

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
    addToCart(product, quantity);
    toastRef.current?.show(`Se agregaron ${quantity} unidad(es) al carrito.`);
  };
  return (
    <View style={styles.screen}>
      <Toast ref={toastRef} />
      <ScrollView contentContainerStyle={styles.content}>
      {product?.image ? (
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.emoji}>{product?.emoji || "🎁"}</Text>
        </View>
      )}
      <Text style={styles.category}>{product?.category}</Text>
      <Text style={styles.title}>{product?.name}</Text>
      <Text style={styles.price}>
        ${product?.price ? product.price.toLocaleString("es-AR") : "0"}
      </Text>
      <Text style={styles.description}>{product?.description}</Text>

      {/* Selector de cantidad */}
      <View style={styles.quantityContainer}>
        <View style={styles.qtyGroup}>
          <Pressable style={styles.qtyButton} onPress={handleDecrease}>
            <Feather name="minus" size={16} color={COLORS.text} />
          </Pressable>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <Pressable style={styles.qtyButton} onPress={handleIncrease}>
            <Feather name="plus" size={16} color={COLORS.text} />
          </Pressable>
        </View>

        <PressableScale style={styles.button} onPress={handleAdd}>
          <Feather name="shopping-bag" size={16} color={COLORS.textOnDark} />
          <Text style={styles.buttonText}>Agregar al carrito</Text>
        </PressableScale>
      </View>

      <Text style={styles.note}>
        La fundación destinataria se selecciona después, desde el carrito.
      </Text>
      </ScrollView>
      <BottomNav navigation={navigation} active="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: 230, borderRadius: RADIUS.card, backgroundColor: COLORS.surfaceAlt, marginBottom: 20 },
  imagePlaceholder: { height: 230, borderRadius: RADIUS.card, backgroundColor: COLORS.surfaceAlt, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emoji: { fontSize: 78 },
  category: { ...TYPE.caption, color: COLORS.textSecondary, fontSize: 13, fontWeight: "500" },
  title: { ...TYPE.display, fontSize: 24, color: COLORS.text, marginTop: 6 },
  price: { fontSize: 24, fontWeight: "700", color: COLORS.text, marginTop: 10 },
  description: { ...TYPE.body, fontSize: 15, lineHeight: 22, color: COLORS.textSecondary, marginTop: 16 },
  note: { ...TYPE.caption, fontSize: 12, color: COLORS.textSecondary, textAlign: "center", marginTop: 16 },
  /* Estilos para el selector de cantidad */
  quantityContainer: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 26 },
  qtyGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  qtyButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  qtyValue: { minWidth: 28, textAlign: "center", fontSize: 15, fontWeight: "600", color: COLORS.text },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
  },
  buttonText: { ...TYPE.button, color: COLORS.textOnDark, fontSize: 14 },
});
