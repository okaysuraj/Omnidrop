import { Text, View, ViewStyle } from 'react-native';
import { BrutalColors } from '../../constants/theme';

export interface BrutalBadgeProps {
  label: string;
  variant?: 'yellow' | 'green' | 'red' | 'black' | 'white' | 'blue';
  size?: 'xs' | 'sm' | 'md';
  style?: ViewStyle;
}

export function BrutalBadge({ label, variant = 'yellow', size = 'xs', style }: BrutalBadgeProps) {
  const bgColors: Record<string, string> = {
    yellow: BrutalColors.yellow,
    green: BrutalColors.green,
    red: BrutalColors.red,
    black: BrutalColors.black,
    white: BrutalColors.white,
    blue: BrutalColors.blue,
  };

  const textColors: Record<string, string> = {
    yellow: BrutalColors.black,
    green: BrutalColors.black,
    red: BrutalColors.white,
    black: BrutalColors.white,
    white: BrutalColors.black,
    blue: BrutalColors.white,
  };

  const paddingH = size === 'xs' ? 6 : size === 'sm' ? 8 : 10;
  const paddingV = size === 'xs' ? 2 : size === 'sm' ? 4 : 5;
  const fontSize = size === 'xs' ? 9 : size === 'sm' ? 10 : 11;

  return (
    <View
      style={[
        {
          backgroundColor: bgColors[variant] || BrutalColors.yellow,
          borderColor: BrutalColors.black,
          borderWidth: 1.5,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={{
          color: textColors[variant] || BrutalColors.black,
          fontSize,
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
