import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome6';

const ICON_MAP = {
  'house.fill': { component: MaterialIcons, name: 'home' },
  'dumbbell.fill': { component: FontAwesome, name: 'dumbbell' },
  'autograph.fill': { component: MaterialIcons, name: 'auto-graph' },
  'paperplane.fill': { component: FontAwesome, name: 'send' },
  'chevron.left.forwardslash.chevron.right': { component: MaterialIcons, name: 'code' },
  'chevron.right': { component: MaterialIcons, name: 'chevron-right' },
};

export type IconSymbolName = keyof typeof ICON_MAP;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: 'light' | 'medium' | 'bold';
}) {
  const IconComponent = ICON_MAP[name].component;
  const iconName = ICON_MAP[name].name;

  return <IconComponent name={iconName} size={size} color={color} style={style} weight={weight} />;
}