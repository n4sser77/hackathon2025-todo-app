import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { useColorScheme } from "../hooks/useColorScheme";
import { DatabaseProvider } from "./Services/DatabaseProvider";

export default function RootLayout() {

  // let isLoggedIn: boolean = true; // Placeholder for user authentication state

  const colorScheme = useColorScheme();
  return (
    <DatabaseProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* {isLoggedIn ? <Slot /> : <LoginScreen />} */}
        <Slot />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
