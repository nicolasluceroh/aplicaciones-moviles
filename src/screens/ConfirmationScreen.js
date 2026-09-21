import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { COLORS } from '../constants/theme';
import { useCart } from '../context/EstadoCarrito';
import { foundations } from '../data/foundations';

export default function ConfirmationScreen({ navigation }) {
  const { lastOrder } = useCart();

  const nombreFundacion = (foundationId) =>
    foundations.find((f) => f.id === foundationId)?.name ?? 'Sin asignar';

  // Agrupar montos donados por fundación, para el resumen final
  const resumenPorFundacion = React.useMemo(() => {
    if (!lastOrder) return [];
    const mapa = {};
    lastOrder.items.forEach((item) => {
      const key = item.foundationId;
      const monto = item.price * item.quantity;
      if (!mapa[key]) {
        mapa[key] = { foundationId: key, total: 0 };
      }
      mapa[key].total += monto;
    });
    return Object.values(mapa);
  }, [lastOrder]);

  const handleVolverInicio = () => {
    navigation.navigate('Home');
  };

  if (!lastOrder) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>No hay donaciones recientes</Text>
        <TouchableOpacity style={styles.boton} onPress={handleVolverInicio}>
          <Text style={styles.textoBoton}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconoContainer}>
        <Text style={styles.icono}>✅</Text>
      </View>

      <Text style={styles.titulo}>¡Gracias por tu donación!</Text>
      <Text style={styles.estado}>Donación confirmada</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Fundaciones beneficiadas</Text>

        <FlatList
          data={resumenPorFundacion}
          keyExtractor={(item) => String(item.foundationId)}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.filaFundacion}>
              <Text style={styles.nombreFundacion}>
                {nombreFundacion(item.foundationId)}
              </Text>
              <Text style={styles.montoFundacion}>
                ${item.total.toFixed(2)}
              </Text>
            </View>
          )}
        />

        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Productos donados</Text>
          <Text style={styles.valor}>{lastOrder.totalItems}</Text>
        </View>

        <View style={styles.filaTotal}>
          <Text style={styles.tituloTotal}>Total donado</Text>
          <Text style={styles.montoTotal}>
            ${lastOrder.totalPrice.toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.boton} onPress={handleVolverInicio}>
        <Text style={styles.textoBoton}>Volver al inicio</Text>
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
  iconoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  icono: {
    fontSize: 56,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 6,
  },
  estado: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.success || '#5DA271',
    marginBottom: 24,
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
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  filaFundacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nombreFundacion: {
    fontSize: 14,
    color: COLORS.text,
    flexShrink: 1,
  },
  montoFundacion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  separador: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 12,
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