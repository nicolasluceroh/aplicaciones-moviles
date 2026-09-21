import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { useCart } from '../context/EstadoCarrito';
import { foundations } from '../data/foundations';

export default function CheckoutScreen({ navigation }) {
  const { cart, totalItems, totalPrice, confirmOrder } = useCart();
  const [procesando, setProcesando] = useState(false);

  const nombreFundacion = (foundationId) =>
    foundations.find((f) => f.id === foundationId)?.name ?? 'Sin asignar';

  const handleConfirmarDonacion = () => {
    setProcesando(true);
    // Pago simulado: no hay integración real, solo delay artificial para UX
    setTimeout(() => {
      setProcesando(false);
      confirmOrder();
      navigation.navigate('Confirmation');
    }, 1200);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemNombre}>{item.name}</Text>
        <Text style={styles.itemFundacion}>
          Fundación: {nombreFundacion(item.foundationId)}
        </Text>
      </View>
      <View style={styles.itemDerecha}>
        <Text style={styles.itemCantidad}>x{item.quantity}</Text>
        <Text style={styles.itemSubtotal}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Checkout</Text>

      <Text style={styles.subtitulo}>Resumen de tu donación</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.lista}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
      />

      <View style={styles.card}>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Productos</Text>
          <Text style={styles.valor}>{totalItems}</Text>
        </View>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Método de pago</Text>
          <Text style={styles.valor}>Pago simulado</Text>
        </View>

        <View style={styles.separadorGrueso} />

        <View style={styles.filaTotal}>
          <Text style={styles.tituloTotal}>Total</Text>
          <Text style={styles.montoTotal}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.boton, procesando && styles.botonDeshabilitado]}
        onPress={handleConfirmarDonacion}
        disabled={procesando}
      >
        {procesando ? (
          <ActivityIndicator color={COLORS.surface} />
        ) : (
          <Text style={styles.textoBoton}>Confirmar donación</Text>
        )}
      </TouchableOpacity>
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
    marginBottom: 4,
    color: COLORS.text,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  lista: {
    maxHeight: 240,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
  },
  itemNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemFundacion: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemDerecha: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemCantidad: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  separador: {
    height: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  },
  separadorGrueso: {
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
  botonDeshabilitado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});