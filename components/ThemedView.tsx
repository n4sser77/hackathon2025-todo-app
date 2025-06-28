import React from 'react';
import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  safeArea?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, safeArea = false, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  if (safeArea) {
    return <SafeAreaView style={[{ backgroundColor, flex: 1 }, style]} {...otherProps} />;
  }
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
