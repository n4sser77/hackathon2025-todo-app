import type { TextStyle } from "react-native";
import { useThemeColor } from "./useThemeColor";

export interface TabScreenOptionsParams {
  title: string;
  tabBarLabel: string;
  tabBarAccessibilityLabel: string;
}

export function useTabScreenOptions({
  title,
  tabBarLabel,
  tabBarAccessibilityLabel,
}: TabScreenOptionsParams) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  // Explicitly type the style object as TextStyle
  const headerTitleStyle: TextStyle = {
    fontSize: 29,
    marginTop: 15,
    fontWeight: "bold",
    color: textColor,
    letterSpacing: 0.5,
    borderWidth: 0,
  };

  return {
    title,
    tabBarLabel,
    tabBarAccessibilityLabel,
    headerTitleStyle,
    headerTitleAlign: "left" as const,
    headerShown: true,
    headerStyle: {
      backgroundColor: backgroundColor,
      elevation: 0,
      shadowColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      shadowOpacity: 0,
    },
  };
}
