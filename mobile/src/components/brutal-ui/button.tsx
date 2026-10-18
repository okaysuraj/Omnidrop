import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { BrutalColors, BrutalShadow } from '../../constants/theme';
import { BrutalIcon, type IconName } from './icon';

export interface BrutalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'yellow' | 'black' | 'white' | 'green' | 'red' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  fullWidth?: boolean;
}

export function BrutalButton({
  title,
  onPress,
  variant = 'yellow',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: BrutalButtonProps) {
  const bgColors: Record<string, string> = {
    yellow: BrutalColors.yellow,
    black: BrutalColors.black,
    white: BrutalColors.white,
    green: BrutalColors.green,
    red: BrutalColors.red,
    subtle: BrutalColors.subtle,
  };

  const textColors: Record<string, string> = {
    yellow: BrutalColors.black,
    black: BrutalColors.white,
    white: BrutalColors.black,
    green: BrutalColors.black,
    red: BrutalColors.white,
    subtle: BrutalColors.black,
  };

  const padVertical = size === 'sm' ? 8 : size === 'lg' ? 14 : 11;
  const padHorizontal = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
  const fontSize = size === 'sm' ? 11 : size === 'lg' ? 14 : 12;

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <BrutalIcon
        name={icon}
        size={fontSize + 4}
        color={textColors[variant]}
        style={iconPosition === 'left' ? { marginRight: 6 } : { marginLeft: 6 }}
      />
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: bgColors[variant] || BrutalColors.yellow,
          borderColor: BrutalColors.black,
          borderWidth: 2,
          paddingVertical: padVertical,
          paddingHorizontal: padHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.45 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        BrutalShadow.sm,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColors[variant]} />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <Text
            style={[
              {
                color: textColors[variant],
                fontWeight: '900',
                fontSize,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
}
