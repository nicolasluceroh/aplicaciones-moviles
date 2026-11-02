import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { AlertProvider } from "./src/components/AppAlert";
import SplashLogo from "./src/components/SplashLogo";
import HomeScreen from "./src/screens/HomeScreen";
import FoundationsScreen from "./src/screens/FoundationsScreen";
import FoundationScreen from "./src/screens/FoundationScreen";
import CatalogScreen from "./src/screens/CatalogScreen";
import ProductScreen from "./src/screens/ProductScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import ConfirmationScreen from "./src/screens/ConfirmationScreen";
import DonationsScreen from "./src/screens/DonationsScreen";
import DonationDetailScreen from "./src/screens/DonationDetailScreen";
import AccountScreen from "./src/screens/AccountScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import FoundationPanelScreen from "./src/screens/FoundationPanelScreen";
import FoundationNeedsScreen from "./src/screens/FoundationNeedsScreen";
import MerchantPanelScreen from "./src/screens/MerchantPanelScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { loading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1600);
    return () => clearTimeout(timer);
  }, []);
  if (loading || !splashDone) return <SplashLogo />;

  // Se conserva el acceso público a Inicio/Catálogo. Cada panel valida su rol.
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Foundations" component={FoundationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Donations" component={DonationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: "Productos" }} />
      <Stack.Screen name="Product" component={ProductScreen} options={{ title: "Producto" }} />
      <Stack.Screen name="Foundation" component={FoundationScreen} options={{ title: "Fundación" }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Finalizar donación" }} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DonationDetail" component={DonationDetailScreen} options={{ title: "Detalle de donación" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Mis datos" }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Iniciar sesión" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Crear cuenta" }} />
      <Stack.Screen name="FoundationPanel" component={FoundationPanelScreen} options={{ title: "Panel Fundación" }} />
      <Stack.Screen name="FoundationNeeds" component={FoundationNeedsScreen} options={{ title: "Gestionar necesidades" }} />
      <Stack.Screen name="MerchantPanel" component={MerchantPanelScreen} options={{ title: "Panel Comercio" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return <AuthProvider><CartProvider><AlertProvider>
    <NavigationContainer><RootNavigator /></NavigationContainer>
  </AlertProvider></CartProvider></AuthProvider>;
}
