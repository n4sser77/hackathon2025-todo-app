import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "../hooks/useColorScheme";
import { useThemeColor } from "../hooks/useThemeColor";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const headerBg = useThemeColor({}, "background");
  const headerText = useThemeColor({}, "text");
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: headerBg },
          headerTintColor: headerText,
          headerTitleStyle: { color: headerText },
          headerShown: false,
        }}
      ></Stack>
    </ThemeProvider>
  );
}
