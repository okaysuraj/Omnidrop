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
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RateOrderScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'DISPATCH SPEED',
    'PACKAGING INTEGRITY',
  ]);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const ratingLabels = [
    'UNACCEPTABLE (1/5)',
    'SUBPAR (2/5)',
    'NOMINAL (3/5)',
    'EXCELLENT (4/5)',
    'FLAWLESS (5/5)',
  ];
  const tags = [
    'DISPATCH SPEED',
    'PACKAGING INTEGRITY',
    'TEMPERATURE',
    'FRESHNESS',
    'COURIER COURTESY',
    'PORTION ACCURACY',
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!orderId) {
      Alert.alert('Notice', 'Telemetry recorded locally. Missing order identifier.');
      router.push('/(customer)/home');
      return;
    }
    setSubmitting(true);
    try {
      await api.reviews.create({
        orderId: orderId as string,
        storeRating: rating,
        riderRating: rating,
        comment: `${selectedTags.join(', ')}${comments ? ` - ${comments}` : ''}`,
      });
      Alert.alert('REVIEW RECORDED', 'Telemetry & delivery rating synced with dispatch node.', [
        { text: 'RETURN HOME', onPress: () => router.push('/(customer)/home') },
      ]);
    } catch (err) {
      Alert.alert(
        'Review Error',
        getErrorMessage(err) || getErrorMessage(err) || 'Could not record review.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <BrutalTelemetryStrip left="DEBRIEF // QUALITY ASSURANCE" right="QOS-SYNC: OK" />

        <BrutalHeader
          title="Rate Mission"
          subtitle="Delivery Debrief"
          onBack={() => router.back()}
          rightAction={<BrutalBadge label="DEBRIEF" variant="yellow" />}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Context Card */}
          <BrutalCard style={{ marginBottom: 16, padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.contextImageContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
                  }}
                  style={styles.contextImage}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contextLabel}>COMPLETED MISSION</Text>
                <Text style={styles.contextTitle} numberOfLines={1}>
                  Fresh Produce & Pantry Pack
                </Text>
                <Text style={styles.contextSubtitle}>Delivered via Hyperlocal Corridor #04</Text>
              </View>
            </View>
          </BrutalCard>

          {/* Rating Section */}
          <BrutalCard style={{ alignItems: 'center', marginBottom: 16, padding: 18 }}>
            <Text style={styles.ratingTitle}>FULFILLMENT SCORE</Text>
            <Text style={styles.ratingSubtitle}>RATE SPEED, PACKAGING & ACCURACY</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  style={[styles.starButton, star <= rating && styles.starButtonActive]}
                >
                  <MaterialIcons
                    name={star <= rating ? 'star' : 'star-border'}
                    size={28}
                    color={star <= rating ? BrutalColors.black : '#888'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 ? (
              <View style={styles.ratingLabelContainer}>
                <Text style={styles.ratingLabelText}>{ratingLabels[rating - 1]}</Text>
              </View>
            ) : (
              <Text style={styles.placeholderPrompt}>TAP A STAR TO EVALUATE</Text>
            )}
          </BrutalCard>

          {/* Tags Section */}
          <BrutalCard style={{ marginBottom: 16, padding: 16 }}>
            <Text style={styles.sectionTitle}>WHAT STOOD OUT?</Text>
            <Text style={styles.sectionSubtitle}>TAG KEY DELIVERY TELEMETRY POINTS</Text>

            <View style={styles.tagsContainer}>
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagBtn, isSelected && styles.tagBtnSelected]}
                    onPress={() => handleTagToggle(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tagBtnText, isSelected && styles.tagBtnTextSelected]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BrutalCard>

          {/* Comments Section */}
          <BrutalCard style={{ marginBottom: 20, padding: 16 }}>
            <Text style={styles.sectionTitle}>ADDITIONAL FEEDBACK</Text>
            <Text style={styles.sectionSubtitle}>LOG UNEXPECTED CONDITIONS OR COMMENDATIONS</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter field notes on items, delivery rider or store hub..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comments}
              onChangeText={setComments}
            />
          </BrutalCard>

          {/* Submit Action */}
          <BrutalButton
            title={submitting ? 'TRANSMITTING...' : 'TRANSMIT REVIEW →'}
            variant="green"
            disabled={rating === 0 || submitting}
            loading={submitting}
            onPress={handleSubmit}
            size="lg"
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrutalColors.canvas,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  contextImageContainer: {
    width: 54,
    height: 54,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    overflow: 'hidden',
    backgroundColor: BrutalColors.canvas,
  },
  contextImage: {
    width: '100%',
    height: '100%',
  },
  contextLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#666',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  contextTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: BrutalColors.black,
    textTransform: 'uppercase',
  },
  contextSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginTop: 2,
  },
  ratingTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
  },
  ratingSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    marginTop: 2,
    marginBottom: 14,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  starButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BrutalColors.black,
    backgroundColor: BrutalColors.white,
    ...BrutalShadow.sm,
  },
  starButtonActive: {
    backgroundColor: BrutalColors.yellow,
  },
  ratingLabelContainer: {
    backgroundColor: BrutalColors.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: BrutalColors.black,
  },
  ratingLabelText: {
    fontSize: 11,
    fontWeight: '900',
    color: BrutalColors.yellow,
    letterSpacing: 0.8,
  },
  placeholderPrompt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: BrutalColors.black,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    marginTop: 2,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: BrutalColors.black,
    backgroundColor: BrutalColors.white,
    ...BrutalShadow.sm,
  },
  tagBtnSelected: {
    backgroundColor: BrutalColors.yellow,
  },
  tagBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: BrutalColors.black,
  },
  tagBtnTextSelected: {
    color: BrutalColors.black,
    fontWeight: '900',
  },
  textInput: {
    backgroundColor: BrutalColors.white,
    borderWidth: 2,
    borderColor: BrutalColors.black,
    padding: 12,
    fontSize: 12,
    color: BrutalColors.black,
    minHeight: 80,
  },
});
