import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CartProvider } from './src/context/EstadoCarrito';

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";

import HomeScreen from "./src/screens/HomeScreen";
import FoundationsScreen from "./src/screens/FoundationsScreen";
import FoundationScreen from "./src/screens/FoundationScreen";
import CatalogScreen from "./src/screens/CatalogScreen";
import ProductScreen from "./src/screens/ProductScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import ConfirmationScreen from "./src/screens/ConfirmationScreen";
import DonationsScreen from "./src/screens/DonationsScreen";
import AccountScreen from "./src/screens/AccountScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import FoundationPanelScreen from "./src/screens/FoundationPanelScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import DonationDetailScreen from "./src/screens/DonationDetailScreen";
import FoundationNeedsScreen from "./src/screens/FoundationNeedsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
    <CartProvider>
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
    </CartProvider>
    );
}
