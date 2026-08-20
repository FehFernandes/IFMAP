import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image, Animated, Platform } from "react-native";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Importar o ThemeProvider e useThemedStyles
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useThemedStyles } from "./hooks/useThemedStyles";

// Importar as telas
import MapScreen from "./screens/MapScreen";
import ContactsScreen from "./screens/ContactsScreen";
import NewsScreen from "./screens/NewsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import AccessibilityScreen from "./screens/AccessibilityScreen";

// Definir tipos para as rotas
type RootTabParamList = {
  Mapa: undefined;
  Contatos: undefined;
  Notícias: undefined;
  Configurações: undefined;
};

type RootStackParamList = {
  MainTabs: undefined;
  ContactUs: undefined;
  Accessibility: undefined;
};

// Previne que a splash nativa seja escondida automaticamente
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente de Tabs
function MainTabs() {
  const { colors, isDarkMode, getFontSize } = useThemedStyles();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Mapa") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Contatos") {
            iconName = focused ? "call" : "call-outline";
          } else if (route.name === "Notícias") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } else if (route.name === "Configurações") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode ? "#777" : "#9E9E9E",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 10,
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: isDarkMode ? 0.5 : 0.1,
          shadowRadius: 12,
          position: "absolute",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: getFontSize(12),
          fontWeight: "600",
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Contatos" component={ContactsScreen} />
      <Tab.Screen name="Notícias" component={NewsScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { colors, isDarkMode } = useThemedStyles();


  useEffect(() => {
    let mounted = true;

    const loadApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!mounted) return;

        // Animação de fade in do logo
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();

        // Aguardar mínimo de 1.5 segundos para mostrar o logo
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (!mounted) return;

        // Esconde a splash nativa do Expo
        await SplashScreen.hideAsync();

        // Fade out do splash customizado
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          if (mounted) {
            setIsLoading(false);
          }
        });
      } catch (error) {
        await SplashScreen.hideAsync().catch(() => {});
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadApp();

    // Timeout de segurança - força o carregamento após 5 segundos
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        SplashScreen.hideAsync().catch(() => {});
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
  }, [fadeAnim]);

  // Tela de Splash
  if (isLoading) {
    return (
      <View
        style={[styles.splashContainer, { backgroundColor: colors.background }]}
      >
        <Animated.View style={[styles.splashContent, { opacity: fadeAnim }]}>
          <Image
            source={require("./assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="Accessibility" component={AccessibilityScreen} />
      </Stack.Navigator>
      <StatusBar style={isDarkMode ? "light" : "auto"} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  // Estilos da Splash Screen
  splashContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
});
