import { useRef } from "react";
import { Animated, Pressable } from "react-native";

/**
 * Pressable con feedback táctil: se achica levemente al tocar y vuelve a
 * su tamaño al soltar. Envolvé cualquier botón principal con esto para
 * darle un poco de "vida" sin tocar la lógica del onPress.
 *
 * El `style` (color, padding, radio, flex, etc.) va en el Pressable para
 * no romper layouts en fila (flex: 1, gap); la escala se aplica a una
 * vista interna que ocupa todo el espacio y centra el contenido.
 */
export default function PressableScale({
  children,
  style,
  contentStyle,
  onPress,
  disabled,
  scaleTo = 0.96,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      style={style}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      {...rest}
    >
      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          },
          contentStyle,
          { transform: [{ scale }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
