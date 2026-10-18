import {
  BrutalBadge,
  BrutalButton,
  BrutalCard,
  BrutalHeader,
  BrutalTelemetryStrip,
} from '@/components/brutal-ui';
import { BrutalColors, BrutalShadow } from '@/constants/theme';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type * as Models from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WalletScreen() {
  const router = useRouter();
  const [wallet, setWallet] = useState<Models.WalletDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [topupAmount, setTopupAmount] = useState('500');
  const [processing, setProcessing] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const data = await api.wallet.get();
      setWallet(data);
    } catch (e) {
      console.error('Failed to load wallet', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTopup = async () => {
    const amountNum = parseFloat(topupAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid top-up amount.');
      return;
    }
    setProcessing(true);
    try {
      await api.wallet.topup(amountNum);
      setModalVisible(false);
      Alert.alert('Balance Updated', `₹${amountNum.toFixed(0)} credited to your Omni Wallet!`);
      fetchWallet();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e) || 'Failed to top up wallet.');
    } finally {
      setProcessing(false);
    }
  };

  const balance = Number(wallet?.balance ?? 0);
  const transactions = wallet?.transactions || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrutalColors.bg }} edges={['top']}>
      <BrutalTelemetryStrip text="⚡ DIGITAL WALLET · ZERO PAYMENT LATENCY" />
      <BrutalHeader
        title="Omni Wallet"
        subtitle="Digital Balance Vault"
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={fetchWallet}
            style={[
              {
                width: 36,
                height: 36,
                backgroundColor: BrutalColors.white,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons name="refresh" size={20} color={BrutalColors.black} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Available Balance Card */}
        <BrutalCard bg={BrutalColors.yellow} style={{ padding: 22, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: BrutalColors.black,
              }}
            >
              Available Liquidity
            </Text>
            <BrutalBadge label="ACTIVE VAULT" variant="black" />
          </View>

          {loading ? (
            <ActivityIndicator
              size="small"
              color={BrutalColors.black}
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Text
              style={{
                fontSize: 36,
                fontWeight: '900',
                color: BrutalColors.black,
                letterSpacing: -1,
              }}
            >
              ₹{balance.toFixed(0)}
            </Text>
          )}

          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#333',
              marginTop: 4,
              marginBottom: 14,
            }}
          >
            Direct 1-tap authorization with zero gateway dropoffs or bank OTP delays.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
            style={[
              {
                backgroundColor: BrutalColors.black,
                borderWidth: 2,
                borderColor: BrutalColors.black,
                paddingVertical: 10,
                paddingHorizontal: 16,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
              },
              BrutalShadow.sm,
            ]}
          >
            <MaterialIcons
              name="add"
              size={18}
              color={BrutalColors.yellow}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color: BrutalColors.yellow,
                fontWeight: '900',
                fontSize: 12,
                textTransform: 'uppercase',
              }}
            >
              Add Balance →
            </Text>
          </TouchableOpacity>
        </BrutalCard>

        {/* Benefits Strip */}
        <BrutalCard style={{ padding: 14, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: BrutalColors.green,
                borderWidth: 1.5,
                borderColor: BrutalColors.black,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <MaterialIcons name="bolt" size={20} color={BrutalColors.black} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Expedited Dispatch Advantage
              </Text>
              <Text style={{ fontSize: 10, color: '#555', marginTop: 1, lineHeight: 14 }}>
                Orders settled via Omni Wallet skip bank redirects for immediate dispatch queue
                assignment.
              </Text>
            </View>
          </View>
        </BrutalCard>

        {/* Transaction History */}
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: BrutalColors.black,
              marginBottom: 10,
            }}
          >
            Recent Ledger Entries
          </Text>

          {loading ? (
            <ActivityIndicator size="small" color={BrutalColors.black} style={{ marginTop: 20 }} />
          ) : transactions.length === 0 ? (
            <BrutalCard style={{ padding: 24, alignItems: 'center' }}>
              <MaterialIcons name="receipt-long" size={36} color={BrutalColors.black} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  marginTop: 8,
                }}
              >
                No Transactions Recorded
              </Text>
              <Text style={{ fontSize: 11, color: '#666', textAlign: 'center', marginTop: 2 }}>
                Top up to start settling instant orders with 1-tap.
              </Text>
            </BrutalCard>
          ) : (
            <View style={{ gap: 10 }}>
              {transactions.map((tx) => {
                const isCredit = tx.type === 'CREDIT';
                return (
                  <BrutalCard
                    key={tx.id}
                    style={{
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        marginRight: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: isCredit ? BrutalColors.green : '#FFEBEA',
                          borderWidth: 1.5,
                          borderColor: BrutalColors.black,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}
                      >
                        <MaterialIcons
                          name={isCredit ? 'arrow-downward' : 'arrow-upward'}
                          size={16}
                          color={isCredit ? BrutalColors.black : BrutalColors.red}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            color: BrutalColors.black,
                          }}
                          numberOfLines={1}
                        >
                          {tx.description || (isCredit ? 'Wallet Top-up' : 'Order Payment')}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#666', marginTop: 1 }}>
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '900',
                        color: isCredit ? '#008855' : BrutalColors.black,
                      }}
                    >
                      {isCredit ? '+' : '-'}₹{Number(tx.amount).toFixed(0)}
                    </Text>
                  </BrutalCard>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Top-up Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: BrutalColors.bg,
              borderTopWidth: 3,
              borderTopColor: BrutalColors.black,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  color: BrutalColors.black,
                }}
              >
                Top-Up Wallet Vault
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderWidth: 2,
                  borderColor: BrutalColors.black,
                  backgroundColor: BrutalColors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="close" size={18} color={BrutalColors.black} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                textTransform: 'uppercase',
                color: '#666',
                marginBottom: 8,
              }}
            >
              Quick Amount Selection:
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {['200', '500', '1000', '2000'].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setTopupAmount(amt)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderColor: BrutalColors.black,
                    backgroundColor: topupAmount === amt ? BrutalColors.yellow : BrutalColors.white,
                    paddingVertical: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '900' }}>₹{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={topupAmount}
              onChangeText={setTopupAmount}
              keyboardType="numeric"
              placeholder="Enter custom amount"
              style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 2,
                borderColor: BrutalColors.black,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 16,
                fontWeight: '900',
                color: BrutalColors.black,
                marginBottom: 16,
              }}
            />

            <BrutalButton
              title={
                processing ? 'CREDITING BALANCE...' : `CONFIRM ₹${topupAmount || '0'} CREDIT →`
              }
              onPress={handleTopup}
              loading={processing}
              variant="yellow"
              size="lg"
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
