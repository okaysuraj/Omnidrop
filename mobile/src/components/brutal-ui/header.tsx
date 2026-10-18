import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BrutalColors, BrutalShadow } from '../../constants/theme';

export interface BrutalHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function BrutalHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
}: BrutalHeaderProps) {
  const router = useRouter();

  return (
    <View
      style={{
        backgroundColor: BrutalColors.white,
        borderBottomWidth: 2,
        borderBottomColor: BrutalColors.black,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack || (() => router.back())}
            style={[
              {
                width: 34,
                height: 34,
                backgroundColor: BrutalColors.yellow,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="arrow-back" size={18} color={BrutalColors.black} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              letterSpacing: 0.5,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: 9,
                fontWeight: '700',
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>{rightAction}</View>
      )}
    </View>
  );
}
