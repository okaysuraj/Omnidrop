import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { BrutalColors, BrutalShadow } from '../../constants/theme';

export interface BrutalCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  bg?: string;
  shadow?: keyof typeof BrutalShadow;
  borderWidth?: number;
  className?: string;
  onPress?: () => void;
  activeOpacity?: number;
}

export function BrutalCard({
  children,
  style,
  bg = BrutalColors.white,
  shadow = 'md',
  borderWidth = 2,
  onPress,
  activeOpacity = 0.85,
}: BrutalCardProps) {
  const cardStyle = [
    {
      backgroundColor: bg,
      borderColor: BrutalColors.black,
      borderWidth,
    },
    BrutalShadow[shadow],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
