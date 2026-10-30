import { createContext, useCallback, useContext, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SHADOW, SPACING, TYPE } from "../constants/theme";

// Reemplazo de Alert.alert de React Native, que no se muestra de forma
// confiable en React Native Web (--web): esto rompía el feedback de
// "cuenta creada", errores de login, confirmación de checkout, etc. cuando
// se prueba la app desde el navegador. Mismo uso que Alert.alert:
// alert(titulo, mensaje, [{ text, onPress, style }]).
const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [state, setState] = useState(null);

  const alert = useCallback((title, message, buttons) => {
    const list = buttons && buttons.length > 0 ? buttons : [{ text: "OK" }];
    setState({ title, message, buttons: list });
  }, []);

  const close = () => setState(null);

  const handlePress = (button) => {
    close();
    // Mismo orden que Alert.alert: cerrar primero, ejecutar la acción después.
    if (button.onPress) setTimeout(button.onPress, 0);
  };

  return (
    <AlertContext.Provider value={alert}>
      {children}
      <Modal visible={!!state} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.card} onPress={() => {}}>
            {!!state?.title && <Text style={styles.title}>{state.title}</Text>}
            {!!state?.message && <Text style={styles.message}>{state.message}</Text>}
            <View style={styles.buttons}>
              {state?.buttons.map((button, index) => (
                <Pressable
                  key={`${button.text}-${index}`}
                  style={[
                    styles.button,
                    button.style === "cancel" && styles.buttonCancel,
                    index > 0 && styles.buttonSpacing,
                  ]}
                  onPress={() => handlePress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === "cancel" && styles.buttonTextCancel,
                      button.style === "destructive" && styles.buttonTextDestructive,
                    ]}
                  >
                    {button.text || "OK"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </AlertContext.Provider>
  );
}

export function useAppAlert() {
  const alert = useContext(AlertContext);
  if (!alert) {
    throw new Error("useAppAlert debe usarse dentro de <AlertProvider>.");
  }
  return alert;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(28,25,23,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 22,
    ...SHADOW.raised,
  },
  title: { ...TYPE.h1, fontSize: 17, color: COLORS.text },
  message: { ...TYPE.body, fontSize: 14, color: COLORS.textSecondary, marginTop: 10, lineHeight: 20 },
  buttons: { marginTop: 18, gap: 10 },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: COLORS.surfaceAlt,
  },
  buttonSpacing: {},
  buttonText: { ...TYPE.button, fontSize: 14, color: COLORS.surface },
  buttonTextCancel: { color: COLORS.textSecondary },
  buttonTextDestructive: { color: COLORS.danger },
});
