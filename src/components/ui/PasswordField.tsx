import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from './InputField';
import { Colors } from '@/theme';
import type { ViewStyle } from 'react-native';

interface PasswordFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
}

export function PasswordField({
  label,
  placeholder = 'Mínimo de 6 caracteres',
  value,
  onChangeText,
  error,
  containerStyle,
  leftIcon,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <InputField
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      error={error}
      containerStyle={containerStyle}
      leftIcon={leftIcon}
      rightIcon={
        <TouchableOpacity
          onPress={() => setVisible(v => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={visible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({});

