import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextInput({ style, lightColor, darkColor, ...props }: ThemedTextInputProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <TextInput
      style={[
        styles.input,
        { backgroundColor, color, borderColor },
        style,
      ]}
      placeholderTextColor={color + '99'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    marginRight: 8,
    flex: 1,
  },
});
