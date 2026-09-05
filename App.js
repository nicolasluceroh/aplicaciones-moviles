import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import FoundationScreen from "./src/screens/FoundationScreen";
import ProductScreen from "./src/screens/ProductScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import ConfirmationScreen from "./src/screens/ConfirmationScreen";
import LoginScreen from "./src/screens/LoginScreen";
import FoundationPanelScreen from "./src/screens/FoundationPanelScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Pilar de Sonrisas" }}
        />

        <Stack.Screen
          name="Foundation"
          component={FoundationScreen}
          options={{ title: "Fundación" }}
        />

        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{ title: "Producto" }}
        />

        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: "Carrito" }}
        />

        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: "Finalizar donación" }}
        />

        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{ title: "Donación realizada" }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Acceso Fundación" }}
        />

        <Stack.Screen
          name="FoundationPanel"
          component={FoundationPanelScreen}
          options={{ title: "Panel Fundación" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}