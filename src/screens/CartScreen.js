import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { useCart } from '../context/EstadoCarrito';
import { foundations } from '../data/foundations'; // [{ id, name }, ...]

export default function CartScreen({ navigation }) {
  const {
    cart,
    totalItems,
    totalPrice,
    hasMissingFoundation,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    assignFoundation,
  } = useCart();

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);

  const abrirSelectorFundacion = (productId) => {
    setActiveProductId(productId);
    setSelectorVisible(true);
  };

  const elegirFundacion = (foundationId) => {
    assignFoundation(activeProductId, foundationId);
    setSelectorVisible(false);
    setActiveProductId(null);
  };

  const handleContinuar = () => {
    if (hasMissingFoundation) return;
    navigation.navigate('Checkout');
  };

  if (!cart || cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        <TouchableOpacity
          style={styles.botonSecundario}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.textoBotonSecundario}>Ver productos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const fundacionAsignada = foundations.find(
      (f) => f.id === item.foundationId
    );

    return (
      <View style={styles.card}>
        <Text style={styles.nombre}>{item.name}</Text>

        <View style={styles.filaCantidad}>
          <Text style={styles.etiqueta}>Cantidad</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => decreaseQuantity(item.id)}
            >
              <Text style={styles.stepperTexto}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValor}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => increaseQuantity(item.id)}
            >
              <Text style={styles.stepperTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Subtotal</Text>
          <Text style={styles.valor}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.fundacionSelector}
          onPress={() => abrirSelectorFundacion(item.id)}
        >
          <Text style={styles.etiqueta}>Fundación</Text>
          <Text
            style={[
              styles.valor,
              !fundacionAsignada && styles.valorAdvertencia,
            ]}
          >
            {fundacionAsignada ? fundacionAsignada.name : 'Seleccionar ⚠️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.eliminarBtn}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.eliminarTexto}>Eliminar producto</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tu carrito ({totalItems})</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {hasMissingFoundation && (
        <View style={styles.avisoContainer}>
          <Text style={styles.avisoTexto}>
            ⚠️ Asigná una fundación a cada producto para poder continuar.
          </Text>
        </View>
      )}

      <View style={styles.filaTotal}>
        <Text style={styles.tituloTotal}>Total</Text>
        <Text style={styles.montoTotal}>${totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.boton, hasMissingFoundation && styles.botonDeshabilitado]}
        onPress={handleContinuar}
        disabled={hasMissingFoundation}
      >
        <Text style={styles.textoBoton}>Continuar al checkout</Text>
      </TouchableOpacity>

      {/* Selector de fundación */}
      <Modal
        visible={selectorVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectorVisible(false)}
      >
        <Pressable
          style={styles.modalFondo}
          onPress={() => setSelectorVisible(false)}
        >
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Elegí una fundación</Text>
            {foundations.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={styles.opcionFundacion}
                onPress={() => elegirFundacion(f.id)}
              >
                <Text style={styles.opcionFundacionTexto}>{f.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: COLORS.text,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filaCantidad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  valorAdvertencia: {
    color: '#D97706',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stepperValor: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  fundacionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    marginTop: 6,
  },
  eliminarBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  eliminarTexto: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  avisoContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  avisoTexto: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '600',
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  botonDeshabilitado: {
    backgroundColor: '#A1A1AA',
  },
  textoBoton: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotonSecundario: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContenido: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  opcionFundacion: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  opcionFundacionTexto: {
    fontSize: 15,
    color: COLORS.text,
  },
});