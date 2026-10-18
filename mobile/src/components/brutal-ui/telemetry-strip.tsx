import { Text, View } from 'react-native';
import { BrutalColors } from '../../constants/theme';

export function BrutalTelemetryStrip({
  text,
  left,
  right,
}: {
  text?: string;
  left?: string;
  right?: string;
}) {
  if (left || right) {
    return (
      <View
        style={{
          backgroundColor: BrutalColors.black,
          paddingVertical: 4,
          paddingHorizontal: 14,
          borderBottomWidth: 2,
          borderBottomColor: BrutalColors.black,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: BrutalColors.yellow,
            fontSize: 9,
            fontWeight: '900',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {left || ''}
        </Text>
        <Text
          style={{
            color: BrutalColors.white,
            fontSize: 9,
            fontWeight: '900',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {right || ''}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: BrutalColors.black,
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderBottomWidth: 2,
        borderBottomColor: BrutalColors.black,
      }}
    >
      <Text
        style={{
          color: BrutalColors.yellow,
          fontSize: 9,
          fontWeight: '900',
          textAlign: 'center',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {text || '⚡ 12-MIN DISPATCH · 38/38 MICRO-HUBS LIVE'}
      </Text>
    </View>
  );
}
