import { useTabScreenOptions } from "@/hooks/useTabScreenOptions";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function TabLayout() {
  const activeTint = useThemeColor({}, "tabIconSelected");
  const inactiveTint = useThemeColor({}, "tabIconDefault");
  const backgroundColor = useThemeColor({}, "background");
  const completedTabOptions = useTabScreenOptions({
    title: "Completed",
    tabBarLabel: "Completed",
    tabBarAccessibilityLabel: "Completed tab",
  });
  const todosTabOptions = useTabScreenOptions({
    title: "My Todos",
    tabBarLabel: "Home",
    tabBarAccessibilityLabel: "Home tab",
  });

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          if (route.name === "todos") {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            );
          }
          if (route.name === "completed") {
            return (
              <Ionicons
                name={focused ? "checkmark-done" : "checkmark-done-outline"}
                size={24}
                color={color}
              />
            );
          }
          return null;
        },
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 1,
          borderTopColor: backgroundColor,
          elevation: 0,
        },
      })}
    >
      <Tabs.Screen name="todos" options={todosTabOptions} />
      <Tabs.Screen name="completed" options={completedTabOptions} />
    </Tabs>
  );
}
