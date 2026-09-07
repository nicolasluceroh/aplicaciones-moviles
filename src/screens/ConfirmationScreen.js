import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

export default function ConfirmationScreen({ navigation }) {
  const handleVolver = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconoCirculo}>
          <Text style={styles.icono}>✓</Text>
        </View>

        <Text style={styles.titulo}>¡Gracias por tu donación!</Text>

        <Text style={styles.dato}>
          Tu aporte será destinado a la Fundación Juguemos y Caminemos Juntos.
        </Text>

        <View style={styles.estadoContainer}>
          <Text style={styles.estado}>Donación confirmada</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.boton} onPress={handleVolver}>
        <Text style={styles.textoBoton}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 30, alignItems: 'center', width: '100%', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  iconoCirculo: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  icono: { fontSize: 32, color: COLORS.surface, fontWeight: 'bold' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: COLORS.text, textAlign: 'center' },
  dato: { fontSize: 15, marginBottom: 20, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 21 },
  estadoContainer: { backgroundColor: COLORS.background, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  estado: { fontSize: 14, fontWeight: 'bold', color: COLORS.success },
  boton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', width: '100%' },
  textoBoton: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },
});