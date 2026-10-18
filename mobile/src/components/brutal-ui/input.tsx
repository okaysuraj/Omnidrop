import { MaterialIcons } from '@expo/vector-icons';
import { Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BrutalColors, BrutalShadow } from '../../constants/theme';
import { BrutalIcon, type IconName } from './icon';

export interface BrutalInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  multiline?: boolean;
  numberOfLines?: number;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: React.ComponentProps<typeof TextInput>['returnKeyType'];
  onSubmitEditing?: () => void;
}

export function BrutalInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  containerStyle,
  autoCapitalize = 'none',
  returnKeyType,
  onSubmitEditing,
}: BrutalInputProps) {
  return (
    <View style={[{ marginBottom: 14 }, containerStyle]}>
      {label && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              letterSpacing: 0.6,
            }}
          >
            {label}
          </Text>
          {hint && <Text style={{ fontSize: 10, fontWeight: '700', color: '#666' }}>{hint}</Text>}
        </View>
      )}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: multiline ? 'flex-start' : 'center',
            backgroundColor: BrutalColors.white,
            borderColor: error ? BrutalColors.red : BrutalColors.black,
            borderWidth: 2,
            paddingHorizontal: 12,
            minHeight: multiline ? (numberOfLines ? numberOfLines * 22 : 80) : 44,
          },
          BrutalShadow.sm,
        ]}
      >
        {leftIcon && (
          <View style={{ marginRight: 8, justifyContent: 'center' }}>
            <BrutalIcon name={leftIcon} size={18} color={'#666'} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#888888"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={[
            {
              flex: 1,
              paddingVertical: multiline ? 8 : 10,
              fontSize: 13,
              fontWeight: '600',
              color: BrutalColors.black,
            },
            style,
          ]}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={{ padding: 4, marginLeft: 4 }}
          >
            <BrutalIcon name={rightIcon} size={18} color={BrutalColors.black} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <MaterialIcons
            name="error-outline"
            size={12}
            color={BrutalColors.red}
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              color: BrutalColors.red,
              fontSize: 11,
              fontWeight: '700',
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
