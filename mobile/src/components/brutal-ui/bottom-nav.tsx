import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { BrutalColors, BrutalShadow } from '../../constants/theme';

export interface BrutalBottomNavProps {
  currentTab: 'home' | 'catalog' | 'orders' | 'profile';
  cartCount?: number;
}

export function BrutalBottomNav({ currentTab, cartCount = 0 }: BrutalBottomNavProps) {
  const router = useRouter();

  const tabs: Array<{
    id: 'home' | 'catalog' | 'orders' | 'profile';
    label: string;
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    route: import('expo-router').Href;
  }> = [
    { id: 'home', label: 'HOME', icon: 'home', route: '/(customer)/home' },
    { id: 'catalog', label: 'CATALOG', icon: 'shopping-bag', route: '/(customer)/products' },
    { id: 'orders', label: 'ORDERS', icon: 'receipt-long', route: '/(customer)/orders' },
    { id: 'profile', label: 'OPERATOR', icon: 'person', route: '/(customer)/profile' },
  ];

  return (
    <View
      style={{
        backgroundColor: BrutalColors.white,
        borderTopWidth: 2,
        borderTopColor: BrutalColors.black,
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 8,
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              if (!isActive) {
                router.push(tab.route);
              }
            }}
            activeOpacity={0.8}
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 5,
                paddingHorizontal: 4,
                marginHorizontal: 3,
                borderWidth: isActive ? 2 : 0,
                borderColor: BrutalColors.black,
                backgroundColor: isActive ? BrutalColors.yellow : 'transparent',
              },
              isActive ? BrutalShadow.sm : {},
            ]}
          >
            <View style={{ position: 'relative' }}>
              <MaterialIcons name={tab.icon} size={19} color={BrutalColors.black} />
              {tab.id === 'catalog' && cartCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    backgroundColor: BrutalColors.black,
                    borderRadius: 0,
                    borderWidth: 1,
                    borderColor: BrutalColors.yellow,
                    minWidth: 14,
                    height: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}
                >
                  <Text style={{ color: BrutalColors.yellow, fontSize: 8, fontWeight: '900' }}>
                    {cartCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: 9,
                fontWeight: '900',
                color: BrutalColors.black,
                marginTop: 2,
                letterSpacing: 0.5,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
